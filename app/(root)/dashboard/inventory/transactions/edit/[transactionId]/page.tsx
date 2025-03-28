"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { LoaderCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { getAllPatients, getPatientLayout } from "@/lib/actions/patient";
import Image from "next/image";
import moment from "moment";
import { Button } from "@/components/ui/button";
import LoaderDialog from "@/components/custom/LoaderDialog";
import { getCurrentUser } from "@/lib/actions/user";
import { getAllMedicines } from "@/lib/actions/medicine";
import { getTransaction, updateTransaction } from "@/lib/actions/transaction";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{
    transactionId: string;
  }>;
}

const EditTransaction = ({ params }: PageProps) => {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState<string>("");

  const [patientsList, setPatientsList] = useState<PatientType[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [filteredMedicines, setFilteredMedicines] = useState<MedicineType[]>(
    []
  );
  const [searchTermMedicine, setSearchTermMedicine] = useState<string>("");

  const [currentUser, setCurrentUser] = useState<UserType>();
  const [medicinesList, setMedicinesList] = useState<MedicineType[]>([]);
  const [patientId, setPatientId] = useState<string>("");
  const [patientPrescription, setPatientPrescription] = useState<string>("");
  const [medicineData, setMedicineData] = useState([
    { medicineId: "", quantity: "", medicineName: "" },
  ]);
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);

  // Get transactionId from params
  useEffect(() => {
    const getTransactionId = async () => {
      const { transactionId } = await params;
      setTransactionId(transactionId);
    };
    getTransactionId();
  }, [params]);

  // Fetch transaction data when transactionId is available
  useEffect(() => {
    const fetchTransactionData = async () => {
      if (!transactionId) return;

      try {
        setLoading(true);
        const result = await getTransaction(transactionId);
        if (result?.data) {
          const transaction = result.data;
          setPatientId(transaction.patientId);
          setPatientName(transaction.patientName);
          setMedicineData(transaction.medicineData);
        }
      } catch {
        toast(
          <p className="text-sm font-bold text-red-500">
            Error fetching transaction details
          </p>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [transactionId]);

  // fetching the patients from Patient table
  useEffect(() => {
    const getPatientsList = async () => {
      try {
        setLoading(true);

        const result = await getAllPatients();
        if (result?.data !== null) {
          setPatientsList(result.data);
          setFilteredPatients(result.data); // Initialize filteredPatients with all patients
        } else {
          setPatientsList([]);
          setFilteredPatients([]);
        }
      } catch {
        toast(
          <p className="text-sm font-bold text-red-500">
            Internal error occurred while fetching all patients
          </p>
        );
      } finally {
        setLoading(false);
      }
    };
    getPatientsList();
  }, []);

  // Add this useEffect to set selected patient after both patientId and patientsList are loaded
  useEffect(() => {
    if (patientId && patientsList.length > 0) {
      const selectedPatient = patientsList.find(
        (p) => p.patientId === patientId
      );
      if (selectedPatient) {
        setPatientId(selectedPatient.patientId);
      }
    }
  }, [patientId, patientsList]);

  // filtering patients with calendar and search bar at the same time
  useEffect(() => {
    const formatDate = (date: Date | undefined): string => {
      return date ? moment(date).format("MM-DD-YYYY") : "";
    };

    const filterPatients = () => {
      let filtered = patientsList;

      // Filter by search term
      if (searchTerm.trim() !== "") {
        const formattedSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter((patient) =>
          patient.fullname.toLowerCase().includes(formattedSearchTerm)
        );
      }

      // Filter by date
      if (date) {
        const selectedDate = formatDate(date);
        filtered = filtered.filter((patient) => {
          const patientDate = moment(patient.createdAt).format("MM-DD-YYYY");
          return patientDate === selectedDate;
        });
      }

      setFilteredPatients(filtered);
    };

    filterPatients();
  }, [searchTerm, date, patientsList]);

  // get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const result = await getCurrentUser();
        if (result?.data !== null) {
          setCurrentUser(result?.data);
        }
      } catch {
        toast(
          <p className="text-sm font-bold text-red-500">
            Internal error occurred while fetching current user
          </p>
        );
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // get all medicines
  useEffect(() => {
    const getMedicinesList = async () => {
      try {
        setLoading(true);
        const result = await getAllMedicines();
        if (result?.data !== null) {
          setMedicinesList(result?.data);
        }
      } catch {
        toast(
          <p className="text-sm font-bold text-red-500">
            Internal error occurred while fetching all medicines
          </p>
        );
      } finally {
        setLoading(false);
      }
    };
    getMedicinesList();
  }, []);

  // filter all medicines based on the inputted medicine name
  useEffect(() => {
    if (searchTermMedicine.trim() === "") {
      setFilteredMedicines(medicinesList);
    } else {
      const formattedMedicine = searchTermMedicine.toLowerCase();
      const filtered = medicinesList.filter((medicine) =>
        medicine?.name.toLowerCase().includes(formattedMedicine)
      );
      setFilteredMedicines(filtered);
    }
  }, [searchTermMedicine, medicinesList]);

  // assign prescription
  const getPatientPrescription = async () => {
    try {
      const result = await getPatientLayout(patientId);
      if (result?.data !== null) {
        setPatientPrescription(result?.data?.prescription);
      }
    } catch {
      toast(
        <p className="text-sm font-bold text-red-500">
          Internal error occurred while fetching patient prescription
        </p>
      );
    }
  };
  useEffect(() => {
    if (patientId) {
      getPatientPrescription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleAddMedicine = () => {
    setMedicineData([
      ...medicineData,
      { medicineId: "", quantity: "", medicineName: "" },
    ]);
  };

  const handleRemove = (i: number) => {
    const deleteVal = [...medicineData];
    deleteVal.splice(i, 1);
    setMedicineData(deleteVal);
  };

  const handleQuantityAndNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { name, value } = e.target;
    const onChangeVal = [...medicineData];
    onChangeVal[i] = { ...onChangeVal[i], [name]: value };
    setMedicineData(onChangeVal);
  };

  const handleMedicineChange = (val: string, i: number) => {
    const onChangeVal = [...medicineData];
    onChangeVal[i] = { ...onChangeVal[i], medicineId: val };
    setMedicineData(onChangeVal);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    medicineData.forEach(({ medicineId, quantity }) => {
      const medicine = medicinesList.find(
        (med) => med.medicineId === medicineId
      );
      if (medicine) {
        totalPrice += medicine.sellingPrice * Number(quantity);
      }
    });
    return totalPrice;
  };

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      setLoading(true);

      const formField = {
        transactionId: transactionId,
        patientId: patientId as string,
        patientName: formData.get("patientName") as string,
        sellerEmail: currentUser?.email as string,
        medicines: medicineData as {
          medicineId: string;
          quantity: string;
          medicineName: string;
        }[],
        totalSales: calculateTotalPrice().toString(),
        transactionDate: moment().format("MM-DD-YYYY"),
      };

      const result = await updateTransaction(prevState, formField);

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Transaction updated successfully
          </p>
        );

        router.push("/dashboard/inventory/transactions");
      }
    } catch {
      toast(
        <p className="text-red-500 text-sm font-bold">
          Internal error occurred while updating transaction
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, pending] = useActionState(handleSubmit, undefined);

  return (
    <div>
      <h2 className="text-2xl font-bold">Edit Transaction</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Update transaction details and medicines.
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
        <form className="flex flex-col gap-4" action={formAction}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Patient (optional)
            </label>
            <Select
              onValueChange={(value) =>
                setPatientId(value ? value : "no record")
              }
              value={patientId}
              disabled={patientsList.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Patient" />
              </SelectTrigger>
              <SelectContent>
                <div className="mb-3 flex items-start justify-between w-full gap-3 bg-light-100 dark:bg-dark-100">
                  <div className="flex items-start gap-2">
                    {date && (
                      <Button
                        type="button"
                        onClick={() => setDate(undefined)}
                        variant={"destructive"}
                      >
                        X
                      </Button>
                    )}
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="flex items-center border border-gray-500 dark:border-gray-400 rounded-lg px-3 w-full">
                    <Search className="cursor-pointer hover:scale-95" />
                    <Input
                      type="text"
                      className="border-none bg-light-100 dark:bg-dark-100"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search patients"
                    />
                  </div>
                </div>
                <div className="min-h-52 max-h-52 overflow-auto card-scroll">
                  {loading ? (
                    <p>Loading patients...</p>
                  ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <SelectItem
                        key={patient?.patientId}
                        value={patient?.patientId}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            {patient?.imageUrl ? (
                              <Image
                                src={patient?.imageUrl}
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
                            <p className="text-sm">{patient?.fullname}</p>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            Appointment date:{" "}
                            {moment(patient?.createdAt).format("MMM-DD-YYYY")}
                          </p>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <p>No patients found.</p>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Patient Name
            </label>
            <Input
              type="text"
              name="patientName"
              placeholder="Enter patient name"
              defaultValue={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 w-full my-3">
            <div className="w-full flex items-center justify-between">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Medicines
              </label>
              <Button type="button" onClick={handleAddMedicine}>
                Add
              </Button>
            </div>
            {medicineData.map((val, i: number) => (
              <div key={i}>
                <div className="flex items-start gap-3 mt-3">
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-3 w-full">
                      <Select
                        onValueChange={(val) => handleMedicineChange(val, i)}
                        value={val.medicineId}
                        disabled={medicinesList.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select medicines" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* search input for medicine */}
                          <div className="flex items-center border border-gray-500 dark:border-gray-400 rounded-lg px-3 w-full">
                            <Search className="cursor-pointer hover:scale-95" />
                            <Input
                              type="text"
                              className="border-none bg-light dark:bg-dark"
                              value={searchTermMedicine}
                              onChange={(e) =>
                                setSearchTermMedicine(e.target.value)
                              }
                              placeholder="Search medicines"
                            />
                          </div>
                          {filteredMedicines?.length > 0 ? (
                            filteredMedicines?.map((medicine) => (
                              <SelectItem
                                key={medicine?.medicineId}
                                value={medicine?.medicineId}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    {medicine?.imageUrl ? (
                                      <Image
                                        src={medicine?.imageUrl}
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
                                    <p className="text-sm">{medicine?.name}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    BATCH{medicine?.batchNumber}
                                  </p>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            // Render a disabled SelectItem to prevent errors
                            <SelectItem disabled value="empty">
                              <div className="py-2 px-3 text-center text-sm text-muted-foreground">
                                No medicines found.
                              </div>
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Input
                        name="quantity"
                        min={0}
                        type="number"
                        value={val.quantity}
                        onChange={(e) => handleQuantityAndNameChange(e, i)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Medicine Name
                      </label>
                      <Input
                        name="medicineName"
                        type="text"
                        value={val.medicineName || "unset"}
                        onChange={(e) => handleQuantityAndNameChange(e, i)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => handleRemove(i)}
                  >
                    Remove
                  </Button>
                </div>

                <Separator className="mt-4" />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              "Update"
            )}
          </Button>
        </form>

        {patientPrescription ? (
          <div dangerouslySetInnerHTML={{ __html: patientPrescription }} />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No prescription available.
          </p>
        )}
      </div>

      <LoaderDialog loading={loading} />
    </div>
  );
};

export default EditTransaction;
