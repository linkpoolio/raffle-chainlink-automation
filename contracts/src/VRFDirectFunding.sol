// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VRFDirectFunding is VRFV2WrapperConsumerBase {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );
    IERC20 public linkTokenContract;
    VRFV2WrapperInterface public vrfWrapper;
    RequestConfig public requestConfig;
    address public owner;
    struct RequestStatus {
        uint256 paid;
        bool fulfilled;
        uint256[] randomWords;
    }

    struct RequestConfig {
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        uint32 numWords;
    }

    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        uint32 callbackGasLimit,
        address linkAddress,
        address wrapperAddress,
        uint16 requestConfirmations
    ) VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) {
        require(linkAddress != address(0), "Link Token address cannot be 0x0");
        require(wrapperAddress != address(0), "Wrapper address cannot be 0x0");
        owner = msg.sender;
        vrfWrapper = VRFV2WrapperInterface(wrapperAddress);
        linkTokenContract = IERC20(linkAddress);
        requestConfig = RequestConfig({
            callbackGasLimit: callbackGasLimit,
            requestConfirmations: requestConfirmations,
            numWords: 1
        });
    }

    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        requestId = requestRandomness(
            requestConfig.callbackGasLimit,
            requestConfig.requestConfirmations,
            requestConfig.numWords
        );

        // Check vrf request price
        uint256 requestPrice = vrfWrapper.calculateRequestPrice(
            requestConfig.callbackGasLimit
        );
        // transfer LINK necessary to pay for the request from sender to this contract
        linkTokenContract.approve(address(this), requestPrice);
        require(
            linkTokenContract.transferFrom(
                msg.sender,
                address(this),
                requestPrice
            ),
            "Not enough LINK"
        );
        s_requests[requestId] = RequestStatus({
            paid: requestPrice,
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, requestConfig.numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
    }

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (
            uint256 paid,
            bool fulfilled,
            uint256[] memory randomWords
        )
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }
}
