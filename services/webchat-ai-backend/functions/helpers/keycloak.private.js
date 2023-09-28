const axios = require("axios");
const url = require("url");

class KeyCloakClient {
  constructor(context, twilio) {
    const { CONFIGAPI, KC_SERVER_TOKEN_URL, KC_CLIENT_SECRET, KC_CLIENT_ID } =
      context;
    this.localToken = { expires: 0, token: "" };
    this.client = KeyCloakClient.createAxiosInstance(
      CONFIGAPI,
      this.localToken,
      KC_SERVER_TOKEN_URL,
      KC_CLIENT_SECRET,
      KC_CLIENT_ID
    );
    this.logger = twilio;
  }

  static async getToken(token) {
    const getToken = await axios.post(token, this.tokenParams.toString());

    return getToken.data;
  }

  static createAxiosInstance(
    baseURL,
    localToken,
    urlToken,
    clientSecret,
    clientId
  ) {
    this.axiosInstance = axios.create({
      baseURL,
    });

    /* REMOVING AUTH UNTIL SOLVE BOT STUDIO ISSUE

    this.tokenParams = new url.URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });

    const MIN_TIME_RENEW_TOKEN = 30000;

    this.axiosInstance.interceptors.request.use(async (req) => {
      if (localToken.expires - Date.now() < MIN_TIME_RENEW_TOKEN) {
        const token = await this.getToken(urlToken);
        localToken.expires = Date.now() + token.expires_in * 1000;
        localToken.token = token.access_token;
      }
      req.headers.Authorization = `Bearer ${localToken.token}`;
      return req;
    }); */

    return this.axiosInstance;
  }

  /**
   * @param {string} email - userEmail
   * @returns {Object} - keycloak user attributes if founds user, if not returns a empty array []
   */
  async fetchUserByEmail(email) {
    try {
      const url = `user/find-user?email=${email}`;

      const { data } = await this.client.get(url);

      if (!data || !data.length) {
        throw new Error("No keycloak user found");
      }

      console.log(`found keycloak user ${JSON.stringify(data, null, 2)}`);

      return data;
    } catch (error) {
      this.logger.handleError("Error fetching KeyCloak user by email", error);
    }
  }

  /**
   * @param {string} key - any keycloak attributes key
   * @param {string} value - key value corresponding
   * @returns {Object} - keycloak user attributes if founds user, if not returns a empty array []
   */
  async fetchUserByQuery(key, value) {
    try {
      const url = `user/find-by-query?key=${key}&value=${value}`;

      const { data } = await this.client.get(url);

      if (!data || !data.length) {
        throw new Error("No keycloak user found");
      }

      console.log(`found keycloak user ${JSON.stringify(data, null, 2)}`);

      return data;
    } catch (error) {
      this.logger.handleError("Error fetching KeyCloak user by query", error);
    }
  }
}

module.exports = { KeyCloakClient };
