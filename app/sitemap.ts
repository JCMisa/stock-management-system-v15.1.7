import { getAllUser } from "@/lib/actions/user";
import { MetadataRoute } from "next";

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_BASE_URL_PROD;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const userList = await getAllUser();
  const userListEntries: MetadataRoute.Sitemap = userList?.data.map(
    (user: UserType) => ({
      url: `${baseURL}/dashboard/profile/${user.userId}`,
      lastModified: new Date(user.createdAt),
      // changeFrequency: ,
      // priority:
    })
  );

  return [
    // landing page
    {
      url: `${baseURL}`,
      lastModified: new Date(),
    },
    // dashboard
    {
      url: `${baseURL}/dashboard`,
    },
    // dynamic profile page
    ...userListEntries,
  ];
}
