// SPDX-License-Identifier: MIT

pragma solidity ^0.8.31;
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract MultiSignatureWallet is Initializable {
    // Bellow is just placehoder
    address public owner;

    // constructor() {}
    function initialize(address _owner) external initializer {
        require(owner == address(0), "Already initialized");
        owner = _owner;
    }
}
