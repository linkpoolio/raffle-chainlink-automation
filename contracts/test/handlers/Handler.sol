// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@src/RaffleManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";
import {console} from "forge-std/console.sol";
import {AddressSet, LibAddressSet} from "../helpers/AddressSet.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract Handler is Test {
    using LibAddressSet for AddressSet;

    address admin;
    RaffleManager public raffleManager;
    AddressSet internal _actors;
    AddressSet internal _raffleAdmins;
    address internal currentRaffleAdmin;
    address internal currentActor;
    address internal linkAddress;

    uint256 public ghost_zeroEntries;
    uint256 public ghost_totalEntries;
    uint256 public ghost_totalRaffles;
    uint256 public ghost_totalLinkTransfered;

    uint256[] public linkArray;

    mapping(bytes32 => uint256) public calls;
    mapping(uint256 => uint256) public totalEntries;
    mapping(uint256 => uint256) public totalLink;
    mapping(address => Raffle) public raffles;

    struct Raffle {
        uint256 id;
        bool live;
    }

    modifier createActor() {
        currentActor = msg.sender;
        _actors.add(msg.sender);
        _;
    }

    modifier createRaffleAdmin() {
        vm.prank(admin);
        LinkTokenInterface(linkAddress).transfer(msg.sender, 10 ether);
        currentRaffleAdmin = msg.sender;
        _raffleAdmins.add(msg.sender);
        _;
    }

    modifier countCall(bytes32 key) {
        calls[key]++;
        _;
    }

    constructor(RaffleManager _raffleManager, address _linkAddress) {
        admin = msg.sender;
        raffleManager = _raffleManager;
        linkAddress = _linkAddress;
    }

    function enterRaffle(uint256 seed) public createActor countCall("enterRaffle") {
        // used to check if the actor has already called this function to not cause a revert
        if (_actors.called[currentActor] == 1 && raffleManager.raffleCounter() > 0) {
            seed = bound(seed, 1, type(uint256).max);
            uint256 _count = raffleManager.raffleCounter();
            uint256 id = (seed % _count);
            uint8 entries = raffleManager.getRaffle(id).base.entriesPerUser;
            vm.deal(currentActor, entries * 1e18);
            vm.prank(currentActor);
            raffleManager.enterRaffle{value: entries * 1e18}(id, entries, new bytes32[](0));
            totalEntries[id] += entries;
        }
    }

    function createRaffle(uint8 totalWinners, uint256 _entries) public createRaffleAdmin countCall("createRaffle") {
        _entries = bound(_entries, 1, 5);
        vm.startPrank(currentRaffleAdmin);
        if (!raffles[currentRaffleAdmin].live) {
            RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
                prizeName: "BigMac",
                timeLength: 30,
                fee: 1 ether,
                name: "Big Mac Contest",
                feeToken: address(0),
                merkleRoot: bytes32(""),
                automation: false,
                participants: new bytes32[](0),
                totalWinners: totalWinners,
                entriesPerUser: uint8(_entries)
            });

            LinkTokenInterface(linkAddress).transferAndCall(
                address(raffleManager), 5 ether, bytes(abi.encode(0, 1, _params))
            );

            raffles[currentRaffleAdmin] = Raffle(raffleManager.raffleCounter() - 1, true);
            ghost_totalRaffles++;
        }
        vm.stopPrank();
    }

    function transferAndCall(uint256 seed) public countCall("transferLINK") {
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: 1 ether,
            name: "Big Mac Contest",
            feeToken: address(0),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 0,
            entriesPerUser: uint8(1)
        });
        address caller = _raffleAdmins.rand(seed);
        if (raffleManager.getRaffle(raffles[caller].id).contestants.length > 0 && !_raffleAdmins.depositLink[caller]) {
            vm.prank(admin);
            LinkTokenInterface(linkAddress).transfer(caller, 1 ether);
            vm.prank(caller);
            LinkTokenInterface(linkAddress).transferAndCall(
                address(raffleManager), 1 ether, bytes(abi.encode(raffles[caller].id, 0, _params))
            );
            totalLink[raffles[caller].id] += 1 ether;
            _raffleAdmins.depositLink[caller] = true;
            linkArray.push(raffles[caller].id);
            ghost_totalLinkTransfered++;
        }
    }

    function callSummary() external view {
        console.log("Call summary:");
        console.log("-------------------");
        console.log("createRaffle", calls["createRaffle"]);
        console.log("enterRaffle", calls["enterRaffle"]);
        console.log("transferLINK", calls["transferLINK"]);
    }
}
