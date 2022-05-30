import React, { Component } from 'react';
import CreatePledgeForm from '../CreatePledgeForm/CreatePledgeForm';

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreatePledgeForm: false
    };

    this.handleCreatePledgeClick = this.handleCreatePledgeClick.bind(this);
  }

  handleCreatePledgeClick() {
    this.setState({ showCreatePledgeForm: true });
  }

  render() {
    return (
      <div>
        <div className='landing'>
          <div>
            Pledge your ETH to a good cause,<br />
            and motivate others to do the same.
          </div>
          <div>
            <button type='button' className='btn btn-light'
              data-bs-toggle='modal' data-bs-target='#createPledgeModal'>Create a Pledge</button>
          </div>
        </div>

        <div className='modal' id='createPledgeModal' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Create a Pledge</h5>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div className='modal-body'>
                <CreatePledgeForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;