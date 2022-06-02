import React  from 'react';
import CreatePledgeForm from '../CreatePledgeForm/CreatePledgeForm';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';


function CreatePledgeButton() {
  const { data } = useAccount();
  return (
    <div>
      { 
        data && data.address ?
          <button type='button' className='btn btn-light'
            data-bs-toggle='modal' data-bs-target='#createPledgeModal'>Create a Pledge</button>
        : <ConnectButton />
      }
    </div>
  );
}


function LandingPage(props) {
  return (
    <div>
      <div className='landing'>
        <div>
          Pledge your ETH to a good cause,<br />
          and motivate others to do the same.
        </div>
        <div style={{ marginTop: '20px' }}>
          <CreatePledgeButton />
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
              <CreatePledgeForm onSubmit={ props.refreshPledges } />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;