import React, { useState, useEffect } from 'react';
import LandingPage from '../LandingPage/LandingPage';
import PledgeList from '../PledgeList/PledgeList';
import useContract from  '../../hooks/useContract';


function MainPage() {
  const [pledges, setPledges] = useState([]);
  const contract = useContract();

  const fetchPledges = async () => {
    setPledges(await contract.getPledges());
  }

  useEffect(() => {
    fetchPledges().catch(console.error);
  });

  return(
    <div>
      <LandingPage refreshPledges={ fetchPledges } />
      <PledgeList pledges={ pledges } />
    </div>
  );
}

export default MainPage;