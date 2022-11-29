import { ITask } from "@twilio/flex-ui";
import ApiService from "../../../utils/serverless/ApiService";

class InternalCallService extends ApiService {
  rejectInternalTask = async (task: ITask) => {
    return new Promise((resolve, reject) => {

      const taskSid = task.taskSid;

      const encodedParams = {
        taskSid,
        Token: encodeURIComponent(
          this.manager.store.getState().flex.session.ssoTokenPayload.token
        ),
      };

      this.fetchJsonWithReject(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/internal-call/flex/cleanup-rejected-task`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: this.buildBody(encodedParams),
        }
      )
        .then((response) => {
          console.log("Outbound call has been placed into wrapping");
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };
}

const internalCallService = new InternalCallService();

export default internalCallService;
