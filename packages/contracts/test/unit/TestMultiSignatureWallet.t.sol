// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import "forge-std/Test.sol";
import {MultiSignatureWallet} from "src/MultiSignatureWallet.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract TestMultiSignatureWallet is Test {
    // ────────────────────────────────────────────────────────────────────────────────
    // Constants & immutable variables
    // ────────────────────────────────────────────────────────────────────────────────
    MultiSignatureWallet wallet;

    Vm.Wallet WALLET_1 = vm.createWallet("signer1");
    Vm.Wallet WALLET_2 = vm.createWallet("signer2");
    Vm.Wallet WALLET_3 = vm.createWallet("signer3");

    address immutable NON_OWNER = makeAddr("nonOwner");
    address immutable RECIPIENT = makeAddr("recipient");

    uint256 constant SIGNATURES_REQUIRED = 2;

    // ────────────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ────────────────────────────────────────────────────────────────────────────────

    function _buildSignatures(Vm.Wallet[] memory signersToUse, bytes32 rawHash) internal returns (bytes[] memory sigs) {
        sigs = new bytes[](signersToUse.length);

        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(rawHash);

        for (uint256 i = 0; i < signersToUse.length; i++) {
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(signersToUse[i], ethSignedHash);
            sigs[i] = abi.encodePacked(r, s, v);
        }
    }

    function _sortWalletsByAddress(Vm.Wallet[] memory wallets) internal pure returns (Vm.Wallet[] memory sorted) {
        uint256 len = wallets.length;
        sorted = new Vm.Wallet[](len);

        // Copy original array
        for (uint256 i = 0; i < len; i++) {
            sorted[i] = wallets[i];
        }

        // Bubble sort by address
        for (uint256 i = 0; i < len; i++) {
            for (uint256 j = 0; j < len - i - 1; j++) {
                if (sorted[j].addr > sorted[j + 1].addr) {
                    (sorted[j], sorted[j + 1]) = (sorted[j + 1], sorted[j]);
                }
            }
        }
    }

    // ────────────────────────────────────────────────────────────────────────────────
    // Test setUp
    // ────────────────────────────────────────────────────────────────────────────────

    function setUp() public {
        address[] memory initialOwners = new address[](3);
        initialOwners[0] = WALLET_1.addr;
        initialOwners[1] = WALLET_2.addr;
        initialOwners[2] = WALLET_3.addr;

        wallet = new MultiSignatureWallet();
        wallet.initialize(initialOwners, SIGNATURES_REQUIRED);
    }

    // ────────────────────────────────────────────────────────────────────────────────
    // 1. Initialization & basic state
    // ────────────────────────────────────────────────────────────────────────────────

    function test_InitializationSetsCorrectState() public view {
        assertEq(wallet.signaturesRequired(), SIGNATURES_REQUIRED);
        assertEq(wallet.nonce(), 0);
        assertEq(wallet.getSigners().length, 3);
        assertTrue(wallet.isSigner(WALLET_1.addr));
        assertTrue(wallet.isSigner(WALLET_2.addr));
        assertTrue(wallet.isSigner(WALLET_3.addr));
        assertFalse(wallet.isSigner(NON_OWNER));
    }

    function test_RevertWhen_Reinitialize() public {
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        wallet.initialize(new address[](0), 1);
    }

    function test_RevertWhen_InitializeWithZeroThreshold() public {
        MultiSignatureWallet bad = new MultiSignatureWallet();

        address[] memory owners = new address[](1);
        owners[0] = WALLET_1.addr;

        vm.expectRevert(MultiSignatureWallet.MultiSignatureWallet__SignaturesRequiredCantBe0.selector);
        bad.initialize(owners, 0);
    }

    function test_RevertWhen_InitializeWithDuplicateSigner() public {
        MultiSignatureWallet bad = new MultiSignatureWallet();

        address[] memory owners = new address[](2);
        owners[0] = WALLET_1.addr;
        owners[1] = WALLET_1.addr; // duplicate

        vm.expectRevert(MultiSignatureWallet.MultiSignatureWallet__AlreadyASigner.selector);
        bad.initialize(owners, 1);
    }

    // ────────────────────────────────────────────────────────────────────────────────
    // 2. Owner management (direct calls via onlySelf)
    // ────────────────────────────────────────────────────────────────────────────────

    function test_AddSigner_Success() public {
        address newSigner = makeAddr("new4");

        vm.prank(address(wallet));
        wallet.addSigner(newSigner);

        assertTrue(wallet.isSigner(newSigner));
        assertEq(wallet.getSigners().length, 4);
    }

    function test_RevertWhen_AddDuplicateSigner() public {
        vm.prank(address(wallet));
        vm.expectRevert(MultiSignatureWallet.MultiSignatureWallet__AlreadyASigner.selector);
        wallet.addSigner(WALLET_1.addr);
    }

    function test_RemoveSigner_Success() public {
        vm.prank(address(wallet));
        wallet.removeSigner(WALLET_3.addr);

        assertFalse(wallet.isSigner(WALLET_3.addr));
        assertEq(wallet.getSigners().length, 2);
    }

    function test_RevertWhen_RemoveSigner_BreaksThreshold() public {
        vm.startPrank(address(wallet));
        wallet.removeSigner(WALLET_3.addr);
        vm.expectRevert(MultiSignatureWallet.MultiSignatureWallet__LessSignersThanSingaturesRequired.selector);
        wallet.removeSigner(WALLET_2.addr);
        vm.stopPrank();
    }

    // ────────────────────────────────────────────────────────────────────────────────
    // 3. Combined owner + threshold updates via executeTransaction
    // ────────────────────────────────────────────────────────────────────────────────

    function test_UpdateSignaturesRequired_ViaExecute() public {
        bytes memory data = abi.encodeWithSignature("updateSignaturesRequired(uint256)", 1);
        bytes32 hash = wallet.getTransactionHash(wallet.nonce(), address(wallet), 0, data);

        Vm.Wallet[] memory signersUsed = new Vm.Wallet[](2);
        signersUsed[0] = WALLET_1;
        signersUsed[1] = WALLET_2;

        Vm.Wallet[] memory sortedSigners = _sortWalletsByAddress(signersUsed);
        bytes[] memory sigs = _buildSignatures(sortedSigners, hash);

        vm.prank(WALLET_1.addr);
        wallet.executeTransaction(payable(address(wallet)), 0, data, sigs);

        assertEq(wallet.signaturesRequired(), 1);
    }

    function test_AddSignerAndUpdateSignaturesRequired_ViaExecute() public {
        address newSigner = makeAddr("new4");
        uint256 newThreshold = 1;

        bytes memory callData =
            abi.encodeWithSignature("addSignerAndUpdateSignaturesRequired(address,uint256)", newSigner, newThreshold);

        bytes32 txHash = wallet.getTransactionHash(wallet.nonce(), address(wallet), 0, callData);

        Vm.Wallet[] memory signersUsed = new Vm.Wallet[](2);
        signersUsed[0] = WALLET_1;
        signersUsed[1] = WALLET_2;

        Vm.Wallet[] memory sortedSigners = _sortWalletsByAddress(signersUsed);
        bytes[] memory sigs = _buildSignatures(sortedSigners, txHash);

        vm.prank(WALLET_1.addr);
        wallet.executeTransaction(payable(address(wallet)), 0, callData, sigs);

        assertTrue(wallet.isSigner(newSigner));
        assertEq(wallet.signaturesRequired(), newThreshold);
        assertEq(wallet.getSigners().length, 4);
    }

    function test_RemoveSignerAndUpdateSignaturesRequired_ViaExecute() public {
        uint256 newThreshold = 1;

        bytes memory callData = abi.encodeWithSignature(
            "removeSignersAndUpdateSignaturesRequired(address,uint256)", WALLET_3.addr, newThreshold
        );

        bytes32 txHash = wallet.getTransactionHash(wallet.nonce(), address(wallet), 0, callData);

        Vm.Wallet[] memory signersUsed = new Vm.Wallet[](2);
        signersUsed[0] = WALLET_1;
        signersUsed[1] = WALLET_2;

        Vm.Wallet[] memory sortedSigners = _sortWalletsByAddress(signersUsed);
        bytes[] memory sigs = _buildSignatures(sortedSigners, txHash);

        vm.prank(WALLET_1.addr);
        wallet.executeTransaction(payable(address(wallet)), 0, callData, sigs);

        assertFalse(wallet.isSigner(WALLET_3.addr));
        assertEq(wallet.signaturesRequired(), newThreshold);
        assertEq(wallet.getSigners().length, 2);
    }

    // ────────────────────────────────────────────────────────────────────────────────
    // 4. executeTransaction - Happy paths
    // ────────────────────────────────────────────────────────────────────────────────

    function test_ExecuteTransaction_Success_With2Signatures() public {
        vm.deal(address(wallet), 1 ether);

        bytes memory callData = abi.encodeWithSignature("transfer(address,uint256)", RECIPIENT, 0.5 ether);
        bytes32 txHash = wallet.getTransactionHash(wallet.nonce(), RECIPIENT, 0.5 ether, callData);

        Vm.Wallet[] memory signersUsed = new Vm.Wallet[](2);
        signersUsed[0] = WALLET_1;
        signersUsed[1] = WALLET_2;

        Vm.Wallet[] memory sortedSigners = _sortWalletsByAddress(signersUsed);
        bytes[] memory sigs = _buildSignatures(sortedSigners, txHash);

        uint256 balanceBefore = RECIPIENT.balance;

        vm.prank(WALLET_1.addr);
        wallet.executeTransaction(payable(RECIPIENT), 0.5 ether, callData, sigs);

        assertEq(RECIPIENT.balance, balanceBefore + 0.5 ether);
        assertEq(wallet.nonce(), 1);
    }

    function test_AddSignerViaExecute() public {
        address newSigner = makeAddr("new4");

        bytes memory callData = abi.encodeWithSignature("addSigner(address)", newSigner);
        bytes32 txHash = wallet.getTransactionHash(wallet.nonce(), address(wallet), 0, callData);

        Vm.Wallet[] memory signersUsed = new Vm.Wallet[](2);
        signersUsed[0] = WALLET_1;
        signersUsed[1] = WALLET_2;

        Vm.Wallet[] memory sortedSigners = _sortWalletsByAddress(signersUsed);
        bytes[] memory sigs = _buildSignatures(sortedSigners, txHash);

        vm.prank(WALLET_1.addr);
        wallet.executeTransaction(payable(address(wallet)), 0, callData, sigs);

        assertTrue(wallet.isSigner(newSigner));
        assertEq(wallet.getSigners().length, 4);
    }

    // ────────────────────────────────────────────────────────────────────────────────
    // 5. executeTransaction - Revert cases
    // ────────────────────────────────────────────────────────────────────────────────

    function test_RevertWhen_SignaturesNotSorted() public {
        bytes memory callData = "";
        bytes32 txHash = wallet.getTransactionHash(wallet.nonce(), address(0), 0, callData);

        Vm.Wallet[] memory signersUsed = new Vm.Wallet[](2);
        signersUsed[0] = WALLET_1;
        signersUsed[1] = WALLET_2;

        bytes[] memory sigs = _buildSignatures(signersUsed, txHash);

        // Intentionally wrong order (descending)
        if (WALLET_1.addr < WALLET_2.addr) {
            (sigs[0], sigs[1]) = (sigs[1], sigs[0]);
        }

        vm.prank(WALLET_1.addr);
        vm.expectRevert(MultiSignatureWallet.MultiSignatureWallet__DuplicatedOrRevertedSignature.selector);
        wallet.executeTransaction(payable(address(0)), 0, callData, sigs);
    }

    function test_RevertWhen_DuplicateSignature() public {
        bytes memory callData = "";
        bytes32 txHash = wallet.getTransactionHash(wallet.nonce(), address(0), 0, callData);

        Vm.Wallet[] memory signersUsed = new Vm.Wallet[](1);
        signersUsed[0] = WALLET_1;

        bytes[] memory oneSig = _buildSignatures(signersUsed, txHash);

        bytes[] memory sigs = new bytes[](3);
        sigs[0] = oneSig[0];
        sigs[1] = oneSig[0]; // duplicate
        sigs[2] = oneSig[0];

        vm.prank(WALLET_1.addr);
        vm.expectRevert(MultiSignatureWallet.MultiSignatureWallet__DuplicatedOrRevertedSignature.selector);
        wallet.executeTransaction(payable(address(0)), 0, callData, sigs);
    }

    function test_RevertWhen_NotEnoughValidSignatures() public {
        bytes memory callData = "";
        bytes32 txHash = wallet.getTransactionHash(wallet.nonce(), address(0), 0, callData);

        Vm.Wallet[] memory onlyOne = new Vm.Wallet[](1);
        onlyOne[0] = WALLET_1;

        Vm.Wallet[] memory sorted = _sortWalletsByAddress(onlyOne);
        bytes[] memory sigs = _buildSignatures(sorted, txHash);

        vm.prank(WALLET_1.addr);
        vm.expectRevert(MultiSignatureWallet.MultiSignatureWallet__NotEnoughValidSignatures.selector);
        wallet.executeTransaction(payable(address(0)), 0, callData, sigs);
    }

    function test_RevertWhen_NonSignerExecutes() public {
        bytes[] memory emptySigs = new bytes[](0);

        vm.prank(NON_OWNER);
        vm.expectRevert(MultiSignatureWallet.MultiSignatureWallet__AddressIsNotASigner.selector);
        wallet.executeTransaction(payable(address(0)), 0, "", emptySigs);
    }

    function test_RevertWhen_ReplayWithSameNonce() public {
        bytes memory callData = "";
        bytes32 txHash = wallet.getTransactionHash(wallet.nonce(), address(0), 0, callData);

        Vm.Wallet[] memory signersUsed = new Vm.Wallet[](2);
        signersUsed[0] = WALLET_1;
        signersUsed[1] = WALLET_2;

        Vm.Wallet[] memory sortedSigners = _sortWalletsByAddress(signersUsed);
        bytes[] memory sigs = _buildSignatures(sortedSigners, txHash);

        vm.prank(WALLET_1.addr);
        wallet.executeTransaction(payable(address(0)), 0, callData, sigs);

        vm.expectRevert(); // nonce mismatch → invalid sig or revert in recover
        wallet.executeTransaction(payable(address(0)), 0, callData, sigs);
    }

    // ────────────────────────────────────────────────────────────────────────────────
    // 6. Receive function (for coverage)
    // ────────────────────────────────────────────────────────────────────────────────

    function test_ReceiveEther_EmitsEvent() public {
        vm.deal(address(this), 1 ether);

        vm.expectEmit(true, true, false, true);
        emit MultiSignatureWallet.EtherReceived(address(this), 0.5 ether);

        (bool success,) = address(wallet).call{value: 0.5 ether}("");
        assertTrue(success);
    }

    // ────────────────────────────────────────────────────────────────────────────────
    // 7. Misc coverage helpers (pure functions, wrappers)
    // ────────────────────────────────────────────────────────────────────────────────

    function test_GetSignerAddress_ReturnsRecoveredSigner() public {
        bytes32 dummyHash = keccak256(abi.encodePacked("test hash"));
        bytes32 ethHash = MessageHashUtils.toEthSignedMessageHash(dummyHash);

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(WALLET_1, ethHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        address recovered = wallet.getSignerAddress(dummyHash, signature);

        assertEq(recovered, WALLET_1.addr);
    }
}
