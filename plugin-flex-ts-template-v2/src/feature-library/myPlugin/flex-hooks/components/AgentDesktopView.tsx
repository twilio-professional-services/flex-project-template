import * as Flex from "@twilio/flex-ui";
import React from 'react';
import CustomTaskList from "../../custom-components/CustomTaskList";

function addCustomTaskListToPanel1(flex: typeof Flex) {
  const options = { sortOrder: -1 };
  flex.AgentDesktopView.Panel1.Content.add(
    <CustomTaskList key="SamplePlugin-component" />,
    options
  );
}

export {addCustomTaskListToPanel1 as sampleFeatureCustomTaskListToPanel1}
