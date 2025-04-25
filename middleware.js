// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Récupération du token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Vérifier si l'utilisateur est connecté ou si c'est une route publique
  if (!token) {
    // Routes nécessitant une authentification
    const isAuthRoute = request.nextUrl.pathname.startsWith("/dashboard");

    if (isAuthRoute) {
      // Rediriger vers la page de connexion
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configuration des chemins à vérifier
export const config = {
  matcher: ["/dashboard/:path*"],
};
