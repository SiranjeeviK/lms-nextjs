import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Since Core 2 version of clerk, it made all routes public by default

// This matcher will match any route that starts with /sign-in or /sign-up (these are public routes)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing", // for uploading images
  "/api/webhook", // for stripe webhook
]);

// This middleware will run for all routes except the public routes and make sure the user is authenticated
export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect(); // This will redirect the user to the login page if they are not authenticated
    }
  },
  {
    // debug: true, // This will log all the requests and responses to the console
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
