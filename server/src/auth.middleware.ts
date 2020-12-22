import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

function proceedNoAuth(res, next) {
  res.clearCookie('token');
  next();
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    req.session = false;

    const { authorization = '' } = req.headers;
    const token = authorization.split(' ')[1];

    try {
      req.session = await this.authService.validateCurrentToken(token);

      next();
    } catch (e) {
      proceedNoAuth(res, next);
    }
  }
}
