import React, { useActionState, useState } from "react";
import { LoaderCircle, PlusCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { createUserInfo } from "@/lib/actions/user";
import { toast } from "sonner";
import LoaderDialog from "@/components/custom/LoaderDialog";
import { matchAgeBirth, validateFormFields } from "@/lib/validations";

const CreateUser = () => {
  // error states
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [gender, setGender] = useState<string>("male");
  const [role, setRole] = useState<string>("guest");

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const formField = {
        firstname: formData.get("firstname") as string,
        lastname: formData.get("lastname") as string,
        email: formData.get("email") as string,
        dateOfBirth: formData.get("dateOfBirth") as string,
        age: formData.get("age") as string,
        contact: formData.get("contact") as string,
        address: formData.get("address") as string,
        bio: formData.get("bio") as string,
        gender,
        role,
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

      // Only call createUserInfo if isValid is true
      const result = await createUserInfo(
        prevState,
        uuidv4(),
        formField,
        "/empty-img.png",
        moment().format("MM-DD-YYYY")
      );

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-xs text-green-500">
            User created successfully
          </p>
        );
      }

      return result?.data;
    } catch (error) {
      toast(
        <p className="font-bold text-xs text-red-500">
          Failed to create the user
        </p>
      );
      console.log("Add user info error: ", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, uploading] = useActionState(
    handleSubmit,
    undefined
  );

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> Add User
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="h-[80%] overflow-auto card-scroll">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New User</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              Create new user and assign necessary infomation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Separator />
            <form action={formAction} className="flex flex-col gap-5">
              {/* personal info */}
              <div className="pt-8">
                <div>
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

                  <h3 className="text-lg leading-6 font-medium text-dark dark:text-white">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Use a permanent address where you can receive mail.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-4 w-full mt-6">
                    <div className="w-full">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-xs font-medium text-[#76828D] w-full"
                        >
                          First name
                        </label>
                        <div className="mt-1">
                          <Input
                            required
                            type="text"
                            name="firstname"
                            id="firstname"
                            placeholder="Enter your first name"
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-xs border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="last-name"
                        className="block text-xs font-medium text-[#76828D]"
                      >
                        Last name
                      </label>
                      <div className="mt-1">
                        <Input
                          required
                          type="text"
                          name="lastname"
                          id="lastname"
                          placeholder="Enter your last name"
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-xs border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 w-full mt-6">
                    <div className="w-full">
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-[#76828D]"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <Input
                          required
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-xs border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-xs font-medium text-[#76828D] mb-2">
                        Date Of Birth
                      </label>
                      <Input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        placeholder="e.g. February-11-2004"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-xs border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 w-full mt-6">
                    <div className="w-full">
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-[#76828D]"
                      >
                        Age
                      </label>
                      <div className="mt-1">
                        <Input
                          required
                          id="age"
                          name="age"
                          type="number"
                          min={0}
                          max={150}
                          placeholder="Enter age here"
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-xs border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-xs font-medium text-[#76828D] mb-2">
                        Gender
                      </label>
                      <Select
                        required
                        onValueChange={(value) =>
                          setGender(value ? value : "male")
                        }
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

              <Separator />

              {/* contact info */}
              <div className="pt-8">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-dark dark:text-white">
                    Contact Information
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Use a permanent contact and address where you can be
                    contacted.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 w-full mt-6">
                  <div className="w-full">
                    <label
                      htmlFor="contact"
                      className="block text-xs font-medium text-[#76828D]"
                    >
                      Contact
                    </label>
                    <div className="mt-1">
                      <Input
                        required
                        id="contact"
                        name="contact"
                        type="text"
                        placeholder="Enter your contact number"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-xs border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="street-address"
                      className="block text-xs font-medium text-[#76828D]"
                    >
                      Address
                    </label>
                    <div className="mt-2">
                      <Input
                        required
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Enter you complete address"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-xs border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* manage user bio */}
              <div className="pt-8">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-dark dark:text-white">
                    Manage Bio
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Provide short and simple bio that best describes you.
                  </p>
                </div>
                <div className="w-full mt-6">
                  <label
                    htmlFor="role"
                    className="block text-xs font-medium text-[#76828D]"
                  >
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    placeholder="Tell me more about yourself"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-xs border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <Separator />

              {/* manage role for admin access only */}
              <div className="pt-8">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-dark dark:text-white">
                    Manage Role
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage the user&apos;s role and let them access necessary
                    features.
                  </p>
                </div>

                <div className="w-full mt-6">
                  <label
                    htmlFor="role"
                    className="block text-xs font-medium text-[#76828D]"
                  >
                    User Role
                  </label>
                  <div className="mt-1">
                    <Select
                      required
                      onValueChange={(value) =>
                        setRole(value ? value : "guest")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"admin"}>Admin</SelectItem>
                        <SelectItem value={"doctor"}>Doctor</SelectItem>
                        <SelectItem value={"receptionist"}>
                          Receptionist
                        </SelectItem>
                        <SelectItem value={"pharmacist"}>Pharmacist</SelectItem>
                        <SelectItem value={"guest"}>Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <AlertDialogFooter className="mt-5">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">
                  {uploading ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </AlertDialogFooter>
            </form>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <LoaderDialog loading={uploading} />
    </>
  );
};

export default CreateUser;
