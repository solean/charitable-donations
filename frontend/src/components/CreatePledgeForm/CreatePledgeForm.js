import React, { Component } from 'react';
import Select from 'react-select'
import { ethers } from 'ethers';


class CreatePledgeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPledge: '',
      goalAmount: '',
      duration: '',
      charityAddress: '',
      errorMessage: '',
      addressToggle: '',
      verifiedCharitiesOptions: [],
      selectedVerified: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
      let data = await this.props.contract.getVerifiedCharities();

      let options = data.map(c => {
        return { value: c.addr, label: c.name };
      });

      this.setState({
        verifiedCharitiesOptions: options
      })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    let state = this.state;

    if (!state.initialPledge || !state.goalAmount || !state.duration || !state.addressToggle) {
      return false;
    }
    if (state.addressToggle.value === 'V' && !state.selectedVerified) {
      return false;
    }
    if (state.addressToggle.value === 'C' && !state.charityAddress) {
      return false;
    }
    console.log(state);

    this.createPledge(state);
  }

  async createPledge(state) {
    let initialPledge = ethers.utils.parseEther(state.initialPledge);
    let goalAmount = ethers.utils.parseEther(state.goalAmount);
    let duration = state.duration * 86400000;
    let address = '';
    if (state.addressToggle.value === 'V') {
      address = state.selectedVerified.value;
    } else if (state.addressToggle.value === 'C') {
      address = state.charityAddress;
    }

    try {
      let contract = this.props.contract.connect(this.props.provider.getSigner());
      let tx = await contract.createPledge(
        initialPledge,
        goalAmount,
        duration,
        address,
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
          <div className='alert alert-info'>Choose a Verified Nonprofit, or use a custom address.</div>
          <div className='mb-3'>
            <Select value={ this.state.addressToggle } onChange={ o => this.setState({ addressToggle: o })} options={[
              { value: 'V', label: 'Verified Nonprofit' },
              { value: 'C', label: 'Custom Address' }
            ]} />
          </div>
          {
            this.state.addressToggle && this.state.addressToggle.value === 'V' &&
            <div>
              <Select value={ this.state.selectedVerified } onChange={ o => this.setState({ selectedVerified: o  })}
                options={ this.state.verifiedCharitiesOptions } />
            </div>
          }
          {
            this.state.addressToggle && this.state.addressToggle.value === 'C' &&
            <div className='mb-3'>
              <input name='charityAddress' type='text' value={ this.state.charityAddress }
                onChange={ this.handleChange } className='form-control' id='charityAddress' placeholder='0x' />
            </div>
          }
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