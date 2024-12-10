import { Injectable } from "@nestjs/common";
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
   * Fetch the segment id for the correct environment and community district
   * @param {string} name - Sendgrid segment name
   * @returns {object}
   */
  async getSegmentId(name: string) {
    const request = {
      url: `/v3/marketing/segments/2.0`,
      method: <HttpMethod>'GET',
    };

    // https://www.twilio.com/docs/sendgrid/api-reference/segmenting-contacts-v2/get-list-of-segments
    try {
      const segments = await this.client.request(request);
      const segmentId = segments["0"]["body"]["results"].find((el) => el.name === name).id;
      return { isError: false, code: segments[0].statusCode, segmentId };
    } catch (error) {
      Sentry.captureException({during: "getSegmentId", ...error})
      return { isError: true, ...error };
    }
  }
  
  /**
   * Create the email to send out a project update
   * @param {string} id - ZAP Project ID
   * @param {string} emailHtml
   * @returns {object}
   */
  async createSingleSendProjectUpdate(id: string, emailHtml: string, segmentId: string) {
    const data = {
      name: "Single Send Test 2024-12-10 v3",
      send_to: {
        segment_ids: [segmentId]
      },
      email_config: {
        subject: "Single Send Test 2024-12-10 v3",
        html_content: emailHtml,
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

  /**
   * Create the email html
   * @param {string} domain
   * @param {string} id
   * @param {string} name
   * @param {string} borocd
   * @param {string} status
   * @param {string} date
   * @param {string} additionalpublicinformation
   * @param {string} dcpIsApplicant
   * @param {boolean} spansMoreThanOneCD
   * @returns {object}
   */
  createProjectUpdateContent({domain, id, name, borocd, status, date, additionalpublicinformation, dcpIsApplicant, spansMoreThanOneCD}) {
    var htmlContent = `
   <!DOCTYPE html>
    <head>
      <title></title>
    </head>
    <body>
      <div style="font-family: 'Helvetica Neue'; color: #3E4451;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <!-- Header Start -->
          <tr style="width: 100%; max-width: 100vw; min-height: 69px;">
            <td valign="top" align="left">
              <div style="width: 100%; min-height: 69px;background: #F1F2F4; vertical-align: middle;" align="center">
                <!-- Outlook ignores width with "min" completely, necessitating setting the width twice -->
                <div style="width: 600px; width: min(600px, 100%); max-width: 100%; height: 33px; display: inline-block;" >
                  <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" height="33">
                    <tr>
                      <td>
                        <table>
                          <tr>
                            <td style="padding: 18px 0;">
                              <img
                                src="https://raw.githubusercontent.com/NYCPlanning/logo/master/dcp_logo_772.png"
                                alt="NYC Planning" height="33"
                                style="display: block; border: none;"
                              >
                            </td>
                            <td style="font-size: 0.85rem; font-weight: 500; padding-left: 1rem; text-wrap: nowrap;">
                              Department of<br />
                              City Planning
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td style="font-size: calc(1vw + 1vh); font-weight: 700; vertical-align: middle; text-align: right;">
                        Zoning Application Portal
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>
          <!-- Header End -->
          <!-- Spacer -->
          <tr style="height: 3rem"></tr>
          <!-- Spacer End -->
          <tr style="width: 100%;">
            <td valign="top" align="left">
              <div style="width: 100%;" align="center">
                <!-- Outlook ignores width with "min" completely, necessitating setting the width twice -->
                <div style="width: 600px; width: min(600px, 100%); max-width: 100%;">
                  <div style="background: #FBF0E9; width: 90%; border-radius: 2rem; padding: 1rem;" align="left">
                    <p style="font-size: 1.75rem; font-weight: 700;">
                      ZAP Update
                    </p>
                    <div class="content-body" style="width: 100%;">
                      <p>
                        <a href="https://${domain}/projects/${id}" target="_blank" rel="noreferrer" style="color: #AE551D;">${name}</a>${spansMoreThanOneCD ? "*" : ""}
                        in ${borocd}
    `;

    if (status === "Filed") {
      htmlContent += " was <strong>filed</strong>";
    } else if (status === "In Public Review") {
      htmlContent += " went into <strong>public review</strong>";
    } else {
      htmlContent += " changed status";
    }
    htmlContent += ` on ${date}.`;

    if (dcpIsApplicant && additionalpublicinformation) {
      htmlContent += `<p>New York City Department of City Planning is the applicant. <a href="${additionalpublicinformation}" target="_blank" rel="noreferrer" style="color: #3E4451;">Click here to learn more.</a></p> `
    }

    if (spansMoreThanOneCD) {
      htmlContent += `<p style="font-size: 0.85rem;">*Project spans more than one CD.</p>`
    }

    htmlContent += `
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <!-- Spacer -->
            <tr style="height: 6rem"></tr>
            <!-- Spacer End -->
            <tr style="width: 100%;">
              <td valign="top" align="center">
                <p style="margin-top: 2rem; font-size: 0.75rem;">Sent From New York City Department of City Planning</p>
                <p style="font-size: 0.75rem;">120 Broadway, 31st Floor, New York, NY 10271</p>
                <p style="font-size: 0.75rem;"><a href="https://${domain}/subscribers/{{${this.environment === "production" ? "zap_production_id" : "zap_staging_id"}}}" target="_blank" rel="noreferrer" style="color: #3E4451;">Modify Subscriptions</a></p>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    `
    
    return htmlContent;
  }

}
