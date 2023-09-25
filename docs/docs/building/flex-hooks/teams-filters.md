Use a teams filter hook to register your own [filter definitions](https://www.twilio.com/docs/flex/developer/ui/team-view-filters) in the Teams view.

```ts
import { FilterDefinition } from "@twilio/flex-ui";

import { emailFilter } from "../../filters/emailFilter"; // example filter from the teams-view-filters feature

export const teamsFilterHook = async function getSampleFilters() {
  const enabledFilters = [] as Array<FilterDefinition>;

  enabledFilters.push(emailFilter());

  return enabledFilters;
};
```