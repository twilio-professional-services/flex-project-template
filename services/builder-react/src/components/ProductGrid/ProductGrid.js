/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import { useEffect, useState } from "react";
import { Box, Grid } from "@theme-ui/components";

import { buildShopifyClient, getCollection } from "../../services/shopify";
import { useDemoConfigs } from "../../viewModel/useDemoConfigs";
import ProductCard from "./ProductCard";

export const ProductGrid = ({ collection, offset = 0, limit = 10 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { locale } = useDemoConfigs();

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      const result = await getCollection(buildShopifyClient(locale), {
        handle: collection,
      });
      setProducts(result.products);
      setLoading(false);
    };
    fetchCollection();
  }, [collection]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Grid className={"product-grid"} gap={'30px'} width={["100%", "0%", "0%"]}>
      {products.slice(offset, limit).map((product, idx) => (
        <ProductCard product={product} key={idx} />
      ))}
    </Grid>
  );
};
