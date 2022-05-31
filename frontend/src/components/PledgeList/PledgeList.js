import React, { Component } from 'react';
import PledgeCard from '../PledgeCard/PledgeCard';
import { Navigate } from 'react-router-dom';
import utils from '../../utils/utils';

class PledgeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPledge: null
    };
  }

  onPledgeClick(pledge) {
    console.log(pledge);
    this.setState({
      selectedPledge: pledge
    });
  }

  render() {
    let pledges = this.props.pledges || [];
    pledges = pledges.map(pledge => utils.parsePledge(pledge));
    pledges.reverse();

    return (
      <div className='container-fluid' style={{ padding: '20px' }}>
        <div className='d-flex justify-content-center'>
          <div className={ this.state.selectedPledge ? 'hidden' : '' }>
            { pledges.length ? <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Contribute to an Open Pledge</h2> : ''}
            <div>
              {pledges.map((pledge, index) => {
                return (
                  <div key={ index } onClick={ this.onPledgeClick.bind(this, pledge) }>
                    <PledgeCard pledge={pledge} />
                  </div>
                )
              })}
            </div>
          </div>
          { this.state.selectedPledge && <Navigate to={ '/pledge/' + this.state.selectedPledge.id } /> }
        </div>
      </div>
    );
  }
}

export default PledgeList;