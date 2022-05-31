import React, { Component } from 'react';
import ContributeForm from '../ContributeForm/ContributeForm';
import { Link, useParams } from 'react-router-dom';
import utils from '../../utils/utils';
import { ethers } from 'ethers'
import { useAccount } from 'wagmi';
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
      await this.loadPledgeData();
    } catch (e) {
      console.error(e);
    }
  }

  async withdraw() {
    try {
      let contract = this.props.contract.connect(this.props.provider.getSigner());
      let tx = await contract.withdraw(this.state.pledge.id);
      console.log(tx);
      await tx.wait();
      await this.loadPledgeData();
    } catch (e) {
      console.error(e);
    }
  }  

  async withdrawForCharity() {
    try {
      let contract = this.props.contract.connect(this.props.provider.getSigner());
      let tx = await contract.withdrawForCharity(this.state.pledge.id);
      console.log(tx);
      await tx.wait();
      await this.loadPledgeData();
    } catch (e) {
      console.error(e);
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

    let wasGoalMet = false;
    if (pledge && pledge.raisedAmount) {
      wasGoalMet = ethers.utils.parseEther(pledge.raisedAmount) >= ethers.utils.parseEther(pledge.goalAmount);
    }

    if (pledge.endedAt) {
      canPledgeBeEnded = false;
    } else if (end.isBefore()) {
      canPledgeBeEnded = true;
    }
    // TODO: temp
    // canPledgeBeEnded = true;


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
                  <h3 style={{ marginLeft: '10px', display: 'inline-block', fontWeight: 'bold', fontSize: '32px' }}>
                    { charityLabel }
                    {
                      pledge.charity && pledge.charity.name &&
                      <span style={{ marginLeft: '5px', fontSize: '20px' }}>
                        ({ utils.buildEtherscanLink(pledge.charity.addr) })
                      </span>
                    }
                  </h3>
                </div>
                <div><OwnerDisplay pledgeCreator={ pledge.creator } /> pledged <EthLogo /> { pledge.initialAmount } if we can raise <EthLogo /> { this.state.pledge.goalAmount }</div>
                <div>Total raised: <EthLogo /> { pledge.raisedAmount }</div>
                <div>Your contributions: <EthLogo /> { this.state.contributedAmount } </div>
                <div style={{ marginTop: '20px' }}>
                  {
                    !pledge.endedAt && canPledgeBeEnded ?
                      <button onClick={ this.endPledge.bind(this) } className='btn btn-primary'>End Pledge</button>
                      : <div>Pledge ends at: { end.format('MM/DD/YYYY HH:mm:ss a') }</div>
                  }
                  {
                    pledge.endedAt && wasGoalMet && !pledge.isCompleted &&
                      <button onClick={ this.withdrawForCharity.bind(this) } className='btn btn-success'>Complete Donation to Charity</button>
                  }
                  {
                    pledge.endedAt && !wasGoalMet && !pledge.isCompleted &&
                      <button onClick={ this.withdraw.bind(this) } className='btn btn-primary'>Withdraw</button>
                  }
                  {
                    pledge.isCompleted && <div className='successColor'>Pledge was completed and funds were sent to the charity</div>
                  }
                </div>
              </div>
            </div>
            <div className='col'>
              { !pledge.isCompleted && !pledge.endedAt &&
                <ContributeForm { ...this.props } onSubmit={ this.onContributeSubmit.bind(this) } />
              }
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