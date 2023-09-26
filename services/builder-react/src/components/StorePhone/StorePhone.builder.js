import { Builder } from "@builder.io/react";
import { StorePhone } from './StorePhone';


Builder.registerComponent(StorePhone, {
	name: "StorePhone",
	models: ["page", "symbol"],
	image: "https://unpkg.com/css.gg@2.0.0/icons/svg/phone.svg",
	description: "A nice banner for your demo phone number",
});
