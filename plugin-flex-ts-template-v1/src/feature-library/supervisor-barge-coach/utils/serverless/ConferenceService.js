import ApiService from '../../../../utils/serverless/ApiService';

class ConferenceService extends ApiService {

  helloWorld = async () => {
    console.log('Hello World 2');

    const options = {
      method: 'GET'
    };

    const url = `${this.serverlessProtocol}://${this.serverlessDomain}/features/supervisor-barge-coach/flex/update-conference-participant`;

    try {
      const response = await fetch(url, options);
      const hello = await response.json();
      console.log(hello.hello)
    } catch (error) {
      console.error(`Error: `, error);
    }
  }
}

const conferenceService = new ConferenceService();
export default conferenceService;