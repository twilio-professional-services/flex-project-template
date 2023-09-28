import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Grid } from "@theme-ui/components";
import { StorefrontContext } from "../../viewModel/storefront";
import { useDemoConfigs } from "../../viewModel/useDemoConfigs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  addItemToCart,
  buildShopifyClient,
  getProduct,
} from "../../services/shopify";
import { CoreButton } from "../CoreButton/CoreButton";
import { Select, Text } from "theme-ui";
import ProductCard from "../ProductGrid/ProductCard";
import { useSegment } from "../../viewModel/useSegment";

export const ProductSidebar = () => {
  const segment = useSegment();
  const { locale } = useDemoConfigs();
  const { openSidebar, displayedProduct, hideProduct } =
    useContext(StorefrontContext);
  const ref = useRef(null);
  const ref2 = useRef(null);

  const [completeProductData, setCompleteProductData] = useState(null);
  const [selectedVariant, selectVariant] = useState(null);

  const product = useMemo(
    () =>
      !completeProductData
        ? null
        : {
            title: completeProductData?.title,
            images: completeProductData?.images,
            description: completeProductData?.descriptionHtml,
            amount: completeProductData?.variants[0].priceV2.amount,
            variants: completeProductData?.variants,
          },
    [completeProductData]
  );

  const addToCart = async () => {
    await addItemToCart(buildShopifyClient(locale), selectedVariant.id, 1);
    segment.track("Product Added", selectedVariant);
    openSidebar();
  };

  useEffect(() => {
    if (!!displayedProduct) {
      getProduct(buildShopifyClient(locale), { id: displayedProduct }).then(
        (prod) => {
          setCompleteProductData(prod);
          selectVariant(prod?.variants[0]);
        }
      );
    }
    return () => {
      setCompleteProductData(null);
      selectVariant(null);
    };
  }, [displayedProduct]);

  useEffect(() => {
    if (!!selectedVariant)
      segment.track("Product Viewed", { product: selectedVariant });
  }, [selectedVariant]);

  return (
    <div
      className={
        displayedProduct
          ? "product-display"
          : "product-display product-display-closed"
      }
    >
      <CSSTransition
        in={!!completeProductData}
        timeout={1500}
        classNames="fade"
        unmountOnExit
        nodeRef={ref2}
      >
        <div
          ref={ref2}
          onClick={hideProduct}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            background: "rgba(0, 0, 0, 1)",
            zIndex: -1,
            width: "100vw",
          }}
        />
      </CSSTransition>

      <div>
        <FontAwesomeIcon
          icon={faTimes}
          onClick={hideProduct}
          style={{ fontSize: "1.5rem", cursor: "pointer" }}
        />
      </div>

      <CSSTransition
        in={!!completeProductData}
        timeout={1500}
        classNames="fade"
        unmountOnExit
        nodeRef={ref}
      >
        <Grid gap={"30px"} columns={2} ref={ref}>
          <div>
            {completeProductData && (
              <ProductCard
                product={completeProductData}
                disableDescription={true}
                carouselProps={{ autoPlay: false }}
                containerStyle={{ marginBottom: "20px" }}
              ></ProductCard>
            )}
          </div>

          <div>


            {!!selectedVariant && (
              <div>
                <div
                  style={{
                    borderLeft: "1px dashed gray",
                    padding: "20px",
                    marginBottom: '20px'
                  }}
                >
                  <Text
                    style={{ fontWeight: 200 }}
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                  ></Text>
                </div>

                {product?.variants && (
                  <Select
                    onChange={({ target: { value } }) =>
                      selectVariant(JSON.parse(value))
                    }
                    defaultValue={selectedVariant?.title}
                    backgroundColor={"transparent"}
                  >
                    {product?.variants.map((variant) => (
                      <option key={variant.id} value={JSON.stringify(variant)}>
                        {variant.title}
                      </option>
                    ))}
                  </Select>
                )}

                <CoreButton
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    color: "black",
                  }}
                  translatableText={"addToCart"}
                  onClick={addToCart}
                ></CoreButton>
              </div>
            )}
          </div>
        </Grid>
      </CSSTransition>
    </div>
  );
};
