import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ListservAuthService } from './listserv-auth.service';

@Injectable()
export class ListservAuthGuard implements CanActivate {
  constructor(
    private listservAuthService: ListservAuthService
  ) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.listservAuthService.validateUser(request.headers.authorization);
  }
}
