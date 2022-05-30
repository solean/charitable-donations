import React, { Component } from 'react';


class CreatePledgeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPledge: '',
      goalAmount: '',
      duration: '',
      charityAddress: ''
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
    console.log(state);

  }

  render() {
    return (
      <form>
        <div>
          <div className='mb-3'>
            <label htmlFor='yourPledge' className='form-label'>Your Initial Pledge</label>
            <input name='initialPledge' type='number' value={ this.state.initialPledge }
              onChange={ this.handleChange } class='form-control' id='yourPledge' placeholder='0.00' />
          </div>
          <div className='mb-3'>
            <label htmlFor='goalAmount' className='form-label'>Goal Amount</label>
            <input name='goalAmount' type='number' value={ this.state.goalAmount }
              onChange={ this.handleChange } class='form-control' id='goalAmount' placeholder='0.00' />
          </div>
          <div className='mb-3'>
            <label htmlFor='duration' className='form-label'>Number of Days to Raise</label>
            <input name='duration' type='number' value={ this.state.duration }
              onChange={ this.handleChange } class='form-control' id='duration' placeholder='0' />
          </div>
          <div className='mb-3'>
            <label htmlFor='charityAddress' className='form-label'>Donation Address</label>
            <input name='charityAddress' type='text' value={ this.state.charityAddress }
              onChange={ this.handleChange } class='form-control' id='charityAddress' placeholder='0x' />
          </div>
        </div>
        <div>
          <button onClick={ this.handleSubmit } type="button" className="btn btn-primary">Submit</button>
          <button type="button" className="btn btn-link" data-bs-dismiss="modal">Close</button>
        </div>
      </form>
    );
  }
}

export default CreatePledgeForm;