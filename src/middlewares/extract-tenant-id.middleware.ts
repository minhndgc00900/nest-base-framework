import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class ExtractTenantIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    const authHeaders = req.headers.authorization;

    if (authHeaders) {
      const token = (authHeaders as string).split(' ')[1];
      const jwtService = new JwtService();
      const decoded = jwtService.decode(token);

      if (decoded['tenantId']) {
        req.tenantId = decoded['tenantId'];
      }
    }

    next();
  }
}
