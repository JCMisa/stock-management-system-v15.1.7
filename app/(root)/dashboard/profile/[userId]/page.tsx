import { getAllUser, getCurrentUser, getUserById } from "@/lib/actions/user";
import { SignOutButton } from "@clerk/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

const getUser = cache(async (userId: string) => {
  const user = await getUserById(userId as string);
  return user;
});

// for caching a dynamic route to make page loading faster
export async function generateStaticParams() {
  const userList = await getAllUser();

  if (!Array.isArray(userList?.data)) {
    return [];
  }

  return userList.data.map((userId: string) => userId).slice(0, 5);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const userId = (await params)?.userId;
  const userFromProps = await getUser(userId as string);

  const baseURL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_BASE_URL_DEV
      : process.env.NEXT_PUBLIC_BASE_URL_PROD;
  if (!baseURL) {
    throw new Error("Base URL is not defined in environment variables.");
  }

  const firstName = userFromProps?.data?.firstname;
  const lastName = userFromProps?.data?.lastname;
  const descriptionBio = userFromProps?.data?.bio;
  const imageUrl = userFromProps?.data?.imageUrl || "/empty-img.png";

  return {
    metadataBase: new URL(baseURL),
    title: `${firstName} ${lastName}`,
    description: descriptionBio,
    openGraph: {
      title: `RHU - ${firstName} ${lastName}`,
      description: descriptionBio,
      images: [
        {
          url: imageUrl,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@jcmisa_dev`,
      title: `RHU - ${firstName} ${lastName}`,
      description: descriptionBio,
      images: [
        {
          url: imageUrl,
        },
      ],
    },
  };
}

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const userId = (await params)?.userId;

  const userFromProps = await getUser(userId as string);

  if (userFromProps?.data === null) notFound();

  const currentUser = await getCurrentUser();

  return (
    <div className="bg-gradient-to-r from-light to-light-100 dark:from-dark dark:to-dark-100 min-h-screen flex items-center justify-center p-4 rounded-lg">
      <div className="bg-gradient-to-r from-light dark:from-dark to-primary dark:to-primary-100 rounded-xl shadow-2xl max-w-4xl w-full p-8 transition-all duration-300 animate-fade-in">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            {userFromProps ? (
              <Image
                src={userFromProps?.data?.imageUrl as string}
                loading="lazy"
                placeholder="blur"
                blurDataURL="/blur.jpg"
                alt="Profile Picture"
                className="rounded-full w-48 h-48 mx-auto mb-4 shadow-lg from-primary to-secondary transition-transform duration-300 hover:scale-105"
                width={1000}
                height={1000}
              />
            ) : (
              <Image
                src="empty-img.png"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/blur.jpg"
                alt="Profile Picture"
                className="rounded-full w-48 h-48 mx-auto mb-4 shadow-lg from-primary to-secondary transition-transform duration-300 hover:scale-105"
                width={1000}
                height={1000}
              />
            )}

            <h1 className="text-2xl font-bold text-primary mb-2 capitalize">
              {userFromProps?.data?.firstname || "unknown"}{" "}
              {userFromProps?.data?.lastname || "unknown"}
            </h1>
            <p className="text-gray-500 dark:text-gray-300 capitalize mb-4">
              {userFromProps?.data?.role || ""}
            </p>
            {(currentUser?.data?.userId === userId ||
              currentUser?.data?.role === "admin") && (
              <div className="flex flex-col gap-1">
                <Link
                  href={`/dashboard/profile/edit/${userId}`}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
                >
                  Edit Profile
                </Link>
                <SignOutButton>
                  <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300">
                    Sign out
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">
              <p className="text-primary text-xs">About Me</p>
              {userFromProps?.data?.bio ? (
                <p className="mb-6 text-xs text-gray-400">
                  {userFromProps?.data?.bio}
                </p>
              ) : (
                <p className="text-xs text-dark dark:text-white mb-6">
                  No bio provided.
                </p>
              )}
            </h2>

            <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">
              Additonal Information
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center justify-start w-full gap-4">
                <div className="flex flex-col items-start gap-1">
                  <p className="text-gray-700 dark:text-gray-300 text-xs">
                    Age
                  </p>
                  <span className="bg-light dark:bg-dark text-primary px-3 py-1 rounded-full text-sm line-clamp-1 md:line-clamp-none overflow-hidden">
                    {userFromProps?.data?.age || "0"}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <p className="text-gray-700 dark:text-gray-300 text-xs">
                    Birth Date
                  </p>
                  <span className="bg-light dark:bg-dark text-primary px-3 py-1 rounded-full text-sm line-clamp-1 md:line-clamp-none overflow-hidden">
                    {userFromProps?.data?.dateOfBirth || "unknown"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-start w-full gap-4">
                <div className="flex flex-col items-start gap-1">
                  <p className="text-gray-700 dark:text-gray-300 text-xs">
                    Gender
                  </p>
                  <span className="bg-light dark:bg-dark text-primary px-3 py-1 rounded-full text-sm line-clamp-1 md:line-clamp-none overflow-hidden capitalize">
                    {userFromProps?.data?.gender || "neutral"}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <p className="text-gray-700 dark:text-gray-300 text-xs">
                    Joined At
                  </p>
                  <span className="bg-light dark:bg-dark text-primary px-3 py-1 rounded-full text-sm line-clamp-1 md:line-clamp-none overflow-hidden">
                    {userFromProps?.data?.createdAt || "unknown"}
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">
              Contact Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center line-clamp-1 md:line-clamp-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {userFromProps?.data?.email || "unknown@example.com"}
              </li>
              <li className="flex items-center line-clamp-1 md:line-clamp-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {userFromProps?.data?.contact || "09xxxxxxxxx"}
              </li>
              <li className="flex items-center line-clamp-1 md:line-clamp-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {userFromProps?.data?.address || "unknown"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
