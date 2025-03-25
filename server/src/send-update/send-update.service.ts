import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { Client } from "@sendgrid/client";
import { MailService } from "@sendgrid/mail";
import * as Sentry from "@sentry/nestjs";
import moment from 'moment';

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
    const date = Date();
    const formattedDate = moment(date).format('MM-DD-YYYY');
    const data = {
      name: `ZAP Update ${formattedDate} - Status Change`,
      send_to: {
        segment_ids: [segmentId]
      },
      email_config: {
        subject: `ZAP Update ${formattedDate} - Status Change`,
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
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <meta charset="utf-8"> <!-- utf-8 works for most cases -->
          <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
          <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
          <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no"> <!-- Tell iOS not to automatically link certain text strings. -->
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->

          <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
          <!--[if gte mso 9]>
          <xml>
              <o:OfficeDocumentSettings>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->

          <!-- Web Font / @font-face : BEGIN -->
          <!-- NOTE: If web fonts are not required, lines 23 - 41 can be safely removed. -->

          <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
          <!--[if mso]>
              <style>
                  * {
                      font-family: sans-serif !important;
                  }
              </style>
          <![endif]-->

          <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: https://web.archive.org/web/20190717120616/http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
          <!--[if !mso]><!-->
          <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
          <!--<![endif]-->

          <!-- Web Font / @font-face : END -->

          <!-- CSS Reset : BEGIN -->
          <style>

              /* What it does: Tells the email client that both light and dark styles are provided. A duplicate of meta color-scheme meta tag above. */
              :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
              }
              
              /* What it does: Remove spaces around the email design added by some email clients. */
              /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
              html,
              body {
                  margin: 0 auto !important;
                  padding: 0 !important;
                  height: 100% !important;
                  width: 100% !important;
                  font-family: 'Helvetica Neue', Helvetica, sans-serif !important;
              }

              /* What it does: Stops email clients resizing small text. */
              * {
                  -ms-text-size-adjust: 100%;
                  -webkit-text-size-adjust: 100%;
              }

              /* What it does: Centers email on Android 4.4 */
              div[style*="margin: 16px 0"] {
                  margin: 0 !important;
              }

              /* What it does: forces Samsung Android mail clients to use the entire viewport */
              #MessageViewBody, #MessageWebViewDiv{
                  width: 100% !important;
              }

              /* What it does: Stops Outlook from adding extra spacing to tables. */
              table,
              td {
                  mso-table-lspace: 0pt !important;
                  mso-table-rspace: 0pt !important;
              }

              /* What it does: Fixes webkit padding issue. */
              table {
                  border-spacing: 0 !important;
                  border-collapse: collapse !important;
                  table-layout: fixed !important;
                  margin: 0 auto !important;
              }

              /* What it does: Uses a better rendering method when resizing images in IE. */
              img {
                  -ms-interpolation-mode:bicubic;
              }

              /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
              a {
                  text-decoration: none;
              }

              /* What it does: A work-around for email clients meddling in triggered links. */
              a[x-apple-data-detectors],  /* iOS */
              .unstyle-auto-detected-links a,
              .aBn {
                  border-bottom: 0 !important;
                  cursor: default !important;
                  color: inherit !important;
                  text-decoration: none !important;
                  font-size: inherit !important;
                  font-family: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
              }

              /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
              .a6S {
                  display: none !important;
                  opacity: 0.01 !important;
              }

              /* What it does: Prevents Gmail from changing the text color in conversation threads. */
              .im {
                  color: inherit !important;
              }

              /* If the above doesn't work, add a .g-img class to any image in question. */
              img.g-img + div {
                  display: none !important;
              }

              /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
              /* Create one of these media queries for each additional viewport size you'd like to fix */

              /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
              @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                  u ~ div .email-container {
                      min-width: 320px !important;
                  }
              }
              /* iPhone 6, 6S, 7, 8, and X */
              @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                  u ~ div .email-container {
                      min-width: 375px !important;
                  }
              }
              /* iPhone 6+, 7+, and 8+ */
              @media only screen and (min-device-width: 414px) {
                  u ~ div .email-container {
                      min-width: 414px !important;
                  }
              }

          </style>
          <!-- CSS Reset : END -->

          <!-- Progressive Enhancements : BEGIN -->
          <style>

            /* What it does: Hover styles for buttons */
            .button-td,
            .button-a {
                transition: all 100ms ease-in;
            }
            .button-td-primary:hover,
            .button-a-primary:hover {
                background: #90471a !important;
                border-color: #90471a !important;
            }

            /* Media Queries */
            @media screen and (max-width: 600px) {

                /* What it does: Adjust typography on small screens to improve readability */
                .email-container p {
                    font-size: 17px !important;
                }

                  /* What it does: Adds padding on mobile so header image and text are not against edge */
                  .dcp-header {
                      padding: 0 10px;
                  }

            }

              /* Dark Mode Styles : BEGIN */
              @media (prefers-color-scheme: dark) {
            .email-bg {
              background: #FFF !important;
            }
                  .darkmode-bg {
                      background: #FFF !important;
                  }
          }
              /* Dark Mode Styles : END */
          </style>
          <!-- Progressive Enhancements : END -->

      </head>
      <!--
        The email background color (#FFFFFF) is defined in three places:
        1. body tag: for most email clients
        2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr
        3. mso conditional: For Windows 10 Mail
      -->
      <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; font-family: 'Helvetica Neue'; color: #3E4451;" class="email-bg">
        <center role="article" aria-roledescription="email" lang="en" style="width: 100%;" class="email-bg">
          <!--[if mso | IE]>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF;" class="email-bg">
          <tr>
          <td>
          <![endif]-->

              <!-- Visually Hidden Preheader Text : BEGIN -->
              <div style="max-height:0; overflow:hidden; mso-hide:all;" aria-hidden="true">
                ${name}${spansMoreThanOneCD ? "*" : ""} in ${borocd}
    `

    if (status === "Filed") {
      htmlContent += " was filed";
    } else if (status === "In Public Review") {
      htmlContent += " went into public review";
    } else {
      htmlContent += " changed status";
    }
    htmlContent += ` on ${date}.`;

    if (dcpIsApplicant && additionalpublicinformation) {
      htmlContent += ` New York City Department of City Planning is the applicant.`
    }

    if (spansMoreThanOneCD) {
      htmlContent += ` *Project spans more than one CD.`
    }
    
    htmlContent += `
    </div>
        <!-- Visually Hidden Preheader Text : END -->

        <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->
        <!-- Preview Text Spacing Hack : BEGIN -->
        <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
	        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        </div>
        <!-- Preview Text Spacing Hack : END -->


        <!-- Full Bleed Background Section : BEGIN -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F1F2F4;" class="darkmode-fullbleed-bg">
            <tr>
                <td>
                    <div align="center" style="max-width: 600px; margin: auto;" class="email-container">
                        <!--[if mso]>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                        <tr>
                        <td>
                        <![endif]-->

                        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600" style="width: 600px; max-width: 600px; min-height: 33px; vertical-align: middle; display: inline-block;" class="dcp-header">
                            <tr>
                                <td>
                                    <table>
                                        <tr>
                                            <td style="padding: 18px 0;">
                                                <img
                                                    src="https://raw.githubusercontent.com/NYCPlanning/logo/master/dcp_logo_772.png"
                                                    alt="NYC Planning Logo" height="33" width="68"
                                                    style="display: block; border: none; width: auto; margin: auto; height: 33px; width: 68px;"
                                                >
                                            </td>
                                            <td style="font-size: 0.85rem; font-weight: 500; padding-left: 16px; text-wrap: nowrap; width: 120px; min-width: 120px;" width="120">
                                                Department of<br />
                                                City Planning
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td style="font-size: calc(1vw + 1vh); font-weight: 700; vertical-align: middle; text-align: right; width: 396px;">
                                    Zoning Application Portal
                                </td>
                            </tr>
                        </table>

                        <!--[if mso]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                    </div>
                </td>
            </tr>
        </table>
        <!-- Full Bleed Background Section : END -->


        <!--
            Set the email width. Defined in two places:
            1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.
            2. MSO tags for Desktop Windows Outlook enforce a 600px width.
        -->
        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
            <!--[if mso]>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
            <tr>
            <td>
            <![endif]-->

	        <!-- Email Body : BEGIN -->
	        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
		        <!-- Email Spacer : BEGIN -->
	            <tr>
	                <td style="padding: 20px 0; text-align: center"></td>
	            </tr>
		        <!-- Email Spacer : END -->

                <!-- 1 Column Text : BEGIN -->
                <tr>
                    <td style="background-color: #ffffff;" class="darkmode-bg">

                    <!-- Outlook on Windows ignores border radius, so we use something similar to an svg to draw it -->
                    <!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:240px;width:600px;" arcsize="25%" stroke="f" fillcolor="#FBF0E9">
                    <![endif]-->

                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-radius: 40px;background: #FBF0E9;">
                            <tr>
                                <td style="padding: 20px; font-size: 15px; line-height: 20px;">
                                    <h1 style="margin: 28px 0 28px 0; font-size: 28px; line-height: 30px; font-weight: 700;">ZAP Update</h1>
                                    <p style="margin: 13px 0 13px 0;"><a href="https://${domain}/projects/${id}" rel="noreferrer" style="color:#ae551d; text-decoration: underline;" target="_blank">${name}</a>${spansMoreThanOneCD ? "*" : ""} in ${borocd}
    `
    if (status === "Filed") {
      htmlContent += " was <strong>filed</strong>";
    } else if (status === "In Public Review") {
      htmlContent += " went into <strong>public review</strong>";
    } else {
      htmlContent += " changed status";
    }
    htmlContent += ` on ${date}.</p>`;

    if (dcpIsApplicant && additionalpublicinformation) {
      htmlContent += `<p>New York City Department of City Planning is the applicant. <a href="${additionalpublicinformation}" target="_blank" rel="noreferrer" style="color: #3E4451;">Click here to learn more.</a></p> `
    }

    if (spansMoreThanOneCD) {
      htmlContent += `<p style="font-size: 0.85rem;">*Project spans more than one CD.</p>`
    }

    htmlContent += `
                                  </td>
                                </tr>
                            </table>

                        <!--[if mso]>
                            <br />
                            <br />
                            </v:roundrect>
                        <![endif]-->

                        </td>
                    </tr>
                    <!-- 1 Column Text : END -->

                    <!-- Clear Spacer : BEGIN -->
                    <tr>
                        <td aria-hidden="true" height="40" style="font-size: 0px; line-height: 0px;">
                            &nbsp;
                        </td>
                    </tr>
                    <!-- Clear Spacer : END -->

                </table>
                <!-- Email Body : END -->

                <!-- Email Footer : BEGIN -->
              <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;" class="footer">
                    <!-- Spacer -->
                    <tr style="height: 6rem"></tr>
                    <!-- Spacer End -->
                    <tr style="width: 100%;">
                    <td valign="top" align="center">
                        <p style="margin-top: 2rem; font-size: 0.75rem;">Sent From New York City Department of City Planning</p>
                        <p style="font-size: 0.75rem;">120 Broadway, 31st Floor, New York, NY 10271</p>
                        <p style="font-size: 0.75rem;"><a href="https://${domain}/subscribers/{{${this.environment === "production" ? "zap_production_id" : "zap_staging_id"}}}" target="_blank" rel="noreferrer" style="color: #3E4451; text-decoration: underline;">Modify Subscriptions</a></p>
                        <p style="font-size: 0.75rem;">Have suggestions for ZAP Alerts? Contact us at <a style="color: #AE551D; text-decoration: underline;" href="mailto:tech@planning.nyc.gov?subject=ZAP Alerts">tech@planning.nyc.gov</a></p>
                    </td>
                    </tr>
                </table>
                <!-- Email Footer : END -->

                <!--[if mso]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </div>

        <!--[if mso | IE]>
        </td>
        </tr>
        </table>
        <![endif]-->
        </center>
    </body>
    </html>
    `




    return htmlContent;
  }

}
