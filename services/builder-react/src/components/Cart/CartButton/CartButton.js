// import React, { useContext } from "react";
// import { StorefrontContext } from "../../../context/storefront";
// import { Bag } from "../../Icons";
// import { useSegment } from "../../../context/segment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { StorefrontContext } from '../../../viewModel/storefront';

export const CartButton = () => {
  const { displaySidebar, closeSidebar, openSidebar } =
    useContext(StorefrontContext);

  const onOpenCart = () => {
    if (!displaySidebar) openSidebar();
    else closeSidebar();
  };

  return (
    <div
      id={"shopping-cart-button"}
      onClick={onOpenCart}
      style={{ cursor: "pointer" }}
    >
      <FontAwesomeIcon
        icon={faShoppingCart}
        style={{ color: "black", fontSize: "1.5rem" }}
      />
    </div>
  );
};
