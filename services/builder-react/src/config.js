import env from "react-dotenv";

if (!env.REACT_APP_BUILDER_PUBLIC_KEY)
  throw new Error("Missing env variable BUILDER_PUBLIC_KEY");

if (!env.REACT_APP_WEBCHAT_URL)
  throw new Error("Missing env variable REACT_APP_WEBCHAT_URL");

if (!env.REACT_APP_SHOPIFY_STORE_DOMAIN)
  throw new Error("Missing env variable REACT_APP_SHOPIFY_STORE_DOMAIN");

if (!env.REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN)
  throw new Error(
    "Missing env variable REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN"
  );

if (!env.REACT_APP_OIDC_AUTHORITY_URL)
  throw new Error("Missing env variable REACT_APP_OIDC_AUTHORITY_URL");

if (!env.REACT_APP_OIDC_CLIENT_NAME)
  throw new Error("Missing env variable REACT_APP_OIDC_CLIENT_NAME");

export const builderApiKey = env?.REACT_APP_BUILDER_PUBLIC_KEY || 'missing';
export const shopifyApiToken = env?.REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN || 'missing';
export const storeDomain = env?.REACT_APP_SHOPIFY_STORE_DOMAIN || 'missing';
export const webchatUrl = env?.REACT_APP_WEBCHAT_URL || 'missing';
export const oidcAuthorityUrl = env?.REACT_APP_OIDC_AUTHORITY_URL;
export const oidcClientName = env?.REACT_APP_OIDC_CLIENT_NAME;