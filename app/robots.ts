import { MetadataRoute } from "next";

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_BASE_URL_PROD;

export default function robots(): MetadataRoute.Robots {
  // Ensure baseURL is defined
  if (!baseURL) {
    throw new Error("BASE_URL environment variable is not defined");
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/manage", "/dashboard/inventory"],
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
