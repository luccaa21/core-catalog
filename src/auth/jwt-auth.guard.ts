import { CanActivate, ExecutionContext, Injectable, UnauthorizedException }
    from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwt: JwtService) { }

    canActivate(ctx: ExecutionContext): boolean {

        const req = ctx.switchToHttp().getRequest<any>();

        // libera preflight CORS
        const method = (req.method || '').toUpperCase();

        if (method === 'OPTIONS') return true;
        const url = String(req.originalUrl || req.url || '');

        // rotas públicas: login, cadastro e leitura do catálogo
        const isPublicAuth = url.startsWith('/auth/login') || url.startsWith('/auth/register');
        const isPublicCatalog =
            method === 'GET' && (url.startsWith('/components') || url.startsWith('/manufacturers'));

        if (isPublicAuth || isPublicCatalog) return true;

        // exige Authorization: Bearer <token>
        const auth = String(req.headers?.authorization || '');

        if (!auth.startsWith('Bearer ')) {
            throw new UnauthorizedException('Bearer token ausente');
        }

        const token = auth.slice(7).trim();
        try {
            req.user = this.jwt.verify(token); // valida assinatura/expiração
            return true;
        } catch {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
}