import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/api/webhooks(.*)",
    "/pricing",
    "/sign-in",
    "/sign-up"
  ],
  ignoredRoutes: [
    "/api/webhooks(.*)"
  ]
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ]
}; 