import { Component, StrictMode } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { BuilderComponent } from "@builder.io/react";
import { Webchat } from "./components/webchat";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { StorefrontProvider } from "./viewModel/storefront";
import { CartSidebar } from "./components/Cart/CartSidebar/CartSidebar";
import { ProductSidebar } from "./components/ProductSidebar/ProductSidebar";
import { builderApiKey, oidcAuthorityUrl, oidcClientName } from "./config";
import { AuthProvider } from "oidc-react";
import { LocalStorage } from "./services/localStorage";

const API_KEY = builderApiKey;

const oidcConfig = {
  authority: oidcAuthorityUrl,
  clientId: oidcClientName,
  redirectUri: window.location.href,
  onSignIn: (user) => {
    if (!LocalStorage.getSegmentUserId()) {
      window?.analytics.identify(user.profile.segmentPersonaId);
    }

    const redirQuery = new URLSearchParams(window.location.search);
    redirQuery.delete('state');
    redirQuery.delete('session_state');
    redirQuery.delete('code');

    const redirectUrl = new URL(window.location.href);
    redirectUrl.search = redirQuery.toString();

    window.history.replaceState({}, null, redirectUrl.toString())
  },
};

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <HashRouter>
        <div>
          <Routes>
            <Route path="*" element={<CatchallPage />} />
          </Routes>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

class CatchallPage extends Component {
  state = { notFound: false };

  render() {
    return !this.state.notFound ? (
      <StrictMode>
        <StorefrontProvider>
          <CartSidebar />
          <ProductSidebar />
          <Webchat />
          <BuilderComponent
            apiKey={API_KEY}
            model="page"
            contentLoaded={(content) => {
              if (!content) {
                this.setState({ notFound: true });
              }
            }}
          >
            <div className="loading">Loading...</div>
          </BuilderComponent>
        </StorefrontProvider>
      </StrictMode>
    ) : (
      <NotFound />
    );
  }
}

const NotFound = () => <h1>No page found for this URL, did you publish it?</h1>;

export default App;
