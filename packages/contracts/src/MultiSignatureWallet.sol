// SPDX-License-Identifier: MIT

pragma solidity ^0.8.31;
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title MultiSignatureWallet
 * @author Agustin Jaralampidis
 * @notice A multi-signature wallet based on Gnosis Safe v1.3 (https://github.com/safe-fndn/safe-smart-account/blob/release/v1.3.0/contracts/GnosisSafe.sol)
 *         and Ethereum Speedrun (https://github.com/scaffold-eth/se-2-challenges/blob/challenge-multisig/extension/packages/hardhat/contracts/MetaMultiSigWallet.sol)
 *
 * @notice Concepts:
 * - Signers: the allowed addreses to sign transactions
 * - signaturesRequired: Required amount of signers to execute a transaction
 * - Nonce: Each transaction should have a different nonce to prevent replay attacks. (number used once)
 *
 */
contract MultiSignatureWallet is Initializable {
    ////// Errors
    error MultiSignatureWallet__AlreadyInitialized();
    error MultiSignatureWallet__SignaturesRequiredCantBe0();
    error MultiSignatureWallet__AddressIsNotASigner();
    error MultiSignatureWallet__AlreadyASigner();
    error MultiSignatureWallet__OnlySelfAllowed();
    error MultiSignatureWallet__LessSignersThanSingaturesRequired();
    error MultiSignatureWallet__DuplicatedOrRevertedSignature();
    error MultiSignatureWallet__NotEnoughValidSignatures();
    error MultiSignatureWallet__ExternalTransactionFailed();

    ////// Libraries
    using MessageHashUtils for bytes32;

    ////// State
    address[] public signers; // This allows us to iterate and show all signers
    mapping(address => bool) public isSigner; // Efficient way to know if a random addr is signer.
    // ↑ signers array + isSigner mapping = iterable + fast check. Both track "the same data" (signers)
    uint256 public signaturesRequired;
    uint256 public nonce;

    ////// Events
    event ExecuteTransaction(
        address indexed signer, address payable to, uint256 value, bytes data, uint256 nonce, bytes32 hash
    );
    event SignerAdded(address indexed signer);
    event SignerRemoved(address indexed signer);
    event SignaturesRequiredUpdated(uint256 indexed signaturesRequired);
    event EtherReceived(address indexed sender, uint256 amount);

    ////// Modifiers
    modifier onlySelf() {
        if (msg.sender != address(this)) revert MultiSignatureWallet__OnlySelfAllowed();
        _;
    }

    // constructor() {} // Initializable must not have constructor

    function initialize(address[] memory _signers, uint256 _signaturesRequired) external initializer {
        // if (signers.length > 0) revert MultiSignatureWallet__AlreadyInitialized(); → TRhis is handled by Open Zeppelin Initializable
        if (_signaturesRequired == 0) revert MultiSignatureWallet__SignaturesRequiredCantBe0();

        for (uint256 i = 0; i < _signers.length; i++) {
            address signer = _signers[i];
            if (signer == address(0)) revert MultiSignatureWallet__AddressIsNotASigner();
            if (isSigner[signer]) revert MultiSignatureWallet__AlreadyASigner();
            isSigner[signer] = true;
            emit SignerAdded(signer);
        }

        signers = _signers;
        signaturesRequired = _signaturesRequired;
    }

    // Some wallets and dApps send ETH with empty calldata using a plain transfer (no data)
    // This calls receive() if it exists, or reverts if neither receive() nor payable fallback() exists.
    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    ////// Public Functions
    function addSigner(address newSigner) public onlySelf {
        if (newSigner == address(0)) revert MultiSignatureWallet__AddressIsNotASigner();
        if (isSigner[newSigner]) revert MultiSignatureWallet__AlreadyASigner();

        isSigner[newSigner] = true;
        signers.push(newSigner);

        emit SignerAdded(newSigner);
    }

    function removeSigner(address signerToRemove) public onlySelf {
        if (!isSigner[signerToRemove]) revert MultiSignatureWallet__AddressIsNotASigner();
        if (signers.length - 1 < signaturesRequired) revert MultiSignatureWallet__LessSignersThanSingaturesRequired();

        isSigner[signerToRemove] = false;

        // Find and swap-pop - O(n) - We expect signers to be <=20 so while n<=20 this should not be an issue) - We could enforce a CAP
        for (uint256 i = 0; i < signers.length; i++) {
            if (signers[i] == signerToRemove) {
                signers[i] = signers[signers.length - 1];
                signers.pop();
                break;
            }
        }

        emit SignerRemoved(signerToRemove);
    }

    function updateSignaturesRequired(uint256 newSignaturesRequired) public onlySelf {
        if (newSignaturesRequired == 0) revert MultiSignatureWallet__SignaturesRequiredCantBe0();
        signaturesRequired = newSignaturesRequired;

        emit SignaturesRequiredUpdated(newSignaturesRequired);
    }

    function addSignerAndUpdateSignaturesRequired(address newSigner, uint256 newSignaturesRequired) public onlySelf {
        addSigner(newSigner);
        updateSignaturesRequired(newSignaturesRequired);
    }

    function removeSignersAndUpdateSignaturesRequired(address signerToRemove, uint256 newSignaturesRequired)
        public
        onlySelf
    {
        removeSigner(signerToRemove);
        updateSignaturesRequired(newSignaturesRequired);
    }

    /**
     * @dev Computes the unique hash that represents a proposed transaction.
     *      This hash is what owners must sign to approve the action.
     *
     * @param _nonce    The current nonce of the multisig wallet.
     *                  Prevents replay attacks (same signature can't be reused).
     * @param to        The target address the multisig will call (can be address(this) for internal actions).
     * @param value     The amount of ETH to send with the call (usually 0 for owner changes).
     * @param data      The calldata to execute on `to` (encoded function call).
     *
     * @notice The hash also includes the multisig address (`address(this)`) and current chain ID
     *         to prevent replay attacks across different contracts or networks.
     *
     * @notice This follows the classic pattern used in many multisig wallets (inspired by Gnosis Safe style),
     *         where the signed payload binds the action to a specific wallet and chain.
     *
     * @return The keccak256 hash that signers must sign (usually wrapped with Ethereum signed message prefix later).
     */
    function getTransactionHash(uint256 _nonce, address to, uint256 value, bytes memory data)
        public
        view
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(address(this), block.chainid, _nonce, to, value, data));
    }

    /**
     * @dev Recovers the signer address from an Ethereum-signed message signature.
     *
     * @param _hash       The raw transaction hash as returned by `getTransactionHash(...)`.
     *                    This is the exact hash that must have been signed by the signer.
     * @param _signature  The 65-byte ECDSA signature (r || s || v concatenated, 32 + 32 + 1 bytes)
     *                    that proves an signer approved this specific transaction.
     *
     *                    This signature is produced by the following steps (which happen off-chain):
     *                    1. The proposer computes the transaction hash using `getTransactionHash(nonce, to, value, data)`
     *                    2. The signer wallet prefixes that hash with "\x19Ethereum Signed Message:\n32" (EIP-191 standard)
     *                    3. The signer signs the prefixed hash using their private key
     *                    4. The resulting 65-byte signature is collected and submitted on-chain
     *
     *                    In practice, this is what occurs when an signer uses:
     *                    - `signer.signMessage(...)` in ethers.js / viem
     *                    - MetaMask / Rabby / WalletConnect "Sign" button
     *                    - Or any `personal_sign` / `eth_sign` RPC call
     *
     * @notice Important: Normal wallets (MetaMask, ethers.js `signMessage`, etc.) do NOT sign
     *         the raw `_hash`. They automatically add the Ethereum message prefix:
     *         `"\x19Ethereum Signed Message:\n32" + _hash`
     *
     * @notice `getTransactionHash` and this `getSignerAddress` function are complementary:
     *         - `getTransactionHash` creates the payload that needs to be signed
     *         - `getSignerAddress` retrives the address who signed that payload (after applying the Ethereum message prefix)
     *
     * @return The Ethereum address that produced the signature.
     */
    function getSignerAddress(bytes32 _hash, bytes memory _signature) public pure returns (address) {
        return ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(_hash), _signature);
    }

    /**
     *
     * @param to The target address the multisig will call (can be address(this) for internal actions).
     * @param value The amount of ETH to send with the call (usually 0 for owner changes).
     * @param data The calldata to execute on `to` (encoded function call).
     * @param signatures Array of all the 65-byte ECDSA signatures required to prove all signers approved this specific transaction.
     */
    function executeTransaction(address payable to, uint256 value, bytes memory data, bytes[] memory signatures)
        public
        returns (bytes memory)
    {
        // Checks
        if (!isSigner[msg.sender]) revert MultiSignatureWallet__AddressIsNotASigner();
        bytes32 txHash = getTransactionHash(nonce, to, value, data);
        uint256 validSignatures = 0;
        address duplicateGuard = address(0);

        for (uint256 i = 0; i < signatures.length; i++) {
            address signerAddress = getSignerAddress(txHash, signatures[i]);

            // This checking requires that the signatures array must be ordered. BUT is very gass efficient. (we only use duplicateGuard instead of an array or mapping)
            if (signerAddress <= duplicateGuard) revert MultiSignatureWallet__DuplicatedOrRevertedSignature();
            duplicateGuard = signerAddress;

            if (isSigner[signerAddress]) validSignatures++;
        }

        if (validSignatures < signaturesRequired) revert MultiSignatureWallet__NotEnoughValidSignatures();

        // Effects
        emit ExecuteTransaction(msg.sender, to, value, data, nonce, txHash);
        nonce++;

        // Interactions
        (bool success, bytes memory result) = to.call{value: value}(data);
        if (!success) revert MultiSignatureWallet__ExternalTransactionFailed();

        return result;
    }

    ////// External & Public View & Pure Functions
    function getSigners() external view returns (address[] memory) {
        return signers;
    }
}
