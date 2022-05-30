import React, { Component } from 'react';
import LandingPage from '../LandingPage/LandingPage';
import PledgeList from '../PledgeList/PledgeList';

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledges: []
    };

    this.refreshPledges = this.refreshPledges.bind(this);
  }

  componentDidMount() {
    this.refreshPledges();
  }

  async refreshPledges() {
    const pledges = await this.props.contract.getPledges();
    this.setState({ pledges });
  }
  
  render() {
    return(
      <div>
        <LandingPage
          refreshPledges={ this.refreshPledges }
          provider={ this.props.provider }
          contract={ this.props.contract } />
        <PledgeList pledges={ this.state.pledges } />
      </div>
    );
  }
}

export default AppContainer;