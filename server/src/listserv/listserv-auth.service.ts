import { Injectable } from '@nestjs/common';
import { ConfigService } from "../config/config.service";

@Injectable()
export class ListservAuthService {
  password = "";
  constructor(
    private readonly config: ConfigService,
  ) {
    this.password = this.config.get("LISTSERV_BASE64");
  }

  validateUser(password: string) {
    if (`Basic ${this.password}` === password) {
      return true;
    }
    return false;
  }
}
