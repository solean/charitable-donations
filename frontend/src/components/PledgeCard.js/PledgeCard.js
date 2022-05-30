import React from 'react';
import '../../App.css';


function sliceAddr(addr) {
  if (!addr) return '';
  return addr.slice(0, 4) + '..' + addr.slice(-4);
}

// TODO: dynamic networks
function buildEtherscanLink(addr) {
  let txt = sliceAddr(addr);
  return (
    <a href={`https://etherscan.io/address/${addr}`} target='_blank' rel='noopener noreferrer'>
      { txt }
    </a>
  );
}

function PledgeCard(props) {
  const pledge = props.pledge;

  let percentageRaised = parseFloat(pledge.raisedAmount) / parseFloat(pledge.goalAmount);

  let imageUrl = '';
  if (pledge.charity && pledge.charity.imageUrl) {
    imageUrl = pledge.charity.imageUrl;
  } else {
    imageUrl = "/icons8-charity-64.png";
  }
  let nameLabel = '';
  if (pledge.charity && pledge.charity.name) {
    nameLabel = pledge.charity.name;
  } else {
    nameLabel = sliceAddr(pledge.charityAddress);
  }

  return (
    <div className='card pledgeCard'>
      <div className='card-body'>
        <div className='pledgeCardImageContainer'>
          <img height="50" width="50" src={ imageUrl } alt="profile" />
        </div>
        <div className='pledgeCardInfoContainer'>
          <div className='pledgeCardCharityName'>
            <div>{ nameLabel }</div>
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