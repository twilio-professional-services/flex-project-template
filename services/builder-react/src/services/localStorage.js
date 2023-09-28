import Cookies from 'js-cookie';

export const LocalStorageKeys = {
  CART: "shopify_local_store__cart",
  CHECKOUT_ID: "shopify_local_store__checkout_id"
};

export const CookieKeys = {
  SEGMENT_USER_ID: "ajs_user_id"
};

/**
 *
 * @param {string} key
 * @param {string} value
 */
function set(key, value) {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      console.warn(" Error reading from local storage");
    }
  }
}

/**
 *
 * @param {string} key
 * @returns {string|null}
 */
function get(key) {
  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 *
 * @returns {string|null}
 */
function getCachedCheckoutId() {
  return get(LocalStorageKeys.CHECKOUT_ID);
}

/**
 *
 * @param {string} checkoutId
 */
function setCachedCheckoutId(checkoutId) {
  return set(LocalStorageKeys.CHECKOUT_ID, checkoutId)
}

function getSegmentUserId() {
  return Cookies.get(CookieKeys.SEGMENT_USER_ID)
}

export const LocalStorage = {
  get,
  set,
  getCachedCheckoutId,
  setCachedCheckoutId,
  getSegmentUserId,
};
