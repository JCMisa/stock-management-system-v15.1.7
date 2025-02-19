"use server";

import { db } from "@/utils/db";
import { RoleChangeRequest, User } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { parseStringify } from "../utils";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getCurrentUser = async () => {
  try {
    const userFromClerk = await currentUser();
    if (!userFromClerk) return parseStringify({ data: null });
    const userFromDb = await db
      .select()
      .from(User)
      .where(
        eq(
          User.email,
          userFromClerk?.primaryEmailAddress?.emailAddress as string
        )
      );
    if (userFromDb?.length > 0) {
      return parseStringify({ data: userFromDb[0] });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getAllUser = async () => {
  try {
    const data = await db.select().from(User);

    if (data.length > 0) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const data = await db.select().from(User).where(eq(User.userId, userId));

    if (data.length > 0) {
      return parseStringify({ data: data[0] });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getUserByEmail = async (userEmail: string) => {
  try {
    const data = await db.select().from(User).where(eq(User.email, userEmail));

    if (data.length > 0) {
      return parseStringify({ data: data[0] });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getAllDoctors = async () => {
  try {
    const data = await db.select().from(User).where(eq(User.role, "doctor"));
    if (data?.length > 0) return parseStringify({ data: data });
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const createUser = async (
  userId: string,
  email: string,
  firstname: string,
  lastname: string,
  imageUrl: string,
  role: string,
  createdAt: string
) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser?.data === null) {
      // proceed on adding the user
      const data = await db.insert(User).values({
        userId: userId,
        email: email,
        firstname: firstname,
        lastname: lastname,
        imageUrl: imageUrl,
        role: role,
        createdAt: createdAt,
      });

      // if successful creation
      if (data) {
        return parseStringify({ data: data });
      }
      // if creation failed
      return parseStringify({ data: null });
    }
    // if user already exists
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const createUserInfo = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  userId: string,
  form: {
    firstname: string;
    lastname: string;
    email: string;
    dateOfBirth: string;
    age: string;
    contact: string;
    address: string;
    bio: string;
    gender: string;
    role: string;
  },
  imageUrl: string,
  createdAt: string
) => {
  try {
    const data = await db.insert(User).values({
      userId: userId,
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      dateOfBirth: form.dateOfBirth,
      age: Number(form.age) || 0,
      contact: form.contact,
      address: form.address,
      bio: form.bio,
      gender: form.gender,
      role: form.role,
      imageUrl: imageUrl,
      createdAt: createdAt,
    });

    // if successful creation
    if (data) {
      revalidatePath("/dashboard/manage/users");
      return parseStringify({ data: data });
    }
    // if creation failed
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const updateUserAvatar = async (userId: string, downloadUrl: string) => {
  try {
    const existingUser = await getUserById(userId);
    if (existingUser?.data !== null) {
      const data = await db
        .update(User)
        .set({
          imageUrl: downloadUrl,
        })
        .where(eq(User.userId, userId));

      if (data) {
        return parseStringify({ data: data });
      }
      return parseStringify({ data: null });
    }
  } catch (error) {
    handleError(error);
  }
};

export const updateUserInfo = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  userId: string,
  form: {
    firstname: string;
    lastname: string;
    email: string;
    dateOfBirth: string;
    age: string;
    contact: string;
    address: string;
    bio: string;
    gender: string;
    role: string;
  }
) => {
  try {
    const {
      firstname,
      lastname,
      email,
      dateOfBirth,
      age,
      contact,
      address,
      bio,
      gender,
      role,
    } = form;

    const result = await db
      .update(User)
      .set({
        firstname: firstname,
        lastname: lastname,
        email: email,
        dateOfBirth: dateOfBirth,
        age: Number(age) || 0,
        contact: contact,
        address: address,
        bio: bio,
        gender: gender,
        role: role,
      })
      .where(eq(User.userId, userId));

    if (result) {
      return parseStringify({ data: result });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const updateUserRoleChangeRequestCount = async (
  userId: string,
  requestCount: number
) => {
  try {
    const data = await db
      .update(User)
      .set({
        roleChangeRequest: requestCount,
      })
      .where(eq(User.userId, userId));

    if (data) {
      revalidatePath("/dashboard/manage/users");
      return parseStringify({ data: "success" });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const updateUserRole = async (
  requestId: string,
  userEmail: string,
  updatedRole: string
) => {
  try {
    const data = await db
      .update(User)
      .set({
        role: updatedRole,
      })
      .where(eq(User.email, userEmail));

    if (data) {
      const updateRequestStatus = await db
        .update(RoleChangeRequest)
        .set({
          status: "approved",
        })
        .where(eq(RoleChangeRequest.roleChangeRequestId, requestId));

      if (updateRequestStatus) {
        revalidatePath("/dashboard/manage/roleChange");
        return parseStringify({ data: "success" });
      }
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const data = await db.delete(User).where(eq(User.userId, userId));

    if (data) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: unknown) => {
  console.log("Internal error: ", error);
  return parseStringify({ data: null });
};
