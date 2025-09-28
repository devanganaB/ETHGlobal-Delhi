// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC721} from "solmate/tokens/ERC721.sol";

// import {ERC20} from "solmate/tokens/ERC20.sol";

contract AbilityNFT is ERC721 {
    uint256 public totalIssued;
    struct Buffs {
        uint8 ProbabilityBuff;
        uint8 TimeBuff;
    }
    enum AbilityTypes {
        Probability,
        Time,
        ReduceTimestamp,
        Reroll
    }
    mapping(uint256 nftId => Buffs buffStruct) buffs;

    // ERC20 public immutable mintToken;
    // uint256 public immutable mintPrice;

    constructor() ERC721("Buffs", "BFS") {
        // mintToken = ERC20(_mintToken);
        // mintPrice = _mintPrice;
    }

    function mint(
        uint8 probabilityBuff,
        uint8 timeBuff,
        address owner
    ) external {
        // mintToken.transferFrom(msg.sender, address(this), mintPrice);

        buffs[totalIssued] = Buffs({
            ProbabilityBuff: probabilityBuff,
            TimeBuff: timeBuff
        });
        _mint(owner, ++totalIssued);
    }

    function getBuffs(uint256 nftId) public view returns (Buffs memory) {
        return buffs[nftId];
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "";
    }
}
