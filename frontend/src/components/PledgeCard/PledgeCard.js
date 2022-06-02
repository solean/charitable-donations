import React from 'react';
import { useNetwork } from 'wagmi';
import utils from '../../utils/utils';
import '../../App.css';


function PledgeCard(props) {
  const pledge = props.pledge;
  const { activeChain } = useNetwork();

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
    nameLabel = utils.sliceAddr(pledge.charityAddress);
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
            { utils.buildEtherscanLink(pledge.creator, activeChain) } pledged
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