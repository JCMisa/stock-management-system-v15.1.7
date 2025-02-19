/* eslint-disable react-hooks/exhaustive-deps */
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
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/actions/user";
import { getAllMedicines } from "@/lib/actions/medicine";
import { addTransaction } from "@/lib/actions/transaction";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const CreateTransaction = () => {
  const router = useRouter();

  const [patientsList, setPatientsList] = useState<PatientType[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [currentUser, setCurrentUser] = useState<UserType>();
  const [medicinesList, setMedicinesList] = useState<MedicineType[]>([]);
  const [patientId, setPatientId] = useState<string>("");

  const [filteredMedicines, setFilteredMedicines] = useState<MedicineType[]>(
    []
  );
  const [searchTermMedicine, setSearchTermMedicine] = useState<string>("");

  const [patientPrescription, setPatientPrescription] = useState<string>("");
  const [medicineData, setMedicineData] = useState([
    { medicineId: "", quantity: "", medicineName: "" },
  ]);
  const [loading, setLoading] = useState(false);

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

  // get the currently logged in user and set it to the currentUser useState
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
            Internal error occured while fetching current user
          </p>
        );
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // get all the medicines and store it in the medicineList useState
  useEffect(() => {
    const getMedicinesList = async () => {
      try {
        setLoading(true);

        const result = await getAllMedicines();
        if (result?.data !== null) {
          setMedicinesList(result?.data);
          setFilteredMedicines(result?.data);
        }
      } catch {
        toast(
          <p className="text-sm font-bold text-red-500">
            Internal error occured while fetching all medicines
          </p>
        );
      } finally {
        setLoading(false);
      }
    };

    getMedicinesList();
  }, []);

  // get the prescription of the selected patient in the select field
  useEffect(() => {
    const getPatientPrescription = async () => {
      try {
        const result = await getPatientLayout(patientId);
        if (result?.data !== null) {
          setPatientPrescription(result?.data?.prescription); // set it to patientPrescription useState
        }
      } catch {
        toast(
          <p className="text-sm font-bold text-red-500">
            Internal error occured while fetching patient prescription
          </p>
        );
      }
    };

    getPatientPrescription();
  }, [patientId]); // trigger it everytime the selected patient changees

  // handling the addition of group field to add more medicine with it's respective quantity
  const handleAddMedicine = () => {
    setMedicineData([
      ...medicineData,
      { medicineId: "", quantity: "", medicineName: "" },
    ]);
  };

  // handling the removal of group field to remove medicine with it's respective quantity
  const handleRemove = (i: number) => {
    const deleteVal = [...medicineData];
    deleteVal.splice(i, 1);
    setMedicineData(deleteVal);
  };

  // handle the input change on the quantity value of medicine, sets the respective quantity assigned to the selected medicine
  // note: considering the previous selected medicines with their own quantities
  const handleQuantityAndNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { name, value } = e.target;
    const onChangeVal = [...medicineData];
    onChangeVal[i] = { ...onChangeVal[i], [name]: value };
    setMedicineData(onChangeVal);
  };

  // handle the input change on the selected medicine
  // note: considering the previous selected medicines with their own quantities
  const handleMedicineChange = (val: string, i: number) => {
    const onChangeVal = [...medicineData];
    onChangeVal[i] = { ...onChangeVal[i], medicineId: val };
    setMedicineData(onChangeVal);
  };

  // calculate the total price of the sold medicines considering the quantity of each medicine sold by accessing the medicine selling price
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
      const transactionId = uuidv4();

      const formField = {
        transactionId: transactionId as string,
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

      const result = await addTransaction(prevState, formField);

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Transaction created successfully
          </p>
        );

        router.push("/dashboard/inventory/transactions");
      }
    } catch {
      toast(
        <p className="text-red-500 text-sm font-bold">
          Internal error occured while adding transaction
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
      <h2 className="text-2xl font-bold">Add Transaction</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Add new transaction and provide bought medicines to calculate generated
        income.
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
        {/* form area */}
        <form className="flex flex-col gap-4" action={formAction}>
          {/* select patient */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Patient (optional)
            </label>
            <Select
              onValueChange={(value) =>
                setPatientId(value ? value : "no record")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Patient" />
              </SelectTrigger>
              <SelectContent>
                <div className="mb-3 flex items-start justify-between w-full gap-3 bg-light-100 dark:bg-dark-100 p-3">
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

          {/* patient name */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Patient Name
            </label>
            <Input
              type="text"
              name="patientName"
              placeholder="Enter patient name"
            />
          </div>

          {/* multiple medicines can be picked */}
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
                          {filteredMedicines.length > 0 ? (
                            filteredMedicines.map((medicine) => (
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
                        Medicine Name{" "}
                        <span className="text-[10px] text-muted-foreground">
                          (with batch)
                        </span>
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
              "Submit"
            )}
          </Button>
        </form>

        {/* prescription area */}
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

export default CreateTransaction;
