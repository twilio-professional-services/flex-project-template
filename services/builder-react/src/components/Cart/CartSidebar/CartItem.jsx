import {
  buildShopifyClient,
  formatCurrency,
  updateItemQuantity,
} from "../../../services/shopify";
import { useDemoConfigs } from "../../../viewModel/useDemoConfigs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import React, { useState } from "react";
import { useSegment } from "../../../viewModel/useSegment";

/**
 *
 * @param cartId
 * @param {ShopifyClient.LineItem} lineItem
 * @param {function} onChange
 * @returns {JSX.Element}
 * @constructor
 */
export const CartItem = ({ cartId, lineItem, onChange }) => {
  const segment = useSegment();
  const { locale } = useDemoConfigs();
  const { id, title, quantity, image, price, productTitle } = lineItem;
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);

  const updateQuantity = async (amount) => {
    await updateItemQuantity(
      buildShopifyClient(locale),
      cartId,
      id,
      quantity + amount
    );
    return onChange();
  };

  const increase = async () => {
    setAdding(true);
    await updateQuantity(1);
    segment.track("Product Added", lineItem);
    setAdding(false);
  };
  const decrease = async () => {
    setRemoving(true);
    await updateQuantity(-1);
    segment.track("Product Removed", lineItem);
    setRemoving(false);
  };

  return (
    <div style={{ marginTop: 40 }}>
      <img src={image.src} style={{ width: "100%" }} alt={image.id} />
      <div
        style={{
          display: "flex",
          flexFlow: "row",
          justifyContent: "space-between",
          borderBottom: "1px dotted gray",
          marginTop: "5px",
        }}
      >
        <FontAwesomeIcon
          icon={!removing ? faMinus : faClock}
          fontSize={"1.5em"}
          onClick={decrease}
          spin={removing}
          width={24}
          cursor={"pointer"}
        />

        <h2 style={{ margin: "0px 10px 10px 10px" }}>
          <b>{quantity > 1 ? quantity + " x" : ""}</b> {productTitle}{" "}
          <span style={{ fontStyle: "italic", fontWeight: 300 }}>{title}</span>
        </h2>

        <FontAwesomeIcon
          icon={!adding ? faPlus : faClock}
          fontSize={"1.5em"}
          onClick={increase}
          spin={adding}
          width={24}
          cursor={"pointer"}
        />
      </div>

      <h2
        style={{
          display: "flex",
          justifyContent: "flex-end",
          borderTop: "1px dotted solid",
          margin: "10px",
        }}
      >
        {formatCurrency(locale, (quantity || 0) * parseFloat(price?.amount))}
      </h2>
    </div>
  );
};
