import { Builder } from '@builder.io/react';
import { ProductGrid } from './ProductGrid';


Builder.registerComponent(ProductGrid, {
	name: 'ProductCollectionGrid',
	image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/display-grid.svg',
	description: 'Choose a collection to show its products in a grid',
	inputs: [
		{
			name: 'collection',
			type: `ShopifyCollectionHandle`,
		},
	],
});
