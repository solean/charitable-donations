import { ethers } from 'ethers';

const utils = {
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
    parsed.isCompleted = pledge[11];

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

    return parsed;
  },

  sliceAddr: function(addr) {
    if (!addr) return '';
    return addr.slice(0, 4) + '..' + addr.slice(-4);
  },

  buildEtherscanLink: function(addr, activeChain) {
    let txt = this.sliceAddr(addr);

    let explorer = 'etherscan.io'
    if (activeChain && activeChain.id === 3) {
      explorer = 'ropsten.etherscan.io';
    } else if (activeChain && activeChain.id === 421611) {
      explorer = 'testnet.arbiscan.io';
    }

    return (
      <a href={`https://${explorer}/address/${addr}`} target='_blank' rel='noopener noreferrer'>
        { txt }
      </a>
    );
  }
};

export default utils;