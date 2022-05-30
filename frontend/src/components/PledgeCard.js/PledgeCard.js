import React from 'react';
import '../../App.css';


// TODO: dynamic networks
function buildEtherscanLink(addr) {
  let txt = addr.slice(0, 4) + '..' + addr.slice(-4);
  return (
    <a href={`https://etherscan.io/address/${addr}`} target='_blank' rel='noopener noreferrer'>
      { txt }
    </a>
  );
}

function PledgeCard(props) {
  const pledge = props.pledge;

  let percentageRaised = parseFloat(pledge.raisedAmount) / parseFloat(pledge.goalAmount);

  return (
    <div className='card pledgeCard'>
      <div className='card-body'>
        <div className='pledgeCardImageContainer'>
          <img height="50" width="50" src={ pledge.charity.imageUrl } alt="profile" />
        </div>
        <div className='pledgeCardInfoContainer'>
          <div className='pledgeCardCharityName'>
            <div>{ pledge.charity.name || pledge.charityAddress }</div>
          </div>
          <div className='pledgeAmounts'>
            { buildEtherscanLink(pledge.creator) } pledged
            <span className='ethAmount'>
              <img src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg" height="14" width="14" alt="ETH" />
              { pledge.initialAmount }
            </span>
            to raise 
            <span className='ethAmount'>
              <img src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg" height="14" width="14" alt="ETH" />
              { pledge.goalAmount }
            </span>
          </div>
        </div>
        <div className='pledgeCardRaisedContainer'>
          <div className='pledgeCardProgressBarContainer'>
            { percentageRaised > 1 ? '100%' : (percentageRaised * 100).toFixed(2) + '%' }
          </div>
          <div>
            <span className='ethAmount'>
              <img src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg" height="14" width="14" alt="ETH" />
              { pledge.raisedAmount }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PledgeCard;