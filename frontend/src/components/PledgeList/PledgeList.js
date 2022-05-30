import React, { Component } from 'react';
import PledgeCard from '../PledgeCard.js/PledgeCard';
import { ethers } from 'ethers';

class PledgeList extends Component {

  parsePledge(pledge) {
    let parsed = {};
    parsed.id = pledge[0].toNumber();
    parsed.creator = pledge[1];
    parsed.createdAt = pledge[2].toNumber();
    parsed.initialAmount = ethers.utils.formatEther(pledge[3]);
    parsed.goalAmount = ethers.utils.formatEther(pledge[4]);
    parsed.raisedAmount = ethers.utils.formatEther(pledge[5]);
    parsed.duration = pledge[6].toNumber();
    parsed.endedAt = pledge[7].toNumber() || null;
    parsed.charityAddress = pledge[8];
    parsed.isVerified = pledge[9];

    parsed.charity = null;
    if (pledge.charity && pledge.isVerified) {
      parsed.charity = {
        addr: pledge.charity[0],
        name: pledge.charity[1],
        description: pledge.charity[2],
        websiteUrl: pledge.charity[3],
        imageUrl: pledge.charity[4]
      };
    }

    console.log(parsed);
    return parsed;
  }

  render() {
    let pledges = this.props.pledges || [];
    pledges = pledges.map(pledge => this.parsePledge(pledge));
    pledges.reverse();

    return (
      <div className='container-fluid' style={{ padding: '20px' }}>
        <div className='d-flex justify-content-center'>
          <div>
            <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Contribute to an Open Pledge</h2>
            <div>
              {pledges.map((pledge, index) => {
                return <PledgeCard key={index} pledge={pledge} />
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PledgeList;