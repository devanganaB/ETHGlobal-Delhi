// Layout of Contract:

// Layout of Functions:
// receive function (if exists)
// fallback function (if exists)
// public
// private

// version

// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

// imports
import {IEntropyV2} from "@pythnetwork/entropy-sdk-solidity/IEntropyV2.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

// import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import {AbilityNFT} from "./AbilityNFT.sol";

// import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
// import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

// errors
error NativeContestPool__InsufficientFunds();
error NativeContestPool__AlreadyEnteredOnce();
error NativeContestPool__TransferFailed();
error NativeContestPool__TaskNotCompleted();
error NativeContestPool__TokenTransferRequired();
error NativeContestPool__OnlyServerCanCheck();
error NativeContestPool__SwitchNotOn();

// interfaces, libraries, contracts
contract NativeContestPool is IEntropyConsumer {
    // Type declarations
    enum Switch {
        Stop,
        Start
    }

    // State variables
    // uint256 public immutable i_entranceFeeUSD;
    uint256 public immutable i_entranceFee;
    address public s_winner;
    uint256 public s_randomNumber;
    uint256 public s_currentContestStartTime;
    Switch public s_switch;
    IEntropyV2 private s_entropy;
    AbilityNFT private s_abilityNft;
    // IPyth s_pyth;
    // ERC20 public immutable pyusd;
    address public immutable serverAddress;

    address payable[] public s_participants;
    mapping(uint256 version => mapping(address participant => uint256 timestamp)) s_participantCompletionStatusHistory;
    uint256 s_currentVersion;
    string s_jsonBin;

    // Events
    event NewParticipantEntered(address indexed participantAddress);
    event RequestResultCalculation(uint64 indexed sequenceNumber);
    event ResultDeclared(uint64 indexed sequenceNumber, address indexed winner);
    event TaskCompleteMarked(
        uint256 indexed version,
        address indexed participant,
        uint256 indexed timestamp
    );
    event StakeRecollected(address indexed participant);

    // constructor
    constructor(
        address _entropyAddress,
        address _pythContractAddress,
        uint256 _entranceFee,
        address _pyusdAddress,
        address _serverAddress,
        AbilityNFT _abilityNft
    ) {
        s_entropy = IEntropyV2(_entropyAddress);
        // s_pyth = IPyth(_pythContractAddress);
        i_entranceFee = _entranceFee;
        // pyusd = ERC20(_pyusdAddress);
        serverAddress = _serverAddress;
        s_abilityNft = (_abilityNft);
        s_currentContestStartTime = block.timestamp;
        s_switch = Switch.Stop;
    }

    // Modifiers
    modifier onlyServer() {
        //Implement proper server address checks
        if (msg.sender != serverAddress) {
            revert NativeContestPool__OnlyServerCanCheck();
        }
        _;
    }

    modifier switchOn() {
        //Implement proper server address checks
        if (s_switch != Switch.Start) {
            revert NativeContestPool__SwitchNotOn();
        }
        _;
    }

    // Functions

    // external
    function enterHabitPool() external payable switchOn {
        // if (token == address(0)) {
        if (msg.value < i_entranceFee) {
            revert NativeContestPool__InsufficientFunds();
        }
        // } else {
        //     if (msg.value != 0) {
        //         revert NativeContestPool__TokenTransferRequired();
        //     }
        //     //price feeds calculations requried to handle eth to usd price conversions
        //     // pyusd.transferFrom(msg.sender, address(this), i_entranceFee);
        //     ERC20(token).transferFrom(
        //         msg.sender,
        //         address(this),
        //         i_entranceFeeUSD
        //     );
        // }

        s_participantCompletionStatusHistory[s_currentVersion][msg.sender] = 0;

        emit NewParticipantEntered(msg.sender);
    }

    function markParticipantTaskComplete(
        address participant
    ) external onlyServer switchOn {
        s_participantCompletionStatusHistory[s_currentVersion][
            participant
        ] = block.timestamp;
        s_participants.push(payable(participant));

        emit TaskCompleteMarked(s_currentVersion, participant, block.timestamp);
    }

    function recollectStake() external // bytes[] calldata priceUpdate,
    // address token,
    // uint256 amount
    {
        if (
            s_participantCompletionStatusHistory[s_currentVersion][
                msg.sender
            ] == 0
        ) {
            revert NativeContestPool__TaskNotCompleted();
        }
        // if (token == address(0)) {
        // uint fee = s_pyth.getUpdateFee(priceUpdate);
        // s_pyth.updatePriceFeeds{value: fee}(priceUpdate);
        //
        // bytes32 priceFeedId = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // ETH/USD
        // PythStructs.Price memory price = s_pyth.getPriceNoOlderThan(
        //     priceFeedId,
        //     60
        // );
        // uint ethPrice18Decimals = (uint(uint64(price.price)) * (10 ** 18)) /
        //     (10 ** uint8(uint32(-1 * price.expo)));
        // uint oneDollarInWei = ((10 ** 18) * (10 ** 18)) /
        //     ethPrice18Decimals;
        //
        // // console2.log("required payment in wei");
        // // console2.log(oneDollarInWei);
        // if (msg.value <= oneDollarInWei) {
        //     revert NativeContestPool__TokenTransferRequired();
        // }
        (bool success, ) = payable(msg.sender).call{value: i_entranceFee}("");
        if (!success) {
            revert NativeContestPool__TransferFailed();
        }
        // } else {
        //     SafeTransferLib.safeTransfer(
        //         ERC20(token),
        //         msg.sender,
        //         //price feeds calculations requried to handle eth to usd price conversions
        //         i_entranceFeeUSD
        //     );
        // }

        s_participantCompletionStatusHistory[s_currentVersion][msg.sender] = 0;

        emit StakeRecollected(msg.sender);
    }

    function calculateResultRandomly() external payable switchOn {
        uint256 fee = s_entropy.getFeeV2();
        uint64 sequenceNumber = s_entropy.requestV2{value: fee}();

        emit RequestResultCalculation(sequenceNumber);
    }

    function switchStartStop() external onlyServer {
        if (s_switch == Switch.Start) {
            s_switch = Switch.Stop;
        }
        if (s_switch == Switch.Start) {
            s_switch = Switch.Stop;
        }
    }

    // internal
    function mapRandomNumber(
        bytes32 randomNumber,
        int256 minRange,
        int256 maxRange
    ) internal pure returns (int256) {
        uint256 range = uint256(maxRange - minRange + 1);
        return minRange + int256(uint256(randomNumber) % range);
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address provider,
        bytes32 randomNumber
    ) internal override {
        uint256 randomUintNumber = uint256(randomNumber);
        for (uint256 i = 0; i < s_participants.length; i++) {
            uint256 r = randomUintNumber % 100; // 0 to 99

            if (r < 30) {
                uint8 probabilityBuff = uint8(
                    uint256(
                        mapRandomNumber(
                            keccak256(
                                abi.encodePacked(randomNumber, "probability")
                            ),
                            1,
                            10
                        )
                    )
                );
                uint8 timeBuff = uint8(
                    uint256(
                        mapRandomNumber(
                            keccak256(abi.encodePacked(randomNumber, "time")),
                            1,
                            10
                        )
                    )
                );
                s_abilityNft.mint(probabilityBuff, timeBuff, s_participants[i]);
            }
            if s_abilityNft.balanceOf(participant[i]);
            uint256 totalTickets;
            uint256 submissionTimestamp = s_participantCompletionStatusHistory[
                s_currentVersion
            ][s_participants[i]];
            uint256 delay = submissionTimestamp - s_currentContestStartTime;
            // tickets[i] = 1e18 / sqrt(delay);
            totalTickets += 1e18 / sqrt(delay);
        }
        uint256 selector = randomUintNumber % totalTickets;
        uint256 running;
        for (uint256 i = 0; i < s_participants.length; i++) {
            uint256 submissionTimestamp = s_participantCompletionStatusHistory[
                s_currentVersion
            ][s_participants[i]];
            uint256 delay = submissionTimestamp - s_currentContestStartTime + 1;
            uint256 weight = 1e18 / sqrt(delay);
            running += weight;
            if (selector < running) {
                s_winner = s_participants[i];
            }
            if (s_winner == address(0)) {
                s_winner = s_participants[
                    randomUintNumber % s_participants.length
                ];
            }
            (bool success, ) = s_winner.call{value: address(this).balance}("");
            if (!success) {
                revert NativeContestPool__TransferFailed();
            }

            s_participants = new address payable[](0);
            s_currentVersion++;
            s_randomNumber = randomUintNumber;
            s_currentContestStartTime = block.timestamp;
            // s_switch = Switch.Stop;

            emit ResultDeclared(sequenceNumber, s_winner);
        }
    }

    // view & pure functions
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function getJsonBin() public view returns (string memory) {
        return s_jsonBin;
    }

    function setJsonBin(string memory newJsonBin) public {
        s_jsonBin = newJsonBin;
        s_switch = Switch.Start;
    }

    function getNumberOfParticipants() public view returns (uint256) {
        return s_participants.length;
    }

    function getRandomNumberForQuestions() public view returns (uint256) {
        return s_randomNumber;
    }

    function getLastWinner() public view returns (address) {
        return s_winner;
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getEntropy() internal view override returns (address) {
        return address(s_entropy);
    }

    function getEntropyFees() public view returns (uint256) {
        return s_entropy.getFeeV2();
    }
}
