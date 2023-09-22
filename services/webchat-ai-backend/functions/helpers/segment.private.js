const axios = require("axios");

class SegmentClient {
  constructor(context, twilio) {
    const {
      APP_SEGMENT_WRITE_KEY,
      APP_SEGMENT_SPACE_ID,
      APP_SEGEMENT_ACCESS_TOKEN,
    } = context;
    this.profileClient = SegmentClient.createAxiosInstance(
      `https://profiles.segment.com/v1`,
      APP_SEGEMENT_ACCESS_TOKEN
    );
    this.identifyClient = SegmentClient.createAxiosInstance(
      `https://api.segment.io/v1/identify`,
      APP_SEGMENT_WRITE_KEY
    );
    this.trackClient = SegmentClient.createAxiosInstance(
      `https://api.segment.io/v1/track`,
      APP_SEGMENT_WRITE_KEY
    );
    this.space_id = APP_SEGMENT_SPACE_ID;
    this.logger = twilio;
  }

  static createAxiosInstance(baseURL, authToken) {
    return axios.create({
      baseURL,
      auth: {
        username: authToken,
        password: "",
      },
    });
  }

  /**
   * @param {string} idType - phone_number, email, or userId
   * @param {string} id - phone number value, email value, or user segment id value
   * @returns {Object} - if founds user: { user_id: string, traits: Object }
   */
  async fetchUser(idType, id) {
    console.log(idType, id);
    try {
      if (id.includes("whatsapp")) {
        const [_, phone] = id.split(":");
        id = phone;
      }

      const user_id =
        idType !== "user_id" ? await this.getUserId(idType, id) : id;

      console.log("user id", user_id);

      const url = `/spaces/${
        this.space_id
      }/collections/users/profiles/${idType}:${encodeURIComponent(id)}/traits`;

      const { data } = await this.profileClient.get(url);
      const { traits } = data;
      console.log(`found customer traits ${JSON.stringify(traits, null, 2)}`);

      const customer = {
        user_id,
        traits,
      };

      return customer;
    } catch (error) {
      this.logger.handleError("Error fetching user from Segment", error);
    }
  }

  /**
   * @param {string} idType - phone_number or email
   * @param {string} id - phone number value or email email value
   * @returns {Object} - { user_id: string }
   */
  async getUserId(idType, id) {
    try {
      const url = `/spaces/${
        this.space_id
      }/collections/users/profiles/${idType}:${encodeURIComponent(
        id
      )}/external_ids`;

      console.log("url", url);

      const { data: ids } = await this.profileClient.get(url);

      if (!ids || !ids.data) {
        throw new Error("No user ID found");
      }

      const { id: user_id } = ids.data.find((obj) => obj.type === "user_id");

      return user_id;
    } catch (error) {
      this.logger.handleError("Error fetching user ID from Segment", error);
    }
  }

  /**
   * @param {object} data - { userId: string, traits: Object }
   * @returns {void}
   */
  async updateUser(data) {
    try {
      await this.identifyClient.post("", data);
    } catch (error) {
      this.logger.handleError("Error updating user Segment", error);
    }
  }
}

module.exports = { SegmentClient };
