import { withTaskContext } from "@twilio/flex-ui";
import IFrameWrapper, { Props } from './IFrameWrapperComponent'


export default withTaskContext<Props, typeof IFrameWrapper>(IFrameWrapper);