import { Injectable, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { Client } from "@sendgrid/client";
import { MailService } from "@sendgrid/mail";
import crypto from 'crypto';
import * as Sentry from "@sentry/nestjs";

const validCustomFieldNames = ["confirmed", "K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10", "K11", "K12", "K13", "K14", "K15", "K16", "K17", "K18", "X01", "X02", "X03", "X04", "X05", "X06", "X07", "X08", "X09", "X10", "X11", "X12", "M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10", "Q11", "Q12", "Q13", "Q14", "R01", "R02", "R03", "CW"] as const;
export type CustomFieldNameTuple = typeof validCustomFieldNames;
type CustomFieldName = CustomFieldNameTuple[number];

const validCustomFieldValues = [0, 1] as const;
export type CustomFieldValueTuple = typeof validCustomFieldValues;
type CustomFieldValue = CustomFieldValueTuple[number];

export type ValidSubscriptionSet = Record<CustomFieldName, CustomFieldValue>;

type HttpMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'delete' | 'DELETE';

function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

@Injectable()
export class SubscriberService {
  sendgridEnvironmentIdVariable = "";
  environment = "";
  constructor(
    private readonly config: ConfigService,
    private client: Client,
    private mailer: MailService
  ) {
    this.client.setApiKey(this.config.get("SENDGRID_API_KEY"));
    this.environment = this.config.get("SENDGRID_ENVIRONMENT");
    this.sendgridEnvironmentIdVariable = `zap_${this.config.get("SENDGRID_ENVIRONMENT")}_id`;
    this.mailer.setApiKey(this.config.get("SENDGRID_API_KEY"));
  }

  /**
   * Find a user by their email address.
   * @param {string} email
   * @returns {object}
   */
  async findByEmail(email: string) {
    const searchRequest = {
      url: "/v3/marketing/contacts/search/emails",
      method: <HttpMethod>'POST',
      body: {
        "emails": [email]
      }
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/get-contacts-by-emails
    try {
      const user = await this.client.request(searchRequest);
      return { isError: false, code: user[0].statusCode, ...user };
    } catch (error) {
      return { isError: true, ...error };
    }
  }

   /**
   * Add a user.
   * @param {string} email - The user's email address
   * @param {string} list - The email list to which we will add the user
   * @param {string} environment - Staging or production
   * @param {object} subscriptions - The CDs the user is subscribing to
   * @param {string} id - The id needed for confirmation
   * @returns {object}
   */
  async create(email: string, list: string, environment: string, subscriptions: object, id: string, @Res() response) {
    var custom_fields = Object.entries(subscriptions).reduce((acc, curr) => ({...acc, [`zap_${environment}_${curr[0]}`]: curr[1]}), {[`zap_${environment}_confirmed`]: 0})
    custom_fields[this.sendgridEnvironmentIdVariable] = id;

    var addRequest = {
      url: "/v3/marketing/contacts",
      method: <HttpMethod>'PUT',
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
      return {isError: false, result: result, anonymous_id: id};
    } catch(error) {
      console.error(error, addRequest.body)
      Sentry.captureException({error, email, id, list})
      return {isError: true, ...error, request_body: addRequest.body};
    }
  }


  /**
   * Checks that a job has imported correctly.
   * @param {string} importId - The job id returned by the initial request
   * @param {number} counter - Tracks the number of times we have checked
   * @param {number} checksBeforeFail - Max # times to check
   * @param {number} pauseBetweenChecks - How long to wait between checks, in milliseconds
   * @param {object} errorInfo - Additional info to log in case of error
   * @returns {object}
   */
  async checkCreate(importId: string, @Res() response, counter: number = 0, checksBeforeFail: number, pauseBetweenChecks: number, errorInfo: any) {
     if(counter >= checksBeforeFail) {
      console.error({
        code: 408,
        message: `Polling limit of ${checksBeforeFail} checks with a ${pauseBetweenChecks/1000} second delay between each has been reached.`,
        job_id: importId,
        errorInfo
      })
      Sentry.captureException({
        code: 408,
        message: `Polling limit of ${checksBeforeFail} checks with a ${pauseBetweenChecks/1000} second delay between each has been reached.`,
        job_id: importId,
        errorInfo
      })
      return { isError: true, code: 408, errorInfo }
    }

    await delay(pauseBetweenChecks);

    const confirmationRequest = {
      url: `/v3/marketing/contacts/imports/${importId}`,
      method:<HttpMethod> 'GET',
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/import-contacts-status
    try {
      const job = await this.client.request(confirmationRequest);
      if(job[1].status === "pending") {
        return await this.checkCreate(importId, response, counter + 1, checksBeforeFail, pauseBetweenChecks, errorInfo);
      } else if (["errored", "failed"].includes(job[1].status)) {
        console.error(job, errorInfo);
        Sentry.captureException(job, errorInfo);
        return {isError: true, job, errorInfo};
      }
      return {isError: false, status: job[1].status, ...job};
    } catch(error) {
      console.error(error, errorInfo);
      Sentry.captureException(error, errorInfo);
      return {isError: true, ...error, errorInfo};
    }
  }

   /**
   * Send the user an email requesting signup confirmation.
   * @param {string} email - The user's email address
   * @param {string} environment - Staging or production
   * @param {object} subscriptions - The CDs the user is subscribing to
   * @param {string} id - The id needed for confirmation
   * @returns {object}
   */
   async sendConfirmationEmail(email: string, environment: string, subscriptions: ValidSubscriptionSet, id: string) {
      // https://github.com/sendgrid/sendgrid-nodejs/blob/main/docs/use-cases/transactional-templates.md
      const msg = {
        to: email,
        from: 'do-not-reply@planning.nyc.gov', // Your verified sender
        templateId: 'd-3684647ef2b242d8947b65b20497baa0',
        dynamicTemplateData: {
          "id": id,
          "domain": environment === "production" ? "zap.planning.nyc.gov" : "zap-staging.planninglabs.nyc",
          "subscriptions": this.convertSubscriptionsToHandlebars(subscriptions)
        }
      }
      this.mailer.send(msg)
        .then((response) => {
          return {isError: false, statusCode: response[0].statusCode}
        })
        .catch((error) => {
          console.error(error)
          return {isError: true, ...error}
        })
   }
   
   /**
   * Send the user an email to modify their subscriptions.
   * @param {string} email - The user's email address
   * @param {string} environment - Staging or production
   * @param {string} id - The id needed for confirmation
   * @returns {object}
   */
  async sendModifySubscriptionEmail(email: string, environment: string, id: string) {
    // https://github.com/sendgrid/sendgrid-nodejs/blob/main/docs/use-cases/transactional-templates.md
    const msg = {
      to: email,
      from: 'do-not-reply@planning.nyc.gov', // Your verified sender
      templateId: 'd-63182ea5a0df48ec86b24606111075ae',
      dynamicTemplateData: {
        "user_id": id,
        "domain": environment === "production" ? "zap.planning.nyc.gov" : "zap-staging.planninglabs.nyc",
      }
    }
    this.mailer.send(msg)
      .then((response) => {
        return {isError: false, statusCode: response[0].statusCode}
      })
      .catch((error) => {
        console.error(error)
        return {isError: true, ...error}
      })
  } 

  /**
   * Fetch the user's list of subscriptions.
   * @param {string} id - The user's zap_production_id or zap_staging_id.
   * @returns {object}
   */
  async getSubscriptions(id: string) {
    const query = `${this.sendgridEnvironmentIdVariable} LIKE '${id}'`
    const request = {
      url: `/v3/marketing/contacts/search`,
      method:<HttpMethod> 'POST',
      body: { query }
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/search-contacts
    // https://www.twilio.com/docs/sendgrid/for-developers/sending-email/segmentation-query-language
    try {
      const userData = await this.client.request(request);
      if(userData[0].body["contact_count"] === 0) {
        return {isError: true, code: 404, message: "No users found."};
      }
      var subscriptionList = {};
      for (const [key, value] of Object.entries(userData[0].body["result"][0]["custom_fields"])) {
        if(key.startsWith(`zap_${this.environment}_`) && validCustomFieldNames.includes(key.replace(`zap_${this.environment}_`, "") as CustomFieldName)) {
          subscriptionList[key.replace(`zap_${this.environment}_`, "")] = value;
        }
      }
      return {isError: false, code: userData[0].statusCode, "subscription_list": subscriptionList, email: userData[0].body["result"][0].email};
    } catch(error) {
      return {isError: true, ...error};
    }
  };

   /**
   * Fetch the user email
   * @param {string} id - The user's zap_production_id or zap_staging_id.
   * @returns {object}
   */
  async getUserById(id: string) {
    const query = `${this.sendgridEnvironmentIdVariable} LIKE '${id}'`
    const request = {
      url: `/v3/marketing/contacts/search`,
      method: <HttpMethod>'POST',
      body: { query }
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/search-contacts
    // https://www.twilio.com/docs/sendgrid/for-developers/sending-email/segmentation-query-language
    try {
      const users = await this.client.request(request);
      if (users[0].body["contact_count"] === 0) {
        return { isError: true, code: 404, message: "No users found." };
      }
      const email = users[0].body["result"][0].email;
      
      return { isError: false, code: users[0].statusCode, "email": email };
    } catch (error) {
      return { isError: true, ...error };
    }
  };


  /**
   * Update user subscription.
   * @param {string} environment - The environment variable
   * @param {string} email - The user's email
   * @param {object} custom_fields - The users custom lists and preferences
   * @returns {object}
   */
  async update(environment: string, email: string, custom_fields: object) {
    const updatedCustomFields = Object.entries(custom_fields).reduce((acc, curr) => ({ ...acc, [`zap_${environment}_${curr[0]}`]: curr[1] }), {})

    const request = {
      url: `/v3/marketing/contacts`,
      method: <HttpMethod>'PUT',
      body: {
        "contacts": [{
          "email": email,
          "custom_fields": updatedCustomFields
        }]
      }
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/add-or-update-a-contact
    try {
      const result = await this.client.request(request);
       return { isError: false, result: result };
    } catch (error) {
      return { isError: true, ...error };
    }
  }

  /**
   * Validate a list of subscriptions.
   * @param {object} subscriptions - The subscriptions to validate.
   * @returns {boolean}
   */
  validateSubscriptions(subscriptions: ValidSubscriptionSet) {
    if (!subscriptions)
      return false;

    if (!(Object.entries(subscriptions).length > 0))
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

  /**
   * Convert the uploaded subscriptions object into a format for Handlebars to use in the confirmation email
   * @param {object} subscriptions - The set of CDs the user is subscribing to
   * @returns {boolean}
   */
  private convertSubscriptionsToHandlebars(subscriptions: ValidSubscriptionSet) {
    var handlebars = { "citywide": false, "boroughs": [] }
    const boros = {
      "K": "Brooklyn",
      "X": "Bronx",
      "M": "Manhattan",
      "Q": "Queens",
      "R": "Staten Island"
    }
    for (const [key, value] of Object.entries(subscriptions)) {
      if (value === 1) {
        if (key === "CW") {
          handlebars.citywide = true;
        } else if (boros[key[0]]) {
          const i = handlebars.boroughs.findIndex((boro) => boro.name === boros[key[0]]);
            if (i === -1) {
              handlebars.boroughs.push({
                "name": boros[key[0]],
                "communityBoards": [parseInt(key.slice(-2))]
              })
            } else {
              handlebars.boroughs[i]["communityBoards"].push(parseInt(key.slice(-2)))
            }
        }
      }
    }
    return handlebars;
  }

}
