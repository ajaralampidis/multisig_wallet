// SPDX-License-Identifier: MIT

pragma solidity ^0.8.31;

import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {MintableERC20} from "src/MintableERC20.sol";
import {UniV2Pool} from "src/UniV2Pool.sol";
import {MultiSignatureWalletFactory} from "src/MultiSignatureWalletFactory.sol";

contract Deploy is Script {
    address[] public tokenAddresses;

    function run()
        external
        returns (
            HelperConfig,
            MintableERC20,
            MintableERC20,
            MultiSignatureWalletFactory /* UniV2Pool,*/
        )
    {
        HelperConfig config = new HelperConfig();

        (
            address help,
            address problm,
            // address helpProblemPool
            address multiSignatureWalletFactory
            // uint256 deployerKey
        ) = config.activeNetworkConfig();

        tokenAddresses = [help, problm];

        // vm.startBroadcast( /* deployerKey */ );
        // vm.stopBroadcast();

        return
            (
                config,
                MintableERC20(help),
                MintableERC20(problm),
                MultiSignatureWalletFactory(multiSignatureWalletFactory)
            );
    }
}
