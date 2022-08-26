import React from 'react';
import { Activity, Container, Title } from './PendingActivityStyles';
import {getPendingActivity} from '../../helpers/pendingActivity'
import IPendingActivity from '../../types/PendingActivity'


interface IProps{ }
interface IState { pendingActivity: IPendingActivity | null}
 
class PendingActivity extends React.PureComponent<IProps, IState> {
  state : IState = {pendingActivity: null}
  
  activityCheckInterval!: NodeJS.Timer;

  componentDidMount() {
    this.activityCheckInterval = setInterval(() => {
      const pendingActivity = getPendingActivity();
      
      if (pendingActivity?.sid !== this.state.pendingActivity?.sid) {
        this.setState({ pendingActivity });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.activityCheckInterval);
  }

  render() {
    return (
      this.state.pendingActivity && this.state.pendingActivity.isUserSelected ? (
        <Container>
          <Title>Pending Activity</Title>
          <Activity>{this.state.pendingActivity.name}</Activity>
        </Container>
      ) : null
    )
  }
}

export default PendingActivity;
