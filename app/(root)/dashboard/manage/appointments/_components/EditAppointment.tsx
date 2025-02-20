import React, { useActionState, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BrainIcon,
  LoaderCircle,
  LoaderCircleIcon,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getAppointmentByAppointmentId,
  updateAppointment,
} from "@/lib/actions/appointment";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getPatientLayout } from "@/lib/actions/patient";
import LoaderDialog from "@/components/custom/LoaderDialog";
import { useRouter } from "next/navigation";
import moment from "moment";
import AllergiesInput from "../../patients/_components/AllergiesInput";
import axios from "axios";
import { formatDate } from "@/lib/utils";
import { columns } from "@/components/dataTable/medicines/medicine-columns";
import { DataTable } from "@/components/dataTable/medicines/medicine-data-table";
import { getCurrentUser } from "@/lib/actions/user";
import { getAllMedicines } from "@/lib/actions/medicine";

const EditAppointment = ({ appointmentId }: { appointmentId: string }) => {
  const router = useRouter();

  const [appointment, setAppointment] = useState<AppointmentType>();
  const [patient, setPatient] = useState<PatientType>();
  const [status, setStatus] = useState<string>(appointment?.status as string);

  const [appointmentReason, setAppointmentReason] = useState<string>(
    appointment?.reason as string
  );
  const [appointmentConditionDesc, setAppointmentConditionDesc] = useState<
    string | null
  >((appointment?.conditionDescription as string) || null);
  const [appointmentConditionSeverity, setAppointmentConditionSeverity] =
    useState<string | null>((appointment?.severity as string) || null);

  const [allergiesArray, setAllergiesArray] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [aiPatientPrescription, setAiPatientPrescription] = useState("");

  useEffect(() => {
    const getAppointment = async () => {
      try {
        setLoading(true);

        if (appointmentId) {
          const result = await getAppointmentByAppointmentId(appointmentId);

          if (result?.data !== null) {
            setAppointment(result.data);
          }
        }
        return;
      } catch {
        toast(
          <p className="font-bold text-sm text-red-500">
            Internal error occured while fetching the appointment
          </p>
        );
      } finally {
        setLoading(false);
      }
    };

    getAppointment();
  }, [appointmentId]);

  useEffect(() => {
    const getPatientInfo = async () => {
      try {
        setLoading(true);

        const result = await getPatientLayout(appointment?.patientId as string);
        if (result?.data !== null) {
          setPatient(result?.data);
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

    getPatientInfo();
  }, [appointment]);

  // get the medicine list and the currently logged in user
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [medicines, setMedicines] = useState<MedicineType[]>([]);

  useEffect(() => {
    const getDatatableData = async () => {
      try {
        const [user, medicinesList] = await Promise.all([
          getCurrentUser(),
          getAllMedicines(),
        ]);
        if (user?.data === null) router.push("/sign-in");

        setCurrentUser(user?.data);
        setMedicines(medicinesList?.data);
      } catch (error) {
        console.error("Failed to load medicines data:", error);
      }
    };

    getDatatableData();
  }, [router]);

  const [quillValue, setQuillValue] = useState("");
  const handleQuillChange = (value: string) => {
    setQuillValue(value);
  };
  useEffect(() => {
    if (aiPatientPrescription) {
      setQuillValue(aiPatientPrescription);
    } else if (patient?.prescription) {
      setQuillValue(patient.prescription);
    }
  }, [aiPatientPrescription, patient]);

  const askAiPrescription = async () => {
    const finalReason = appointmentReason || appointment?.reason;
    const finalConditionDesc =
      appointmentConditionDesc || appointment?.conditionDescription;
    const finalConditionSeverity =
      appointmentConditionSeverity || appointment?.severity;
    const finalAllergies =
      allergiesArray.length > 0
        ? allergiesArray
        : appointment?.allergies?.split(", ") || [];

    // AI prescription generation logic
    const PROMPT = `You are an expert doctor with 80 years of experience, provide me a prescription based on the following data, provide only direct answer, no excuses that you are an AI:

Health condition: ${finalReason},
Description of condition: ${finalConditionDesc},
Severity: ${finalConditionSeverity},
Family medical history: ${appointment?.familyMedicalHistory},
Allergies: ${finalAllergies.join(", ")}

Could you please provide a possible diagnosis, suggest some medicines I can take, and give me any advice or personalized prescription?

I need the response in a rich text HTML format consisting of:

A short, bold header for the diagnosis.

A bulleted list of prescriptions where each bullet contains the medicine name and the respective quantity to prescribe, along with detailed information about when and how to take them.

A paragraph with personalized advice or suggestions for managing the condition.

Example response format:

<h2><b>Prescription:</b></h2>

<ul> <li><b>Medicine Name:</b> Quantity - Detailed information about when and how to take it.</li> <li><b>Medicine Name:</b> Quantity - Detailed information about when and how to take it.</li> </ul>

<p><b>Advice:</b> Personalized advice or suggestions for managing the condition.</p>
`;

    try {
      setLoading(true);

      const result = await axios.post("/api/generate-prescription", {
        prompt: PROMPT,
      });

      if (result.status === 200) {
        const cleanedText = result?.data.replace(/```html|```/g, "");
        setAiPatientPrescription(cleanedText);
        console.log("prescription generated by ai: ", result?.data);
        toast(
          <p className="text-sm font-bold text-green-500">
            Prescription generated successfully
          </p>
        );
      }
    } catch {
      toast(
        <p className="text-sm font-bold text-red-500">
          Internal error occured while generating AI prescription
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const finalStatus = status || appointment?.status;
      const finalPrescription = quillValue || patient?.prescription;
      const finalReason = appointmentReason || appointment?.reason;
      const finalConditionDesc =
        appointmentConditionDesc || appointment?.conditionDescription;
      const finalConditionSeverity =
        appointmentConditionSeverity || appointment?.severity;

      const formField = {
        patientName: formData.get("patientName") as string,
        doctorName: formData.get("doctorName") as string,
        reason: finalReason as string,
        conditionDescription: finalConditionDesc as string,
        severity: finalConditionSeverity as string,
        familyMedicalHistory: appointment?.familyMedicalHistory as string,
        allergies: allergiesArray.join(", "),
        status: finalStatus as string,
        date:
          moment(formData.get("date") as string).format("MM-DD-YYYY") ||
          (appointment?.date as string),
        timeStart: formData.get("timeStart") as string,
        timeEnd: formData.get("timeEnd") as string,
        prescription: finalPrescription as string,
      };

      const result = await updateAppointment(
        appointmentId,
        patient?.patientId || (appointment?.patientId as string),
        formField
      );

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Patient updated successfully
          </p>
        );
        router.push("/dashboard/manage/appointments");
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while updating appointment
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
    <>
      <AlertDialog>
        <AlertDialogTrigger className="w-full">
          <div className="flex items-center gap-2 p-2 hover:bg-light hover:text-dark transition-all w-full rounded-sm">
            <Pencil className="h-4 w-4 mr-2" />
            <p className="text-sm">Edit</p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="xl:min-w-[80rem] max-h-[50rem] overflow-auto card-scroll">
          <AlertDialogHeader>
            <AlertDialogTitle>Manage Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Edit necessary details for your patient and your patient&apos;s
              appointment
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start justify-center">
            <form action={formAction} className="">
              <div className="mt-5 flex flex-col gap-5">
                <div className="flex flex-row items-center justify-center gap-3 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Patient Name
                    </label>
                    <Input
                      type="text"
                      id="patientName"
                      name="patientName"
                      defaultValue={appointment?.patientName}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Doctor Name
                    </label>
                    <Input
                      type="text"
                      id="doctorName"
                      name="doctorName"
                      defaultValue={appointment?.doctorName}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Appointment Reason
                    </label>
                    <Input
                      id="reason"
                      name="reason"
                      defaultValue={appointment?.reason}
                      onChange={(e) => setAppointmentReason(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Condition Description
                    </label>
                    <Textarea
                      rows={5}
                      id="conditionDescription"
                      name="conditionDescription"
                      defaultValue={appointment?.conditionDescription}
                      onChange={(e) =>
                        setAppointmentConditionDesc(e.target.value)
                      }
                      className="card-scroll"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <label
                      htmlFor="conditionSeverity"
                      className="text-xs text-gray-500  dark:text-gray-400"
                    >
                      Patient&apos;s Condition Severity
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setAppointmentConditionSeverity(value ? value : "mild")
                      }
                      defaultValue={appointment?.severity}
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

                  <div className="flex flex-col gap-1 w-full">
                    <AllergiesInput
                      initialAllergies={appointment?.allergies}
                      onAllergiesChange={(newAllergies) => {
                        setAllergiesArray(newAllergies);
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-row items-center justify-center gap-3 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Appointment Status
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setStatus(value ? value : "pending")
                      }
                      defaultValue={appointment?.status}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"pending"}>Pending</SelectItem>
                        <SelectItem value={"completed"}>Completed</SelectItem>
                        <SelectItem value={"canceled"}>Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Date
                  </label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={formatDate(appointment?.date as string)}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {appointment?.date}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-center gap-3 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Time Start
                    </label>
                    <Input
                      type="time"
                      id="timeStart"
                      name="timeStart"
                      defaultValue={appointment?.timeStart}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Time End
                    </label>
                    <Input
                      type="time"
                      id="timeEnd"
                      name="timeEnd"
                      defaultValue={appointment?.timeEnd}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Prescription
                    </label>

                    <Button
                      type="button"
                      className="flex items-center gap-2"
                      size={"sm"}
                      variant={"outline"}
                      disabled={loading}
                      onClick={askAiPrescription}
                    >
                      {loading ? (
                        <>
                          <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                          <p className="text-xs">Generating</p>
                        </>
                      ) : (
                        <>
                          <BrainIcon className="w-4 h-4" />
                          <p className="text-xs">Ask AI</p>
                        </>
                      )}
                    </Button>
                  </div>
                  <ReactQuill
                    theme="snow"
                    className="bg-light dark:bg-dark"
                    value={quillValue}
                    onChange={handleQuillChange}
                  />

                  {/* {aiPatientPrescription && (
                  <div className="mt-5 flex flex-col gap-3">
                    <div
                      className="text-xs text-gray-500 dark:text-gray-400"
                      dangerouslySetInnerHTML={{
                        __html: aiPatientPrescription,
                      }}
                    />

                    <Button
                      type="button"
                      size={"sm"}
                      className="flex items-center gap-2 w-1/4"
                      onClick={() => copyToClipboard(aiPatientPrescription)}
                    >
                      <ClipboardCopyIcon className="w-4 h-4" />
                      <p className="text-xs">Copy Text</p>
                    </Button>
                  </div>
                )} */}
                </div>
              </div>
              <AlertDialogFooter className="mt-5">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </AlertDialogFooter>
            </form>
            <div>
              <DataTable
                columns={columns}
                data={medicines}
                query1="name"
                showCreate={
                  currentUser?.role === "admin" ||
                  currentUser?.role === "pharmacist"
                }
              />
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <LoaderDialog loading={loading || uploading} />
    </>
  );
};

export default EditAppointment;
