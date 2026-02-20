import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/pedagogico', '/saoleoemcine', '/login', '/acesso-negado'];

// Função para verificar se o pathname corresponde a alguma permissão
function hasPermission(pathname: string, permissions: string[]): boolean {
  return permissions.some(pattern => {
    // Se o pattern termina com /**, também deve dar match no caminho base
    // Ex: /admin/** deve dar match em /admin e /admin/users
    if (pattern.endsWith('/**')) {
      const basePath = pattern.slice(0, -3); // Remove o /**
      if (pathname === basePath || pathname.startsWith(basePath + '/')) {
        return true;
      }
    }
    
    // Substitui ** por .* e * por [^/]+ para regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]+');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite acesso às rotas públicas e suas subrotas
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verifica se o usuário está autenticado (token JWT no cookie)
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redireciona para login com o caminho original como parâmetro
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Chama a API do backend para obter as permissões do usuário
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/permissions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token inválido ou erro na API
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    const data = await response.json();
    const clientPermissions: string[] = data.clientPermissions || [];

    // Verifica se o usuário tem permissão para acessar a rota
    if (hasPermission(pathname, clientPermissions)) {
      return NextResponse.next();
    }

    // Usuário autenticado mas sem permissão - redireciona para página de acesso negado
    const url = request.nextUrl.clone();
    url.pathname = '/acesso-negado';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);

  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    // Em caso de erro, redireciona para login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
