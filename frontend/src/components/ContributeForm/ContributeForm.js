import React, { Component } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';


function ContributeButton(props) {
  const { data } = useAccount();
  return (
    <div>
      { 
        data && data.address ?
          <button className='btn btn-primary' onClick={ props.onSubmit }>Contribute</button>
        : <ConnectButton />
      }
    </div>
  );
}


class ContributeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pledgeId: props.pledgeId,
      amount: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      amount: e.target.value
    });
  }

  onSubmit() {
    if (!this.state.pledgeId || !this.state.amount) {
      return false;
    }
    this.contributeToPledge(this.state.pledgeId, this.state.amount);
  }

  async contributeToPledge(pledgeId, pledgeAmount) {
    let amount = ethers.utils.parseEther(pledgeAmount);

    try {
      let contract = this.props.contract.connect(this.props.provider.getSigner());
      let tx = await contract.contributeToPledge(
        pledgeId,
        amount,
        {
          value: amount
        }
      );
      console.log(tx);
      await tx.wait();
      this.props.onSubmit && this.props.onSubmit();
    } catch (e) {
      console.error(e);
      let errorMessage = (e && e.data && e.data.message) || 'Sorry, something went wrong.';
      this.setState({ errorMessage });
    }
  }

  render() {
    return(
      <div>
        <h1>Contribute</h1>
        <div>
          <div className='mb-3'>
            <label htmlFor='amount' className='form-label'>Amount of Ether to Contribute</label>
            <input name='amount' type='number' value={ this.state.amount }
              onChange={ this.handleChange } className='form-control' id='amount' placeholder='0.00' />
          </div>
          <div>
            <ContributeButton onSubmit={ this.onSubmit.bind(this) } />
          </div>
        </div>
      </div>
    );
  }
}

export default ContributeForm;