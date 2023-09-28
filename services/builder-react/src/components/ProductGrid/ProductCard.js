/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Text } from "theme-ui";
import React, { useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import { useDemoConfigs } from "../../viewModel/useDemoConfigs";
import { formatCurrency } from "../../services/shopify";
import { StorefrontContext } from "../../viewModel/storefront";
import { CoreButton } from "../CoreButton/CoreButton";

/**
 *
 * @param {ShopifyBuy.Product} product
 * @param {boolean?} enableDescription
 * @param {{}?} carouselProps
 * @returns {JSX.Element}
 * @constructor
 */
const ProductCard = ({
  product,
  carouselProps = {},
  containerStyle = {},
  disableDescription = false,
}) => {
  const { locale } = useDemoConfigs();
  const { displayProduct, closeSidebar } = useContext(StorefrontContext);

  const { title, images, description, id: productId } = product;

  // FIX ME this should be the correct code but shopify product variants aren't correctly set yet
  // const images = useMemo(() => product.variants.map((p) => p.image), [product]);
  const { amount } = product.variants[0].priceV2;

  const showProductDetails = () => {
    setTimeout(() => closeSidebar(), 0);
    displayProduct(productId);
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          justifyContent: "space-between",
          margin: "0",
        }}
      >
        <h2 style={{ fontWeight: 400 }}>
          {title}
          <br />
          <span
            style={{
              fontWeight: 200,
              borderBottom: "1px solid black",
            }}
          >
            {formatCurrency(locale, amount)}
          </span>
        </h2>
      </div>

      <div>
        <Carousel
          showThumbs={false}
          transitionTime={300 + Math.random() * 200}
          interval={5000 + Math.random() * 1000}
          autoPlay
          infiniteLoop
          showStatus={false}
          {...carouselProps}
        >
          {images.map((i, idx) => (
            <img src={i.src} alt={"aaa"} key={idx} />
          ))}

          {disableDescription ? null : (
            <div
              style={{
                textAlign: "left",
                overflow: "hidden",
                display: "flex",
                flexFlow: "column",
                alignItems: "flex-end",
                padding: "0px 20px 0px 0px",
                height: "100%",
                width: "100%",
                backgroundColor: "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: "1rem",
                  fontWeight: 200,
                  borderLeft: "1px dashed gray",
                  paddingLeft: "20px",
                }}
              >
                {description.substring(0, 300).concat("...")}
              </Text>
            </div>
          )}
        </Carousel>

        {disableDescription || (
          <CoreButton
            style={{
              width: "100%",
              cursor: "pointer",
              color: "black",
              marginTop: "30px",
            }}
            translatableText={"addToCart"}
            onClick={showProductDetails}
          ></CoreButton>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
