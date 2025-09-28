// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {NativeContestPool} from "../src/NativeContestPool.sol";
import {AbilityNFT} from "../src/AbilityNFT.sol";

contract NativeContestPoolTest is Test {
    NativeContestPool public nativeContestPool;
    address ENTROPY = makeAddr("entropy");
    address PYTH_CONTRACT_ADDRESS = makeAddr("pyth");
    address PYUSD = makeAddr("pyusd");
    address server = makeAddr("server");
    address nft = makeAddr("nft");
    uint256 ENTRANCE_FEE = 1;

    function setUp() public {
        nativeContestPool = new NativeContestPool(
            ENTROPY,
            // PYTH_CONTRACT_ADDRESS,
            ENTRANCE_FEE,
            // PYUSD,
            server,
            AbilityNFT(nft)
        );
    }

    function test_Increment() public {}

    function testFuzz_SetNumber(uint256 x) public {}
}
