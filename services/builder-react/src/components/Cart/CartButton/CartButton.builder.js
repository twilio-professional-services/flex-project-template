import { Builder } from "@builder.io/react";
import { CartButton } from "./CartButton";

Builder.registerComponent(CartButton, {
  name: "CartButton",
  models: ["page", "symbol"],
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/shopping-cart.svg",
  description: "Display the shopping cart sidebar wherever you are",
});
