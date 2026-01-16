// SPDX-License-Identifier: MIT

pragma solidity ^0.8.31;
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {MultiSignatureWallet} from "src/MultiSignatureWallet.sol";

contract MultiSignatureWalletFactory {
    using Clones for address;

    address public immutable multiSignatureWalletImplementation;
    address[] private multiSignatureWallets;

    event MultiSignatureWalletCreated(address indexed multiSignatureWallet);

    constructor() {
        // Deploy the logic one time
        multiSignatureWalletImplementation = address(new MultiSignatureWallet());
    }

    /**
     * @dev createChild is non deterministic: You can't preddict the address of the new MultiSignatureWallet
     */
    function createChild() external {
        // Deploy a clone pointing to the implementation
        address clone = multiSignatureWalletImplementation.clone();
        MultiSignatureWallet(clone).initialize(msg.sender);
        multiSignatureWallets.push(clone);
        emit MultiSignatureWalletCreated(clone);
    }

    /**
     * @dev predictDeterministicAddress will return you the address of the new MultiSignatureWallet for the given salt
     * @param salt - a random bytes32 value used to generate the deterministic address of a MultiSignatureWallet clone
     */
    function predictDeterministicAddress(bytes32 salt) external view returns (address predicted) {
        return Clones.predictDeterministicAddress(
            multiSignatureWalletImplementation,
            salt,
            address(this) // deployer = factory itself
        );
    }

    /**
     * @dev createChildDeterministic is deterministic: You can preddict the address of the new MultiSignatureWallet (based on the given salt)
     * @param salt - a random bytes32 value used to generate the deterministic address of a MultiSignatureWallet clone
     */
    function createChildDeterministic(bytes32 salt) external returns (address) {
        address clone = Clones.cloneDeterministic(multiSignatureWalletImplementation, salt);
        MultiSignatureWallet(clone).initialize(msg.sender);
        multiSignatureWallets.push(clone);
        emit MultiSignatureWalletCreated(clone);

        return clone;
    }

    // Getter functions

    function getAllMultiSignatureWallets() external view returns (address[] memory) {
        return multiSignatureWallets;
    }
}
