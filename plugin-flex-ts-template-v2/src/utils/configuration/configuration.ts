import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";

export const getFeatureFlags = () => {
    const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
    return custom_data;  
}