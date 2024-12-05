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

  async validateUser(password: string): Promise<any> {
    if (`Basic ${this.password}` === password) {
      return true;
    }
    return false;
  }
}
