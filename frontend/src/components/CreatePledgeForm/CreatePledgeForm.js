import React, { Component } from 'react';
import { ethers } from 'ethers';


class CreatePledgeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPledge: '',
      goalAmount: '',
      duration: '',
      charityAddress: '',
      errorMessage: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    let state = this.state;

    if (!state.initialPledge || !state.goalAmount || !state.duration || !state.charityAddress) {
      return false;
    }
    console.log(state);

    this.createPledge(state);
  }

  async createPledge(state) {
    let initialPledge = ethers.utils.parseEther(state.initialPledge);
    let goalAmount = ethers.utils.parseEther(state.goalAmount);
    // TODO:
    // let days = duration;
    let duration = 3600000;

    try {
      let contract = this.props.contract.connect(this.props.provider.getSigner());
      let tx = await contract.createPledge(
        initialPledge,
        goalAmount,
        duration,
        state.charityAddress,
        {
          value: ethers.utils.parseEther(state.initialPledge)
        }
      );
      console.log(tx);
      await tx.wait();
      this.props.onSubmit && this.props.onSubmit();
      document.getElementById('closeButton').click();
    } catch (e) {
      console.error(e);
      let errorMessage = (e && e.data && e.data.message) || 'Sorry, something went wrong.';
      this.setState({ errorMessage });
    }
  }

  render() {
    return (
      <form>
        <div className={ this.state.errorMessage ? 'alert alert-danger' : 'hidden' }>
          { this.state.errorMessage }
        </div>
        <div>
          <div className='mb-3'>
            <label htmlFor='yourPledge' className='form-label'>Your Initial Pledge</label>
            <input name='initialPledge' type='number' value={ this.state.initialPledge }
              onChange={ this.handleChange } className='form-control' id='yourPledge' placeholder='0.00' />
          </div>
          <div className='mb-3'>
            <label htmlFor='goalAmount' className='form-label'>Goal Amount</label>
            <input name='goalAmount' type='number' value={ this.state.goalAmount }
              onChange={ this.handleChange } className='form-control' id='goalAmount' placeholder='0.00' />
          </div>
          <div className='mb-3'>
            <label htmlFor='duration' className='form-label'>Number of Days to Fundraise</label>
            <input name='duration' type='number' value={ this.state.duration }
              onChange={ this.handleChange } className='form-control' id='duration' placeholder='0' />
          </div>
          <div className='mb-3'>
            <label htmlFor='charityAddress' className='form-label'>Donation Address</label>
            <input name='charityAddress' type='text' value={ this.state.charityAddress }
              onChange={ this.handleChange } className='form-control' id='charityAddress' placeholder='0x' />
          </div>
        </div>
        <div style={{ marginTop: '40px' }}>
          <button onClick={ this.handleSubmit } type="button" className="btn btn-primary">Submit</button>
          <button id='closeButton' type="button" className="btn btn-link" data-bs-dismiss="modal">Close</button>
        </div>
      </form>
    );
  }
}

export default CreatePledgeForm;