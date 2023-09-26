import { Builder } from "@builder.io/react";
import { UserAvatar } from './UserAvatar';


Builder.registerComponent(UserAvatar, {
  name: "UserAvatar",
  // models: ["page"],
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/user.svg",
  description: "User avatar component for your page",
  inputs: [
    {
      name: 'showName',
      type: 'boolean',
    },
  ]
});
