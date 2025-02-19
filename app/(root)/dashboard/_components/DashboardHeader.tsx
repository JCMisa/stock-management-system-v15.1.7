import AskRoleChangeDialog from "@/components/custom/AskRoleChangeDialog";
import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import React from "react";

const DashboardHeader = ({ user }: { user: UserType }) => {
  return (
    <header className="bg-light dark:bg-dark hidden md:block shadow-lg md:ml-32 lg:ml-64">
      <div className="flex flex-row items-center justify-between p-3 px-5">
        <div className="relative">
          <input
            className="appearance-none border-2 pl-10 border-light-100 dark:border-dark-100 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-[#0D0F10] focus:border-[#0D0F10] focus:shadow-outline bg-light-300 dark:bg-dark-100"
            id="username"
            type="text"
            placeholder="Search..."
          />

          <div className="absolute left-0 inset-y-0 flex items-center">
            <Search className="w-5 h-5 ml-3" />
          </div>
        </div>

        <div className="flex items-center gap-5">
          {Number(user?.roleChangeRequest) > 0 ? (
            <AskRoleChangeDialog defaultRole={user?.role} />
          ) : (
            <Button variant={"destructive"} size={"sm"} disabled aria-readonly>
              Out of Request
            </Button>
          )}
          <div className="relative flex flex-col">
            <div className="sm:flex gap-1 hidden">
              <div className="flex items-center gap-2">
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <div className="lg:flex flex-col items-start hidden">
                  <span className="tesm-sm capitalize">
                    {user?.firstname} {user?.lastname}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
