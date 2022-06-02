import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import { ethers } from 'ethers';
import useContract from '../../hooks/useContract';


function CreatePledgeForm(props) {
  const contract = useContract();
  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

  const [formData, setFormData] = useState({
    initialPledge: '',
    goalAmount: '',
    duration: '',
    charityAddress: '',
    addressToggle: '',
    selectedVerified: ''
  });
  const [verifiedCharitiesOptions, setVerifiedCharitiesOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCharities = async () => {
    let data = await contract.getVerifiedCharities()
    let options = data.map(c => {
      return { value: c.addr, label: c.name };
    });
    setVerifiedCharitiesOptions(options);
  };

  const createPledge = async (formData) => {
    let initialPledge = ethers.utils.parseEther(formData.initialPledge);
    let goalAmount = ethers.utils.parseEther(formData.goalAmount);
    let duration = formData.duration * 86400000;
    let address = '';
    if (formData.addressToggle.value === 'V') {
      address = formData.selectedVerified.value;
    } else if (formData.addressToggle.value === 'C') {
      address = formData.charityAddress;
    }

    try {
      let signedContract = contract.connect(ethersProvider.getSigner());
      let tx = await signedContract.createPledge(
        initialPledge,
        goalAmount,
        duration,
        address,
        {
          value: ethers.utils.parseEther(formData.initialPledge)
        }
      );
      console.log(tx);
      await tx.wait();
      props && props.onSubmit && props.onSubmit();
      document.getElementById('closeButton').click();
    } catch (e) {
      console.error(e);
      let errorMessage = (e && e.data && e.data.message) || 'Sorry, something went wrong.';
      setErrorMessage(errorMessage);
    }
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.initialPledge || !formData.goalAmount || !formData.duration || !formData.addressToggle) {
      return false;
    }
    if (formData.addressToggle.value === 'V' && !formData.selectedVerified) {
      return false;
    }
    if (formData.addressToggle.value === 'C' && !formData.charityAddress) {
      return false;
    }

    createPledge(formData);
  }

  useEffect(() => {
    fetchCharities().catch(console.error);
  });

  return (
    <form>
      <div className={ errorMessage ? 'alert alert-danger' : 'hidden' }>
        { errorMessage }
      </div>
      <div>
        <div className='mb-3'>
          <label htmlFor='yourPledge' className='form-label'>Your Initial Pledge</label>
          <input name='initialPledge' type='number' value={ formData.initialPledge }
            onChange={ handleChange } className='form-control' id='yourPledge' placeholder='0.00' />
        </div>
        <div className='mb-3'>
          <label htmlFor='goalAmount' className='form-label'>Goal Amount</label>
          <input name='goalAmount' type='number' value={ formData.goalAmount }
            onChange={ handleChange } className='form-control' id='goalAmount' placeholder='0.00' />
        </div>
        <div className='mb-3'>
          <label htmlFor='duration' className='form-label'>Number of Days to Fundraise</label>
          <input name='duration' type='number' value={ formData.duration }
            onChange={ handleChange } className='form-control' id='duration' placeholder='0' />
        </div>
        <div className='alert alert-info'>Choose a Verified Nonprofit, or use a custom address.</div>
        <div className='mb-3'>
          <Select value={ formData.addressToggle }
            onChange={ o => setFormData({ ...formData, addressToggle: o }) }
            options={[
              { value: 'V', label: 'Verified Nonprofit' },
              { value: 'C', label: 'Custom Address' }
            ]} />
        </div>
        {
          formData.addressToggle && formData.addressToggle.value === 'V' &&
          <div>
            <Select value={ formData.selectedVerified }
              onChange={ o => setFormData({ ...formData, selectedVerified: o }) }
              options={ verifiedCharitiesOptions } />
          </div>
        }
        {
          formData.addressToggle && formData.addressToggle.value === 'C' &&
          <div className='mb-3'>
            <input name='charityAddress' type='text' value={ formData.charityAddress }
              onChange={ handleChange } className='form-control' id='charityAddress' placeholder='0x' />
          </div>
        }
      </div>
      <div style={{ marginTop: '40px' }}>
        <button onClick={ handleSubmit } type="button" className="btn btn-primary">Submit</button>
        <button id='closeButton' type="button" className="btn btn-link" data-bs-dismiss="modal">Close</button>
      </div>
    </form>
  );
}


export default CreatePledgeForm;
