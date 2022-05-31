// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Hakuai is Ownable {

  address _owner;
  
  struct Charity {
    address addr;
    string name;
    string description;
    string websiteUrl;
    string imageUrl;
  }
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
    bool isVerified;
    Charity charity;
  }


  uint256 pledgeCounter = 1;
  uint256 public totalClaimedByCharities = 0;
  mapping (uint256 => Pledge) public pledges;
  Pledge[] pledgeArray;
  mapping (address => uint256[]) public pledgesContributedTo;
  mapping (address => uint256[]) public pledgesCreated;
  mapping (uint256 => mapping (address => uint256)) pledgeContributions;
  mapping (address => Charity) public verifiedCharities;
  Charity[] verifiedCharityArray;

  event PledgeCreated(Pledge pledge);
  event PledgeContribution(uint256 pledgeId, address contributor, uint256 amount);
  event PledgeEnded(uint256 pledgeId, uint256 timestamp);
  event Withdrawal(uint256 pledgeId, address contributor, uint256 amount);
  event CharityCreated(address addr, string name, string websiteUrl, string imageUrl);


  constructor () {
    _owner = msg.sender;
  }

  function createPledge(uint256 initialPledge, uint256 goalAmount, uint256 duration, address charityAddress) public payable {
    require(initialPledge == msg.value && msg.value > 0, "Pledge must be greater than 0");
    require(goalAmount > initialPledge, "Goal amount must be greater than the initial pledge");
    require(duration >= 3600000, "Duration must be at least 1 hour");
    require(charityAddress != address(0), "Charity address cannot be 0");
    require(charityAddress != msg.sender, "Charity address cannot be your own address");

    bool isVerified = false;
    Charity memory charity = verifiedCharities[charityAddress];
    if (charity.addr == charityAddress) {
      isVerified = true;
    }

    Pledge memory pledge = Pledge(
      pledgeCounter,
      msg.sender,
      block.timestamp,
      initialPledge,
      goalAmount,
      initialPledge,
      duration,
      0,
      charityAddress,
      isVerified,
      charity
    );
    pledges[pledgeCounter] = pledge;
    pledgeArray.push(pledge);

    pledgeContributions[pledgeCounter][msg.sender] = initialPledge;
    pledgesContributedTo[msg.sender].push(pledgeCounter);
    pledgesCreated[msg.sender].push(pledgeCounter);

    pledgeCounter++;

    emit PledgeCreated(pledge);
  }

  function getPledge(uint256 pledge) public view returns (Pledge memory) {
    return pledges[pledge];
  }

  function getPledges() public view returns (Pledge[] memory) {
    return pledgeArray;
  }

  function contributeToPledge(uint256 pledgeId, uint256 amount) public payable {
    require(amount == msg.value && msg.value > 0, "Amount must be greater than 0");

    Pledge storage pledge = pledges[pledgeId];

    require(pledge.charityAddress != address(0), "Pledge does not exist");
    require(pledge.endedAt == 0, "Pledge has ended");

    pledgeContributions[pledgeId][msg.sender] += amount;
    pledgesContributedTo[msg.sender].push(pledgeId);

    pledge.raisedAmount += amount;
    pledgeArray[pledgeId - 1].raisedAmount += amount;

    emit PledgeContribution(pledgeId, msg.sender, amount);
  }

  function howMuchDidIContribute(uint256 pledgeId) public view returns (uint256) {
    return pledgeContributions[pledgeId][msg.sender];
  }

  function howMuchDidContribute(uint256 pledgeId, address addr) public view returns (uint256) {
    return pledgeContributions[pledgeId][addr];
  }

  function endPledge(uint256 pledgeId) public {
    Pledge storage pledge = pledges[pledgeId];

    require(pledge.charityAddress != address(0), "Pledge does not exist");
    require(pledge.endedAt == 0, "Pledge has already ended");
    // require(block.timestamp >= pledge.createdAt + pledge.duration, "Pledge has not ended yet");

    pledge.endedAt = block.timestamp;
    pledgeArray[pledgeId - 1].endedAt = block.timestamp;

    emit PledgeEnded(pledgeId, block.timestamp);
  }

  function withdraw(uint256 pledgeId, address payable addr) public {
    Pledge memory pledge = pledges[pledgeId];
    require(pledge.charityAddress != address(0), "Pledge does not exist");
    require(pledge.endedAt != 0, "Pledge has not ended");
    require(msg.sender == addr, "Sender must be the address of the beneficiary");
    require(pledge.raisedAmount < pledge.goalAmount, "Pledge has reached goal amount, cannot withdraw. Funds are only withdrawable by the charity.");

    uint256 contributed = pledgeContributions[pledgeId][msg.sender];
    pledgeContributions[pledgeId][msg.sender] = 0;
    addr.transfer(contributed);

    emit Withdrawal(pledgeId, msg.sender, contributed);
  }

  function withdrawForCharity(uint256 pledgeId) public {
    Pledge memory pledge = pledges[pledgeId];
    require(pledge.charityAddress != address(0), "Pledge does not exist");
    require(pledge.endedAt != 0, "Pledge has not ended");
    require(pledge.raisedAmount >= pledge.goalAmount, "Pledge has not reached goal amount.");

    address payable charityAddress = payable(pledge.charityAddress);
    totalClaimedByCharities += pledge.raisedAmount;
    charityAddress.transfer(pledge.raisedAmount);
  }

  function createVerifiedCharity(string calldata name, string calldata description,
      string calldata websiteUrl, string calldata imageUrl, address addr) public onlyOwner {

    require(bytes(name).length > 0, "Charity name is a required param");
    require(bytes(websiteUrl).length > 0, "Website URL is a required param");
    require(addr != address(0), "Address is required");

    Charity memory charity = Charity(
      addr,
      name,
      description,
      websiteUrl,
      imageUrl
    );
    verifiedCharities[addr] = charity;
    verifiedCharityArray.push(charity);

    emit CharityCreated(addr, name, websiteUrl, imageUrl);
  }

  function getVerifiedCharity(address addr) public view returns (Charity memory) {
    return verifiedCharities[addr];
  }

  function getVerifiedCharities() public view returns (Charity[] memory) {
    return verifiedCharityArray;
  }

}
