import { Injectable, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { Client } from "@sendgrid/client";
import { MailService } from "@sendgrid/mail";
import * as Sentry from "@sentry/nestjs";

type HttpMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'delete' | 'DELETE';

@Injectable()
export class SendUpdateService {
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
   * Create the email to send out a project update
   * @param {string} id - ZAP Project ID
   * @returns {object}
   */
  async createSingleSendProjectUpdate(id: string) {
    const data = {
      name: "Single Send Test 2024-12-05 v5",
      send_to: {
        segment_ids: ["569cd6d8-0319-4724-a992-a887ddadd18e"]
      },
      email_config: {
        subject: "Single Send Test 2024-12-05 v5",
        html_content: `<p style="color: green;">Hello {{zap_staging_id}}</p>`,
        generate_plain_content: true,
        custom_unsubscribe_url: `https://${this.environment === "production" ? "zap.planning.nyc.gov" : "zap-staging.planninglabs.nyc"}/subscribers/{{${this.environment === "production" ? "zap_production_id" : "zap_staging_id"}}}`,
        sender_id: 6328130
      }
    };

    const request = {
      url: `/v3/marketing/singlesends`,
      method: <HttpMethod>'POST',
      body: data,
    };

    // https://www.twilio.com/docs/sendgrid/api-reference/single-sends/create-single-send
    try {
      const singleSend = await this.client.request(request);
      return { isError: false, code: singleSend[0].statusCode, ...singleSend };
    } catch (error) {
      Sentry.captureException({during: "createSingleSendProjectUpdate", ...error})
      return { isError: true, ...error };
    }
  }

  /**
   * Schedule a single send project update
   * @param {string} singleSendId
   * @returns {object}
   */
  async scheduleSingleSendProjectUpdate(singleSendId: string) {
    const request = {
      url: `/v3/marketing/singlesends/${singleSendId}/schedule`,
      method: <HttpMethod>'PUT',
      body: {
        send_at: "now"
      },
    };

    // https://www.twilio.com/docs/sendgrid/api-reference/single-sends/schedule-single-send
    try {
      const singleSend = await this.client.request(request);
      // return { isError: false, ...singleSend };
      return { isError: false, code: singleSend[0].statusCode, ...singleSend };
    } catch (error) {
      Sentry.captureException({during: "scheduleSingleSendProjectUpdate", ...error})
      return { isError: true, ...error };
    }
  }
}
