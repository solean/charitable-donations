import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import useContract from '../../hooks/useContract';


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


function ContributeForm(props) {
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const contract = useContract();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const handleChange = e => {
    setAmount(e.target.value);
  };

  const contributeToPledge = async (pledgeId, pledgeAmount) => {
    let amount = ethers.utils.parseEther(pledgeAmount);

    try {
      let signedContract = contract.connect(provider.getSigner());
      let tx = await signedContract.contributeToPledge(
        pledgeId,
        amount,
        {
          value: amount
        }
      );
      console.log(tx);
      await tx.wait();
      props.onSubmit && props.onSubmit();
    } catch (e) {
      console.error(e);
      let errorMessage = (e && e.data && e.data.message) || 'Sorry, something went wrong.';
      setErrorMessage(errorMessage);
    }
  };

  const onSubmit = () => {
    setErrorMessage('')

    if (!props.pledgeId || !amount) {
      setErrorMessage('Please enter an amount greater than 0.');
      return false;
    }
    contributeToPledge(props.pledgeId, amount);
  };

  return(
    <div>
      <h2>Contribute</h2>
      <div className={ errorMessage ? 'alert alert-danger' : 'hidden' }>{ errorMessage }</div>
      <div className='alert alert-info'>If the pledge goal is met by the end of the fundraising period, your pledged Ether will be sent to the charity's address, otherwise you will be able to withdraw it after the pledge has been ended.</div>
      <div>
        <div className='mb-3'>
          <label htmlFor='amount' className='form-label'>Amount of Ether to Contribute</label>
          <input name='amount' type='number' value={ amount }
            onChange={ handleChange } className='form-control' id='amount' placeholder='0.00' />
        </div>
        <div>
          <ContributeButton onSubmit={ onSubmit } />
        </div>
      </div>
    </div>
  );
}

export default ContributeForm;