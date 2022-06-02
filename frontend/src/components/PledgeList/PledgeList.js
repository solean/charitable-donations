import React, { useState } from 'react';
import PledgeCard from '../PledgeCard/PledgeCard';
import { Navigate } from 'react-router-dom';
import utils from '../../utils/utils';

function PledgeList(props) {
  const [selectedPledge, setSelectedPledge] = useState(null);

  const onPledgeClick = pledge => {
    setSelectedPledge(pledge);
  }

  let pledges = props.pledges || [];
  pledges = pledges.map(pledge => utils.parsePledge(pledge));
  pledges.reverse();


  return (
    <div className='container-fluid' style={{ padding: '20px' }}>
      <div className='d-flex justify-content-center'>
        <div className={ selectedPledge ? 'hidden' : '' }>
          { pledges.length ? <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Contribute to an Open Pledge</h2> : ''}
          <div>
            {pledges.map((pledge, index) => {
              return (
                <div key={ index } onClick={ onPledgeClick.bind(this, pledge) }>
                  <PledgeCard pledge={pledge} />
                </div>
              )
            })}
          </div>
        </div>
        { selectedPledge && <Navigate to={ '/pledge/' + selectedPledge.id } /> }
      </div>
    </div>
  );
}

export default PledgeList;