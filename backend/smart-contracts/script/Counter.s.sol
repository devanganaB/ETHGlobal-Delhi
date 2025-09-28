// SPDX-License-Identifier:MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {NativeContestPool} from "../src/NativeContestPool.sol";
import {AbilityNFT} from "../src/AbilityNFT.sol";

contract NativeContestPoolScript is Script {
    NativeContestPool public nativeContestPool;
    AbilityNFT public abilityNft;
    // optimism hardcoded for now
    address ENTROPY_OP = 0x4821932D0CDd71225A6d914706A621e0389D7061;
    address ENTROPY_SEPOLIA = 0x4821932D0CDd71225A6d914706A621e0389D7061;
    address ENTROPY_ARB = 0x549Ebba8036Ab746611B4fFA1423eb0A4Df61440;
    uint256 ENTRANCE_FEE = 1;
    address PYTH_CONTRACT_ADDRESS = 0x0708325268dF9F66270F1401206434524814508b;
    address server = 0x115Fa80d1D00C38D88D2c024fe5C6f9d5ca34bE3;
    address PYUSD_SEPOLIA = 0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9;
    address PYUSD_ARB = 0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        abilityNft = new AbilityNFT();

        nativeContestPool = new NativeContestPool(
            ENTROPY_OP,
            PYTH_CONTRACT_ADDRESS,
            ENTRANCE_FEE,
            PYUSD_SEPOLIA,
            server,
            abilityNft
        );

        vm.stopBroadcast();
    }
}
