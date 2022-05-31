import React, { Component } from 'react';
import ContributeForm from '../ContributeForm/ContributeForm';
import { Link, useParams } from 'react-router-dom';
import utils from '../../utils/utils';
import { ethers } from 'ethers'
import { useAccount } from 'wagmi';


function EthLogo() {
  return <img height="14" width="14" src="/eth_logo.svg" alt="ETH" />;
}

function OwnerDisplay(props) {
  let { data } = useAccount();

  return (
    data && data.address && data.address === props.pledgeCreator ?
      <span>You have</span>
      : <span>{ utils.buildEtherscanLink(props.pledgeCreator) }</span>
  );
}

class PledgePageInner extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pledge: {},
      amountAlreadyContributed: 0
    };
  }

  async componentDidMount() {
    const pledgeData = await this.loadPledgeData();
    this.setState(pledgeData);
  }
  
  async loadPledgeData() {
    const pledge = await this.props.contract.getPledge(this.props.pledgeId);
    const amountAlreadyContributed = await this.props.contract.howMuchDidIContribute(this.props.pledgeId);

    return {
      pledge: utils.parsePledge(pledge),
      amountAlreadyContributed: ethers.utils.formatEther(amountAlreadyContributed)
    };
  }

  async onContributeSubmit() {
    const pledgeData = await this.loadPledgeData();
    this.setState(pledgeData);
  }

  render() {
    let pledge = this.state.pledge;
    let charityLabel = pledge && pledge.charity ? pledge.charity.name : pledge.charityAddress;
    let imageUrl = '';
    if (pledge.charity && pledge.charity.imageUrl) {
      imageUrl = pledge.charity.imageUrl;
    } else {
      imageUrl = '/icons8-charity-64.png';
    }


    return (
      <div style={{ padding: '20px' }}>
        <div>
          <Link to='/'>
            <button className='btn btn-secondary'>Back</button>
          </Link>
        </div>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col'>
              <div style={{ fontWeight: '500' }}>
                <div style={{ marginBottom: '10px' }}>
                  <img height="64" width="64" src={ imageUrl } alt="profile" />
                  <h3 style={{ marginLeft: '10px', display: 'inline-block', fontWeight: 'bold', fontSize: '32px' }}>{ charityLabel }</h3>
                </div>
                <div><OwnerDisplay pledgeCreator={ pledge.creator } /> pledged <EthLogo /> { pledge.initialAmount } if we can raise <EthLogo /> { this.state.pledge.goalAmount }</div>
                <div>Total raised so far: <EthLogo /> { pledge.raisedAmount }</div>
                <div>Your contribution so far: <EthLogo /> { this.state.amountAlreadyContributed }</div>
              </div>

            </div>
            <div className='col'>
              <ContributeForm { ...this.props } onSubmit={ this.onContributeSubmit.bind(this) } />
            </div>
          </div>

        </div>
      </div>
    );
  }

}

export default function PledgePage(props) {
  let params = useParams();
  return <PledgePageInner { ...props } pledgeId={ params.pledgeId } />;
};