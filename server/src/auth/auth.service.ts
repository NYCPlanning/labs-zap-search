import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { ConfigService } from '../config/config.service';
import { ContactService } from '../contact/contact.service';

/**
 * This class describes the central auth service. Two public methods are available.
 * This service is responsible for verifying and generating new tokens.
 *
 * @class      AuthService (name)
 */
@Injectable()
export class AuthService {
  // required env variables
  CRM_SIGNING_SECRET = '';
  NYCID_CONSOLE_PASSWORD = '';

  constructor(
    private readonly config: ConfigService,
    private readonly contactService: ContactService,
  ) {
    this.CRM_SIGNING_SECRET = this.config.get('CRM_SIGNING_SECRET');
    this.NYCID_CONSOLE_PASSWORD = this.config.get('NYCID_CONSOLE_PASSWORD');
  }

  /**
   * This method automates how authentication works in this app. It is intended for
   * debugging purposes. There are two kinds of JWTs in play in this application:
   * 
   *  - NYC.ID JWT
   *  - Our JWT
   * 
   * In order to login to this application, one must first be authenticated
   * through NYC.ID. Once authenticated, NYC.ID redirects you back to this
   * application with a JWT that includes your e-mail address. That is what
   * you are seeing on line 39: we are generating a mock NYC.ID JWT and signing
   * it with the NYCID_CONSOLE_PASSWORD as if you were authenticated via NYC.ID.
   * 
   * This method recreates the NYC.ID authentication step for use in local 
   * development. The intent is to enable local debugging that is closer to
   * how authentication actually works.
   * 
   * Once the cookie is printed in the terminal, you can copy that cookie and paste
   * it into headers of requests you're making. If you're looking at the API and
   * want it to persist, you can use the Chrome Inspector to add the token via the
   * Application tab.
   * 
   * See this PR for full discussion: https://github.com/NYCPlanning/zap-api/pull/74#discussion_r370749677.
   * 
   * @param      {<type>}  NYCIDToken  The nycid token
   */
  public async generateNewToken(NYCIDToken: string): Promise<string> {
    const { mail, exp } = this.verifyNYCIDToken(NYCIDToken);
    const { contactid } = await this.lookupContact(mail);

    return this.signNewToken(contactid, exp);
  }

  /**
   * Validates the current signed JWT generated by ZAP API.
   *
   * @param      {string}  token   The token
   */
  public validateCurrentToken(token: string) {
    return this.verifyCRMToken(token);
  }

  /**
   * Lookup a contact entity by email or, if present, a contact ID.
   * Throws an unauthorized error if a contact is not found
   *
   * @param      {string}  mail    An email account to be found in CRM
   */
  private async lookupContact(mail: string) {
    try {
      return this.contactService.findByEmail(mail);
    } catch (e) {
      throw new HttpException(`
        CRM user not found. Please make sure your e-mail is associated with an assignment.
      `, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Verifies a JWT with the NYCID signature. Returns the token object.
   *
   * @param      {string}  token   The token
   * @return     {object}     { mail: 'string', exp: 'string' }
   */
  private verifyNYCIDToken(token): any {
    const { NYCID_CONSOLE_PASSWORD } = this;

    return this.verifyToken(token, NYCID_CONSOLE_PASSWORD);
  }

  /**
   * Verifies a JWT with the CRM signing secret. Returns a token object.
   *
   * @param      {string}  token   The token
   * @return     {any}     { mail: 'string', exp: 'string' }
   */
  private verifyCRMToken(token): any {
    const { CRM_SIGNING_SECRET } = this;

    return this.verifyToken(token, CRM_SIGNING_SECRET);
  }

  /**
   * Generates a new ZAP API token, including the contact id
   *
   * @param      {string}  contactid  The CRM contactid
   * @param      {string}  exp        A string coercable to a Date
   */
  private signNewToken(
    contactid: string,
    exp: number = moment().add(1, 'days').unix(),
  ): string {
    const { CRM_SIGNING_SECRET } = this;

    return jwt.sign({ contactid, exp }, CRM_SIGNING_SECRET);
  }

  /**
   * Verifies a token given a JWT and a secret. Throws an error
   * if there is a problem verifying.
   *
   * @param      {string}  token   The token
   * @param      {string}  secret  The secret
   * @return     {string|object}  { Returns an object or string depending on the JWT }
   */
  private verifyToken(token, secret): string | {} {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      throw new HttpException(e, HttpStatus.UNAUTHORIZED);
    }
  }
}
