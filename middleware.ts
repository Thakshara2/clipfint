import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/api/webhooks(.*)",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)"
];

const isPublic = createRouteMatcher(publicPaths);

export default clerkMiddleware((auth, req, evt) => {
  if (isPublic(req)) return;
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)"
  ]
}; 