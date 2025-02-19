/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Input } from "@/components/ui/input";
import React, { useActionState, useEffect, useState } from "react";
import UploadPatientImage from "./UploadPatientImage";
import { toast } from "sonner";
import {
  getPatientLayout,
  updatePatientInfoByReceptionistOrAdmin,
} from "@/lib/actions/patient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { IdentificationTypes } from "@/constants";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useRouter } from "next/navigation";
import { getAllDoctors, getCurrentUser } from "@/lib/actions/user";
import Image from "next/image";
import { addAppointment } from "@/lib/actions/appointment";
import { v4 as uuidv4 } from "uuid";
import "react-quill-new/dist/quill.snow.css";
import LoaderDialog from "@/components/custom/LoaderDialog";
import AllergiesInput from "./AllergiesInput";
import { validateFormFields } from "@/lib/validations";

const CreatePatientForm = ({
  patientId,
  mode,
}: {
  patientId: string;
  mode: string;
}) => {
  const router = useRouter();

  // error states
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [patientLayout, setPatientLayout] = useState<any>();
  const [doctorsList, setDoctorsList] = useState<UserType[]>([]);
  const [gender, setGender] = useState<string>(patientLayout?.gender);
  const [severity, setSeverity] = useState<string>(
    patientLayout?.conditionSeverity
  );
  const [identificationCardType, setIdentificationCardType] = useState<string>(
    patientLayout?.identificationCardType
  );
  const [doctorId, setDoctorId] = useState<string | null>(
    patientLayout?.doctorId || null
  );
  const [loading, setLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserType>();

  // for input with multiple values - start
  const [allergiesArray, setAllergiesArray] = useState<string[]>([]); // stringify or join this first before assigning in the database
  // for input with multiple values - end

  // get current user - start
  useEffect(() => {
    const getCurrentUserEffect = async () => {
      const user = await getCurrentUser();
      if (user?.data !== null) setCurrentUser(user.data);
    };

    getCurrentUserEffect();
  }, []);
  // get current user - end

  // to get all doctors in database - start
  const getDoctorsList = async () => {
    try {
      const result = await getAllDoctors();
      if (result?.data !== null) {
        setDoctorsList(result?.data);
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while fetching all doctors
        </p>
      );
    }
  };

  useEffect(() => {
    getDoctorsList();
  }, []);
  // to get all doctors in database - send

  const getPatient = async () => {
    try {
      setLoading(true);
      const result = await getPatientLayout(patientId);
      if (result?.data !== null) {
        setPatientLayout(result?.data);
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while fetching the patient
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPatient();
  }, [patientId]);

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const finalGender = gender || patientLayout?.gender;
      const finalIdentificationCardType =
        identificationCardType || patientLayout?.identificationCardType;
      const finalConditionSeverity =
        severity || patientLayout?.conditionSeverity;
      const finalDoctorId = doctorId || patientLayout?.doctorId;

      const formField = {
        doctorId: finalDoctorId as string,
        firstname: formData.get("firstname") as string,
        lastname: formData.get("lastname") as string,
        email: formData.get("email") as string,
        gender: finalGender as string,
        age: formData.get("age") as string,
        address: formData.get("address") as string,
        contact: formData.get("contact") as string,
        occupation: formData.get("occupation") as string,
        emergencyContactName: formData.get("emergencyContactName") as string,
        emergencyContactNumber: formData.get(
          "emergencyContactNumber"
        ) as string,
        insuranceProvider: formData.get("insuranceProvider") as string,
        insurancePolicyNumber: formData.get("insurancePolicyNumber") as string,
        identificationCardType: finalIdentificationCardType as string,
        identificationCardNumber: formData.get(
          "identificationCardNumber"
        ) as string,
        conditionName: formData.get("conditionName") as string,
        conditionDescription: formData.get("conditionDescription") as string,
        conditionSeverity: finalConditionSeverity as string,
        allergies: allergiesArray.join(", "),
        familyMedicalHistory: formData.get("familyMedicalHistory") as string,
        createdAt:
          mode === "create"
            ? (moment().format("MM-DD-YYYY") as string)
            : patientLayout?.createdAt,
        updatedAt: moment().format("MM-DD-YYYY") as string,
      };

      // ... validation starts here ...
      const { isValid, errors } = validateFormFields(formField);
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

      // add patient information
      const result = await updatePatientInfoByReceptionistOrAdmin(
        prevState,
        patientId,
        formField
      );

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Patient information updated successfully
          </p>
        );
        router.push("/dashboard/manage/patients");
      }

      // add patient to appointment table with their doctor
      if ((doctorId || patientLayout?.doctorId) && mode === "create") {
        const appointmentId = uuidv4();
        const result2 = await addAppointment(
          appointmentId,
          patientId,
          doctorId || patientLayout?.doctorId,
          formData.get("firstname") + " " + formData.get("lastname"),
          formData.get("conditionName") as string,
          formData.get("conditionDescription") as string,
          finalConditionSeverity as string,
          formData.get("familyMedicalHistory") as string,
          allergiesArray.join(", "),
          "pending",
          moment().format("MM-DD-YYYY")
        );

        if (result2?.data !== null) {
          toast(
            <p className="font-bold text-sm text-green-500">
              Patient appointment scheduled successfully
            </p>
          );
        }
      }
    } catch (error) {
      toast(
        <p className="text-sm font-bold text-red-500">
          Internal error occured while updating patient information
        </p>
      );
      console.log("update patient information error: ", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, uploading] = useActionState(
    handleSubmit,
    undefined
  );

  return (
    <>
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
      <form
        action={formAction}
        className="bg-light-100 dark:bg-dark-100 border border-t-primary rounded-lg flex flex-col gap-4 p-5"
      >
        {/* imageUrl- firstname - lastname - age - gender - address - occupation */}
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-2xl font-bold">
            Personal Information
          </h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex flex-col gap-1">
              <UploadPatientImage patient={patientLayout} />
              <p className="text-xs text-gray-500  dark:text-gray-400 -mt-6">
                Click the image to update patient profile image
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 w-full mt-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="firstname"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  First Name
                </label>
                <Input
                  type="text"
                  id="firstname"
                  name="firstname"
                  defaultValue={patientLayout?.firstname}
                  placeholder="Enter first name"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="firstname"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Last Name
                </label>
                <Input
                  type="text"
                  id="lastname"
                  name="lastname"
                  defaultValue={patientLayout?.lastname}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="age"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Age
                </label>
                <Input
                  type="number"
                  id="age"
                  name="age"
                  defaultValue={patientLayout?.age}
                  placeholder="Enter age"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="firstname"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Gender
                </label>
                <Select
                  onValueChange={(value) => setGender(value ? value : "male")}
                  defaultValue={patientLayout?.gender || gender}
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
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="address"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Address
                </label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={patientLayout?.address}
                  placeholder="Enter address"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor="occupation"
                    className="text-xs text-gray-500  dark:text-gray-400"
                  >
                    Occupation
                  </label>
                  <Input
                    type="text"
                    id="occupation"
                    name="occupation"
                    defaultValue={patientLayout?.occupation}
                    placeholder="Enter occupation"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* email - contact - emergencyContactName - emergencyContactNumber */}
        <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary">
          <h1 className="text-center text-2xl font-bold py-3">
            Contact Information
          </h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center justify-center gap-3 w-full mt-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="email"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={patientLayout?.email}
                  placeholder="Enter email"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="contact"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Contact No.
                </label>
                <Input
                  type="text"
                  id="contact"
                  name="contact"
                  defaultValue={patientLayout?.contact}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 w-full mt-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="emergencyContactName"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Emergency Contact Name
                </label>
                <Input
                  type="text"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  defaultValue={patientLayout?.emergencyContactName}
                  placeholder="Enter emergency contact name"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="emergencyContactNumber"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Emergency Contact Number
                </label>
                <Input
                  type="text"
                  id="emergencyContactNumber"
                  name="emergencyContactNumber"
                  defaultValue={patientLayout?.emergencyContactNumber}
                  placeholder="Enter emergency contact number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* conditionName - conditionDescription - familyMedicalHistory - conditionSeverity - allergies */}
        <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary">
          <h1 className="text-center text-2xl font-bold py-3">
            Medical Condition
          </h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="conditionName"
                className="text-xs text-gray-500  dark:text-gray-400"
              >
                Condition Name
              </label>
              <Input
                type="text"
                id="conditionName"
                name="conditionName"
                defaultValue={patientLayout?.conditionName}
                placeholder="Enter condition name"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="conditionDescription"
                className="text-xs text-gray-500  dark:text-gray-400"
              >
                Condition Description
              </label>
              <Textarea
                rows={5}
                id="conditionDescription"
                name="conditionDescription"
                defaultValue={patientLayout?.conditionDescription}
                placeholder="Describe the condition"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="familyMedicalHistory"
                className="text-xs text-gray-500  dark:text-gray-400"
              >
                Any family medical history?
              </label>
              <Input
                type="text"
                id="familyMedicalHistory"
                name="familyMedicalHistory"
                defaultValue={patientLayout?.familyMedicalHistory}
                placeholder="Enter family medical history"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="conditionSeverity"
                className="text-xs text-gray-500  dark:text-gray-400"
              >
                How severe is your condition?
              </label>
              <Select
                onValueChange={(value) => setSeverity(value ? value : "mild")}
                value={patientLayout?.conditionSeverity || severity}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"mild"}>Mild</SelectItem>
                  <SelectItem value={"moderate"}>Moderate</SelectItem>
                  <SelectItem value={"severe"}>Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AllergiesInput
              initialAllergies={patientLayout?.allergies}
              onAllergiesChange={(newAllergies) => {
                setAllergiesArray(newAllergies);
                const allergiesString = newAllergies.join(", ");
                console.log("allergies string: ", allergiesString);
              }}
            />
          </div>
        </div>

        {/* insuranceProvider - insurancePolicyNumber - identificationCardType - identificationCardNumber */}
        <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary">
          <h1 className="text-center text-2xl font-bold py-3">
            Identity and Insurance Information
          </h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center justify-center gap-3 w-full mt-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="insuranceProvider"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Insurance Provider
                </label>
                <Input
                  type="text"
                  id="insuranceProvider"
                  name="insuranceProvider"
                  defaultValue={patientLayout?.insuranceProvider}
                  placeholder="Enter insurance provider"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="insurancePolicyNumber"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Insurance Policy Number
                </label>
                <Input
                  type="text"
                  id="insurancePolicyNumber"
                  name="insurancePolicyNumber"
                  defaultValue={patientLayout?.insurancePolicyNumber}
                  placeholder="Enter insurance policy number"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 w-full mt-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="identificationCardType"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Identification Card Type
                </label>
                <Select
                  onValueChange={(value) =>
                    setIdentificationCardType(value ? value : "Student ID Card")
                  }
                  value={
                    patientLayout?.identificationCardType ||
                    identificationCardType
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Identification Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {IdentificationTypes.map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="identificationCardNumber"
                  className="text-xs text-gray-500  dark:text-gray-400"
                >
                  Identification Card Number
                </label>
                <Input
                  type="text"
                  id="identificationCardNumber"
                  name="identificationCardNumber"
                  defaultValue={patientLayout?.identificationCardNumber}
                  placeholder="Enter identification card number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* assign to doctor - can assign if admin or doctor only */}
        {(currentUser?.role === "admin" ||
          currentUser?.role === "receptionist") && (
          <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary">
            <h1 className="text-center text-2xl font-bold py-3">Doctor</h1>
            <Separator className="border border-light-200 dark:border-dark-200" />
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="prescription"
                className="text-xs text-gray-500  dark:text-gray-400"
              >
                Assign a Doctor for the patient
              </label>
              <Select
                onValueChange={(value) => setDoctorId(value)}
                value={patientLayout?.doctorId || undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsList?.length > 0 &&
                    doctorsList?.map((doctor: UserType) => (
                      <SelectItem key={doctor?.id} value={doctor?.userId}>
                        <div className="flex items-center gap-2">
                          {doctor?.imageUrl ? (
                            <Image
                              src={doctor?.imageUrl}
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL="/blur.jpg"
                              alt="avatar"
                              width={1000}
                              height={1000}
                              className="w-7 h-7 rounded-full"
                            />
                          ) : (
                            <Image
                              src={"/empty-img.png"}
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL="/blur.jpg"
                              alt="avatar"
                              width={1000}
                              height={1000}
                              className="w-7 h-7 rounded-full"
                            />
                          )}

                          <p>
                            {doctor?.firstname} {doctor?.lastname}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* todo: add a select field to select who the doctor is / who the pharmacist who sold the medicines */}
        {/* todo: add the list of medicines in a select field to select medicines bought by the patient */}
        {/* todo: based on the medicines bought, auto calculate the income generated and store it in database */}

        <div className="flex flex-row items-center justify-end mt-10">
          <Button
            type="submit"
            className="flex items-center justify-center gap-2 min-w-32 max-w-32"
            disabled={uploading}
          >
            {uploading ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <p>Save</p>
              </>
            )}
          </Button>
        </div>
      </form>
      <LoaderDialog loading={loading || uploading} />
    </>
  );
};

export default CreatePatientForm;
