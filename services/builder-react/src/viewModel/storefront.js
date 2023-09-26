import { Component, createContext } from "react";
import Cookies from "js-cookie";
import { builder } from "@builder.io/react";

const COOKIE_NAME = "accept_cookies";

const initialState = {
  displaySidebar: false,
  acceptedCookies: false,
  displayedProduct: null,
};

export const StorefrontContext = createContext(initialState);

export class StorefrontProvider extends Component {
  state = initialState;

  get displaySidebar() {
    return this.state.displaySidebar;
  }

  openSidebar = () => {
    this.setState({ ...this.state, displaySidebar: true });
  };

  closeSidebar = () => {
    this.setState({ ...this.state, displaySidebar: false });
  };

  get acceptedCookies() {
    return this.state?.acceptedCookies ?? false;
  }

  set acceptedCookies(value) {
    this.setState({ ...this.state, acceptedCookies: value });
  }

  get displayedProduct() {
    return this.state.displayedProduct;
  }

  displayProduct = (productId) => {
    this.setState({ ...this.state, displayedProduct: productId });
  };

  hideProduct = () => {
    this.setState({ ...this.state, displayedProduct: null });
  };

  acceptCookies = () => {
    Cookies.set(COOKIE_NAME, "accepted", { expires: 365 });
    builder.canTrack = true;
    this.acceptedCookies = true;
  };

  componentDidMount() {
    if (!Cookies.get(COOKIE_NAME)) {
      builder.canTrack = false;
      this.acceptedCookies = false;
    } else this.acceptedCookies = true;
  }

  render() {
    const { children } = this.props;
    const {
      displaySidebar,
      acceptedCookies,
      acceptCookies,
      openSidebar,
      closeSidebar,
      displayedProduct,
      displayProduct,
      hideProduct,
    } = this;

    return (
        <StorefrontContext.Provider
          value={{
            displaySidebar,
            acceptedCookies,
            acceptCookies,
            openSidebar,
            closeSidebar,
            displayedProduct,
            displayProduct,
            hideProduct,
          }}
          /* eslint-disable-next-line react/no-children-prop */
          children={children}
        />
    );
  }
}
