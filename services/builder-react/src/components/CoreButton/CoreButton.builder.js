import { Builder } from "@builder.io/react";
import { CoreButton } from './CoreButton';


Builder.registerComponent(CoreButton, {
  name: "CoreButton",
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/user.svg",
  description: "Use this button the most you can",
  inputs: [
    {
      name: 'translatableText',
      type: 'text',
    },
  ]
});
