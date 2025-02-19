/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createUser } from "@/lib/actions/user";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useEffect } from "react";
import { toast } from "sonner";

const AddUserToDb = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const addUser = async () => {
      try {
        const result = await createUser(
          user?.id as string,
          user?.primaryEmailAddress?.emailAddress as string,
          user?.firstName as string,
          user?.lastName as string,
          user?.imageUrl as string,
          "guest",
          moment().format("MM-DD-YYYY")
        );

        if (result?.data !== null) {
          toast(
            <p className="font-bold text-sm text-green-500">
              User added successfully
            </p>
          );
        }
      } catch {
        toast(
          <p className="font-bold text-sm text-red-500">
            Internal error occured while creating the user
          </p>
        );
      }
    };

    addUser();
  }, [user, createUser]);

  return null;
};

export default AddUserToDb;
