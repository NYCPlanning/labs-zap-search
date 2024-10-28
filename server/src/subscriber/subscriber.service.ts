import { Injectable, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { Client } from "@sendgrid/client";
import crypto from 'crypto';
const validCustomFieldNames = ["K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10", "K11", "K12", "K13", "K14", "K15", "K16", "K17", "K18", "X01", "X02", "X03", "X04", "X05", "X06", "X07", "X08", "X09", "X10", "X11", "X12", "M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10", "Q11", "Q12", "Q13", "Q14", "R01", "R02", "R03", "CW"] as const;
export type CustomFieldNameTuple = typeof validCustomFieldNames;
type CustomFieldName = CustomFieldNameTuple[number];

const validCustomFieldValues = [1] as const;
export type CustomFieldValueTuple = typeof validCustomFieldValues;
type CustomFieldValue = CustomFieldValueTuple[number];


type HttpMethod = 'get'|'GET'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'delete'|'DELETE';

function delay(milliseconds){
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

@Injectable()
export class SubscriberService {
  sendgridEnvironmentIdVariable = "";
  constructor(
    private readonly config: ConfigService,
    private client: Client
  ) {
    this.client.setApiKey(this.config.get("SENDGRID_API_KEY"));
    this.sendgridEnvironmentIdVariable = `zap_${this.config.get("SENDGRID_ENVIRONMENT")}_id`;
  }

  /**
   * Find a user by their email address.
   * @param {string} email
   * @returns {object}
   */
  async findByEmail(email: string) {
    const searchRequest = {
      url: "/v3/marketing/contacts/search/emails",
      method:<HttpMethod> 'POST',
      body: {
        "emails": [email]
      }
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/get-contacts-by-emails
    try {
      const user = await this.client.request(searchRequest);
      return {isError: false, code: user[0].statusCode, ...user};
    } catch(error) {
      return {isError: true, ...error};
    }
  }

   /**
   * Add a user.
   * @param {string} email - The user's email address
   * @param {string} list - The email list to which we will add the user
   * @param {string} environment - Staging or production
   * @param {object} subscriptions - The CDs the user is subscribing to
   * @returns {object}
   */
  async create(email: string, list: string, environment: string, subscriptions: object, @Res() response) {
    const id = crypto.randomUUID();
    var custom_fields = Object.entries(subscriptions).reduce((acc, curr) => ({...acc, [`zap_${environment}_${curr[0]}`]: curr[1]}), {[`zap_${environment}_confirmed`]: 0})
    custom_fields[this.sendgridEnvironmentIdVariable] = id;

    var addRequest = {
      url: "/v3/marketing/contacts",
      method:<HttpMethod> 'PUT',
      body: {
        "list_ids": [list],
        "contacts": [{
          "email": email,
          custom_fields
        }]
      }
    }

    // If successful, this will add the request to the queue and return a 202
    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/add-or-update-a-contact
    try {
      const result = await this.client.request(addRequest);
      return {isError: false, result: result};
    } catch(error) {
      return {isError: true, ...error};
    }
  }

  /**
   * Validate a list of subscriptions.
   * @param {object} subscriptions - The subscriptions to validate.
   * @returns {boolean}
   */
  validateSubscriptions(subscriptions: object) {
    if (!subscriptions)
      return false;
      
    if(!(Object.entries(subscriptions).length>0))
      return false;

    for (const [key, value] of Object.entries(subscriptions)) {
      if (!(this.validateSubscriptionKey(key) && this.validateSubscriptionValue(value))) {
        return false
      }
    }
    return true;
  };

  /**
   * Validate the id of a subscription.
   * @param {string} key - The board id, which corresponds to a custom field name
   * @returns {boolean}
   */
  private validateSubscriptionKey(key: string): key is CustomFieldName {
    return validCustomFieldNames.includes(key as CustomFieldName);
  }

  /**
   * Validate the status of a subscription.
   * @param {number} value - The value which determines whether they wish to subscribe to the corresponding list
   * @returns {boolean}
   */
  private validateSubscriptionValue(value: number): value is CustomFieldValue {
    return validCustomFieldValues.includes(value as CustomFieldValue);
  }
}
