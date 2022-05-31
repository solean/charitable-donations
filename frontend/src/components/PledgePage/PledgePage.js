import React, { Component } from 'react';
import ContributeForm from '../ContributeForm/ContributeForm';
import { Link, useParams } from 'react-router-dom';
import utils from '../../utils/utils';
import { ethers } from 'ethers'


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
              <div>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '32px' }}>{ charityLabel }</h3>
                </div>
                <div>{ utils.buildEtherscanLink(this.state.pledge.creator) } has pledged <img height="14" width="14" src="/eth_logo.svg" /> { this.state.pledge.initialAmount } to:</div>
                <div>Total raised so far: { this.state.pledge.raisedAmount } ETH</div>
                <div>Your contribution so far: { this.state.amountAlreadyContributed } ETH</div>
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