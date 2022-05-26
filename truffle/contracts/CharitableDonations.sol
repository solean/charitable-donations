// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CharitableDonations is Ownable {

  address _owner;
  
  struct Pledge {
    uint256 id;
    address creator;
    uint256 createdAt;
    uint256 initialPledge;
    uint256 goalAmount;
    uint256 raisedAmount;
    uint256 duration;
    uint256 endedAt;
    address charityAddress;
  }

  uint256 pledgeCounter = 1;
  // uint256 totalRaised = 0;
  mapping (uint256 => Pledge) pledges;
  // mapping (address => Pledge[] memory) pledgesContributedTo;

  // Pledge id => (address => amount contributed)
  mapping (uint256 => mapping (address => uint256)) pledgeContributions;

  event PledgeCreated(Pledge pledge);
  event PledgeContribution(uint256 pledgeId, address contributor, uint256 amount);
  event PledgeEnded(uint256 pledgeId, uint256 timestamp);
  event Withdrawal(uint256 pledgeId, address contributor, uint256 amount);


  constructor () {
    _owner = msg.sender;
  }

  function createPledge(uint256 initialPledge, uint256 goalAmount, uint256 duration, address charityAddress) public payable {
    require(initialPledge == msg.value && msg.value > 0, "Pledge must be greater than 0");
    require(goalAmount > initialPledge, "Goal amount must be greater than the initial pledge");
    // TODO: minimum duration?
    require(duration > 0, "Duration must be greater than 0");
    // require(charityAddress != address(0), "Charity address cannot be 0");


    Pledge memory pledge = Pledge(
      pledgeCounter,
      msg.sender,
      block.timestamp,
      initialPledge,
      goalAmount,
      initialPledge,
      duration,
      0,
      charityAddress
    );
    pledges[pledgeCounter] = pledge;

    pledgeContributions[pledgeCounter][msg.sender] = initialPledge;

    pledgeCounter++;

    emit PledgeCreated(pledge);
  }

  function getPledge(uint256 pledge) public view returns (Pledge memory) {
    return pledges[pledge];
  }

  function contributeToPledge(uint256 pledgeId, uint256 amount) public payable {
    require(amount == msg.value && msg.value > 0, "Amount must be greater than 0");

    Pledge memory pledge = pledges[pledgeId];

    // require(pledge != 0, "Pledge does not exist");
    require(pledge.endedAt == 0, "Pledge has ended");

    pledge.raisedAmount += amount;

    pledgeContributions[pledgeId][msg.sender] += amount;

    emit PledgeContribution(pledgeId, msg.sender, amount);
  }

  function endPledge(uint256 pledgeId) public {
    Pledge memory pledge = pledges[pledgeId];

    // require(pledge != 0, "Pledge does not exist");
    require(pledge.endedAt == 0, "Pledge has already ended");
    require(block.timestamp >= pledge.createdAt + pledge.duration, "Pledge has not ended yet");
    // require(pledge.raisedAmount >= pledge.goalAmount, "Pledge has not reached goal amount");

    pledge.endedAt = block.timestamp;
    pledges[pledgeId] = pledge;

    emit PledgeEnded(pledgeId, block.timestamp);
  }

  function withdraw(uint256 pledgeId, address payable addr) public {
    Pledge memory pledge = pledges[pledgeId];
    // require(pledge != 0, "Pledge does not exist");
    require(pledge.endedAt != 0, "Pledge has not ended");
    require(msg.sender == addr, "Sender must be the address of the beneficiary");

    uint256 contributed = pledgeContributions[pledgeId][msg.sender];
    pledgeContributions[pledgeId][msg.sender] = 0;
    addr.transfer(contributed);

    // TODO: emit event
    emit Withdrawal(pledgeId, msg.sender, contributed);
  }

}