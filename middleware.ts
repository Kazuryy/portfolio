import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n/navigation";

export default createMiddleware({
  locales,
  defaultLocale: "fr",
});

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
