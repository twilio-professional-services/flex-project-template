import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { StorefrontContext } from "../../../viewModel/storefront";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { UserAvatar } from "../../UserAvatar/UserAvatar";
import {
  buildShopifyClient,
  formatCurrency,
  getCart,
} from "../../../services/shopify";
import { useDemoConfigs } from "../../../viewModel/useDemoConfigs";
import { CartItem } from "./CartItem";
import { Box } from "@theme-ui/components";
import { CoreButton } from "../../CoreButton/CoreButton";
import { useSegment } from "../../../viewModel/useSegment";

export const CartSidebar = () => {
  const [cart, setCart] = useState({});
  const checkoutUrl = useMemo(() => cart?.webUrl, [cart]);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const { displaySidebar, closeSidebar, hideProduct } =
    useContext(StorefrontContext);
  const { locale } = useDemoConfigs();
  const segment = useSegment();

  const totalPrice = useMemo(() => {
    return cart?.totalPriceV2?.amount ?? null;
  }, [cart]);

  const fetchCart = async () => {
    let fetchedCart = await getCart(buildShopifyClient(locale));
    setCart(fetchedCart);
    segment.track("Cart Viewed");
  };

  useEffect(() => {
    if (displaySidebar) {
      setTimeout(() => hideProduct(), 0);
      fetchCart();
    }
    // return () => setCart(null) && closeSidebar();
  }, [displaySidebar]);

  const onCheckout = () => {
    segment.track("Started Checkout", { cart });
    window.open(checkoutUrl, "_blank");
  };

  return (
    <div className={displaySidebar ? "sidebar" : "sidebar sidebar-closed"}>
      <CSSTransition
        in={displaySidebar && !!cart}
        timeout={1500}
        classNames="fade"
        unmountOnExit
        nodeRef={ref2}
      >
        <div
          ref={ref2}
          onClick={closeSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            background: "rgba(0, 0, 0, .8)",
            zIndex: -1,
            width: "100vw",
          }}
        />
      </CSSTransition>

      <CSSTransition
        in={!!cart}
        // in={!!displaySidebar}
        timeout={1500}
        classNames="fade"
        unmountOnExit
        nodeRef={ref}
      >
        <Box style={{ paddingBottom: 40 }} ref={ref}>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={closeSidebar}
            style={{ fontSize: "1.5rem" }}
          />

          <Box style={{ height: 70, marginTop: 20 }}>
            <UserAvatar showName={true} />
          </Box>

          {cart?.lineItems && (
            <Box>
              <CartSidebarItems
                cartId={cart?.id}
                onChange={fetchCart}
                lineItems={cart?.lineItems}
              />
            </Box>
          )}

          {totalPrice && (
            <h2
              style={{
                borderTop: "1px solid white",
                padding: 10,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              = {formatCurrency(locale, totalPrice)}
            </h2>
          )}

          {checkoutUrl && (
            <CoreButton
              id={"shopify-checkout-button"}
              style={{
                width: "100%",
                cursor: "pointer",
                color: "black",
                marginTop: "20px",
                marginBottom: "20px",
              }}
              onClick={onCheckout}
              translatableText={"proceedToCheckout"}
            />
          )}
        </Box>
      </CSSTransition>
    </div>
  );
};

export const CartSidebarItems = ({
  cartId,
  lineItems,
  onChange = () => {},
}) => {
  return (
    <div>
      {lineItems?.map((lin, idx) => (
        <CartItem
          cartId={cartId}
          onChange={onChange}
          lineItem={{
            ...lin.variant,
            id: lin.id,
            quantity: lin.quantity,
            productTitle: lin.title,
          }}
          key={idx}
        ></CartItem>
      ))}
    </div>
  );
};
