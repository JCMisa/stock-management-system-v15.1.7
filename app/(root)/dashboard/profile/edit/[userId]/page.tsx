/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Input } from "@/components/ui/input";
import {
  deleteUser,
  getUserByEmail,
  getUserById,
  updateUserInfo,
} from "@/lib/actions/user";
import { useActionState, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UploadImage from "./_components/UploadImage";
import { toast } from "sonner";
import { LoaderCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoaderDialog from "@/components/custom/LoaderDialog";
import { formatDate } from "@/lib/utils";
import { matchAgeBirth, validateFormFields } from "@/lib/validations";

const EditProfilePage = ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { user } = useUser();
  const router = useRouter();

  // error states
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [currentUser, setCurrentUser] = useState<UserType>();
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [gender, setGender] = useState<string>(currentUser?.gender as string);
  const [role, setRole] = useState<string>(currentUser?.role as string);
  const [loading, setLoading] = useState(false);

  const getUserInfoById = async () => {
    const userId = (await params)?.userId;
    try {
      setLoading(true);
      const result = await getUserById(userId);
      if (result?.data !== null) {
        setCurrentUser(result?.data);
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">Failed to fetch user.</p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfoById();
  }, [params]);

  const getCurrentUserRole = async () => {
    try {
      setLoading(true);
      const result = await getUserByEmail(
        user?.primaryEmailAddress?.emailAddress as string
      );
      if (result?.data !== null) {
        setCurrentUserRole(result?.data.role);
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Failed to fetch user role.
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUserRole();
  }, [user]);

  const handleDelete = async () => {
    const userId = (await params)?.userId;
    try {
      setLoading(true);
      const result = await deleteUser(userId);
      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            User deleted successfully
          </p>
        );
        router.push("/dashboard");
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Failed to dalete the user.
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
    const userId = (await params)?.userId;
    try {
      const finalGender = gender || currentUser?.gender;
      const finalRole = role || currentUser?.role;
      const formField = {
        firstname: formData.get("firstname") as string,
        lastname: formData.get("lastname") as string,
        email: formData.get("email") as string,
        dateOfBirth:
          (formData.get("dateOfBirth") as string) ||
          (currentUser?.dateOfBirth as string),
        age: formData.get("age") as string,
        contact: formData.get("contact") as string,
        address: formData.get("address") as string,
        bio: formData.get("bio") as string,
        gender: finalGender as string,
        role: finalRole as string,
      };

      // ... validation starts here ...
      const { isValid, errors } = validateFormFields(formField);

      // Validation checks – for dateOfBirth and age matching
      if (
        matchAgeBirth(formField.dateOfBirth) !== parseInt(formField.age, 10)
      ) {
        errors.dateOfBirth = "Date of birth does not match the provided age";
        errors.age = "Age does not match the provided date of birth";
      }
      // ... validation ends here ...

      if (!isValid) {
        setFieldErrors(errors);
        console.log("Form has errors:", errors); // Log all errors to the console
        toast(
          <p className="font-bold text-xs text-red-500">
            Please correct the form errors.
          </p>
        );
        return null; // Stop execution if the form is invalid
      }

      const result = await updateUserInfo(prevState, userId, formField);

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            User information updated successfully
          </p>
        );

        router.push(`/dashboard/profile/${userId}`);
      }

      return result?.data;
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Failed to update the user
        </p>
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, uploading] = useActionState(
    handleSubmit,
    undefined
  );

  return (
    <section className="py-24 px-24 my-auto bg-gradient-to-br from-light-100 to-light dark:from-dark-100 dark:to-dark rounded-lg">
      <form
        action={formAction}
        className="space-y-8 container m-auto divide-y divide-gray-800 dark:divide-gray-800"
      >
        {/* Display errors at the top */}
        {Object.entries(fieldErrors).length > 0 && ( // Only show errors if there are any
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-xs">
            {/* Styling for error box */}
            <ul className="list-disc pl-5">
              {/* Use a list for better formatting */}
              {Object.entries(fieldErrors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-8 divide-y divide-gray-800 dark:divide-gray-200">
          {/* profile image */}
          <div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="leading-6 font-medium text-dark dark:text-white text-3xl">
                  Profile
                </h3>
                <AlertDialog>
                  <AlertDialogTrigger className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-all cursor-pointer p-3 px-5 min-w-32 max-w-32 rounded-lg text-white">
                    {loading ? (
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Trash className="w-5 h-5" />
                        Delete
                      </>
                    )}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this account and remove related data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600 transition-all"
                        onClick={() => handleDelete()}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <UploadImage user={currentUser} />
              <span className="text-xs text-gray-400">
                Click the image to update your avatar.
              </span>
            </div>
          </div>

          {/* personal info */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-dark dark:text-white">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Use a permanent address where you can receive mail.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4 w-full mt-6">
                <div className="w-full">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-[#76828D]"
                    >
                      First name
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        name="firstname"
                        id="firstname"
                        defaultValue={currentUser?.firstname}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-[#76828D]"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      name="lastname"
                      id="lastname"
                      defaultValue={currentUser?.lastname}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 w-full mt-6">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#76828D]"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={currentUser?.email}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-[#76828D] mb-2">
                    Date Of Birth
                  </label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    placeholder="Month-Day-Year"
                    defaultValue={formatDate(
                      currentUser?.dateOfBirth as string
                    )}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(currentUser?.dateOfBirth as string)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 w-full mt-6">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#76828D]"
                  >
                    Age
                  </label>
                  <div className="mt-1">
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      defaultValue={currentUser?.age}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-[#76828D] mb-2">
                    Gender
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setGender(value ? value : (currentUser?.gender as string))
                    }
                    value={currentUser?.gender}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"male"}>Male</SelectItem>
                      <SelectItem value={"female"}>Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* contact info */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-dark dark:text-white">
                Contact Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Use a permanent contact and address where you can be contacted.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 w-full mt-6">
              <div className="w-full">
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-[#76828D]"
                >
                  Contact
                </label>
                <div className="mt-1">
                  <Input
                    id="contact"
                    name="contact"
                    type="text"
                    defaultValue={currentUser?.contact}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="street-address"
                  className="block text-sm font-medium text-[#76828D]"
                >
                  Address
                </label>
                <div className="mt-2">
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    defaultValue={currentUser?.address}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* manage user bio */}
        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-dark dark:text-white">
              Manage Bio
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Provide short and simple bio that best describes you.
            </p>
          </div>
          <div className="w-full mt-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-[#76828D]"
            >
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              rows={5}
              defaultValue={currentUser?.bio}
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* manage role for admin access only */}
        {currentUserRole === "admin" && (
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-dark dark:text-white">
                Manage Role
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage the user&apos;s role and let them access necessary
                features.
              </p>
            </div>

            <div className="w-full mt-6">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-[#76828D]"
              >
                User Role
              </label>
              <div className="mt-1">
                <Select
                  onValueChange={(value) =>
                    setRole(value ? value : (currentUser?.role as string))
                  }
                  value={currentUser?.role}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"admin"}>Admin</SelectItem>
                    <SelectItem value={"doctor"}>Doctor</SelectItem>
                    <SelectItem value={"receptionist"}>Receptionist</SelectItem>
                    <SelectItem value={"pharmacist"}>Pharmacist</SelectItem>
                    <SelectItem value={"guest"}>Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="pt-5">
          <div className="flex justify-end items-center gap-4">
            <Button
              type="button"
              variant={"outline"}
              className="min-w-32 max-w-32"
            >
              <Link href={`/dashboard/profile/${currentUser?.userId}`}>
                Cancel
              </Link>
            </Button>
            <Button
              type="submit"
              className="min-w-32 max-w-32"
              disabled={uploading}
            >
              {uploading ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </form>

      <LoaderDialog loading={loading || uploading} />
    </section>
  );
};

export default EditProfilePage;
