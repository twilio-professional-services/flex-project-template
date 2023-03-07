import React from 'react';
import ConferenceService from '../../utils/serverless/ConferenceService';

class ConferenceMonitor extends React.Component {
  state = {
    liveParticipantCount: 0,
  };

  componentDidMount() {

    console.log('Hello World 1')

    ConferenceService.helloWorld()
  }


  render() {
    // This is a Renderless Component, only used for monitoring and taking action on conferences
    return null;
  }
}

export default ConferenceMonitor;