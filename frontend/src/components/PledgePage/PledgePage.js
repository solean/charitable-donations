import React, { Component } from 'react';
import ContributeForm from '../ContributeForm/ContributeForm';
import { Link, useParams } from 'react-router-dom';
import utils from '../../utils/utils';
import constants from '../../constants/constants';
import HakuaiAbi from '../../abis/Hakuai.json';
import { ethers } from 'ethers'
import { useAccount, useContractRead } from 'wagmi';
import moment from 'moment';


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
      contributedAmount: 0
    };
  }

  async componentDidMount() {
    const pledgeData = await this.loadPledgeData();
    this.setState({
      pledge: pledgeData.pledge,
      contributedAmount: pledgeData.contributedAmount
    });
  }
  
  async loadPledgeData() {
    let pledge = await this.props.contract.getPledge(this.props.pledgeId);
    pledge = utils.parsePledge(pledge);

    let accounts = await this.props.provider.send("eth_requestAccounts", []);
    let account = accounts[0];

    let amount = await this.props.contract.howMuchDidContribute(this.props.pledgeId, account);

    return {
      pledge,
      contributedAmount: ethers.utils.formatEther(amount)
    };
  }

  async onContributeSubmit() {
    const pledgeData = await this.loadPledgeData();
    this.setState(pledgeData);
  }

  async endPledge() {
    try {
      let contract = this.props.contract.connect(this.props.provider.getSigner());
      let tx = await contract.endPledge(this.state.pledge.id);
      console.log(tx);
      await tx.wait();
      // this.props.onSubmit && this.props.onSubmit();
    } catch (e) {
      console.error(e);
      // let errorMessage = (e && e.data && e.data.message) || 'Sorry, something went wrong.';
      // this.setState({ errorMessage });
    }
  }

  render() {
    let pledge = this.state.pledge;
    let charityLabel = pledge && pledge.charity ? pledge.charity.name : utils.sliceAddr(pledge.charityAddress);
    let imageUrl = '';
    if (pledge.charity && pledge.charity.imageUrl) {
      imageUrl = pledge.charity.imageUrl;
    } else {
      imageUrl = '/icons8-charity-64.png';
    }

    let end = moment((pledge.createdAt * 1000) + pledge.duration);
    let canPledgeBeEnded = false;
    if (pledge.endedAt) {
      canPledgeBeEnded = false;
    } else if (end.isBefore()) {
      canPledgeBeEnded = true;
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
              <div style={{ marginTop: '20px', fontWeight: '500' }}>
                <div style={{ marginBottom: '10px' }}>
                  <img height="64" width="64" src={ imageUrl } alt="profile" />
                  <h3 style={{ marginLeft: '10px', display: 'inline-block', fontWeight: 'bold', fontSize: '32px' }}>{ charityLabel }</h3>
                </div>
                <div><OwnerDisplay pledgeCreator={ pledge.creator } /> pledged <EthLogo /> { pledge.initialAmount } if we can raise <EthLogo /> { this.state.pledge.goalAmount }</div>
                <div>Total raised so far: <EthLogo /> { pledge.raisedAmount }</div>
                <div>Your contribution so far: <EthLogo /> { this.state.contributedAmount } </div>
                <div style={{ marginTop: '20px' }}>
                  {
                    canPledgeBeEnded ?
                      <button onClick={ this.endPledge.bind(this) } className='btn btn-primary'>End Pledge</button>
                      : <div>Pledge ends at: { end.format('MM/DD/YYYY HH:mm:ss a') }</div>
                  }
                </div>
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