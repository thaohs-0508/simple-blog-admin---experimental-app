import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en', 'vi'];

function validateContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type');
  return (
    !contentType ||
    contentType.includes('application/json') ||
    contentType.includes('text/plain') ||
    contentType.includes('text/html')
  );
}

function getPreferredLocale(request: NextRequest): string {
  const languages = request.headers.get('Accept-Language');
  if (!languages) {
    return 'en';
  }

  const preferred = languages.split(',')[0].split(';')[0].split('-')[0];

  if (supportedLocales.includes(preferred)) {
    return preferred;
  }
  return 'en';
}

const protectedPaths = ['/dashboard/posts'];
const loginPath = '/auth/login';

export async function validateRequest(request: NextRequest) {
  return validateLocaleAndAuth(request);
}

async function validateLocaleAndAuth(
  request: NextRequest
): Promise<NextResponse> {
  if (request.headers.has('next-action')) {
    return NextResponse.next();
  }
  if (!validateContentType(request)) {
    return NextResponse.json(
      { error: 'Invalid Content-Type header' },
      { status: 400 }
    );
  }

  const { pathname } = request.nextUrl;

  const isLocaleInPathname = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const preferredLocale = getPreferredLocale(request);

  if (!isLocaleInPathname) {
    request.nextUrl.pathname = `/${preferredLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
  const currentLocale = pathname.split('/')[1];
  const pathnameWithoutLocale =
    pathname.replace(`/${currentLocale}`, '') || '/';

  // Get authentication token
  const token = await getToken({ req: request });

  const isProtected = protectedPaths.some((path) =>
    pathnameWithoutLocale.startsWith(path)
  );
  const isLoginPage = pathnameWithoutLocale === loginPath;

  if (isLoginPage && token) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/dashboard/posts`, request.url)
    );
  }

  if (isProtected) {
    if (!token) {
      const callbackUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(
        new URL(
          `/${currentLocale}${loginPath}?callbackUrl=${callbackUrl}`,
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|__NEXT_ACTIONS__|_next/static|_next/image|favicon.ico).*)',
  ],
};

export { validateRequest as proxy };
