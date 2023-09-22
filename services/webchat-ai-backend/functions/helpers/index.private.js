"use strict";
const functions = Runtime.getFunctions(); //eslint-disable-line no-undef

class Helpers {
  constructor(context) {
    /*
     * Load Segment Helper Methods
     */
    const segmentPath = functions["helpers/segment"].path;
    const segmentClient = require(segmentPath).SegmentClient;
    this.segment = new segmentClient(context, this.twilio);

    /*
     * Load Shopify Helper Methods
     */
    const shopifytPath = functions["helpers/shopify"].path;
    const shopifyClient = require(shopifytPath).ShopifyClient;
    this.shopify = new shopifyClient(context);

    /*
     * Load Twilio Helper Methods
     */
    const twilioPath = functions["helpers/twilio"].path;
    const twilioLib = require(twilioPath).TwilioHelper;
    this.twilio = new twilioLib();

    /*
     * Load KeyCloak Helper Methods
     */
    const kcPath = functions["helpers/keycloak"].path;
    const kcLib = require(kcPath).KeyCloakClient;
    this.kc = new kcLib(context, this.twilio);
  }
}

/** @module helpers */
module.exports = Helpers;
