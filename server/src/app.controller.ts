import { Controller } from "@nestjs/common";
import {
  Get,
  Query,
  Res,
  Session,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Serializer } from "jsonapi-serializer";

import { AuthService } from "./auth/auth.service";
import { ContactService } from "./contact/contact.service";

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly contactService: ContactService
  ) {}

  @Get("/")
  root() {
    return {};
  }

  @Get("/login")
  async login(
    @Query("code") code: string,
    @Query("codeVerifier") codeVerifier: string,
    @Query("redirectUri") redirectUri: string,
    @Res() res
  ) {
    try {
      const {
        ZAPToken,
        idTokenClaims
      } = await this.authService.generateNewTokenFromCode(
        code,
        codeVerifier,
        redirectUri
      );
      const { email, sub, given_name, family_name } = idTokenClaims;
      
      res.status(HttpStatus.OK).json({
        access_token: ZAPToken,
        nycid: { email, sub, given_name, family_name }
      });
    } catch (e) {
      console.log("ERROR GENERATING TOKEN", e);
      if (e instanceof HttpException) {
        res.status(e.getStatus()).send({ errors: [e] });
      } else {
        res.status(500).send({ errors: [e] });
      }
    }
  }

  @Get("/users")
  async getUser(@Session() session, @Res() res) {
    const { contactid } = session;

    const contact = await this.contactService.findOne(contactid);

    if (!contactid) {
      res.status(401).send({
        errors: ["Authentication required for this route"]
      });
    } else {
      res.send(this.serialize(contact));
    }
  }

  // Serializes an array of objects into a JSON:API document
  serialize(records, opts?: object): Serializer {
    const UserSerializer = new Serializer("users", {
      attributes: ["contactid", "emailaddress1"],
      id: "contactid",
      meta: { ...opts }
    });

    return UserSerializer.serialize(records);
  }
}
