import { Builder } from '@builder.io/react';
import { TranslatableText } from './TranslatableText';

Builder.registerComponent(TranslatableText, {
	name: 'TranslatableText',
	image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/display-grid.svg',
	description: 'Choose a collection to show its products in a grid',
	inputs: [
		{
			name: 'translatableText',
			type: `text`,
		},
	]
});
