import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth/auth.service';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    let authService: AuthService;
    expect(new AuthMiddleware(authService)).toBeDefined();
  });
});
