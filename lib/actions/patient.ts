"use server";

import { db } from "@/utils/db";
import { parseStringify } from "../utils";
import { Appointment, Patient } from "@/utils/schema";
import { eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getAllPatients = async () => {
  try {
    const data = await db.select().from(Patient);

    if (data.length > 0) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getPatientLayout = async (patientId: string) => {
  try {
    const data = await db
      .select()
      .from(Patient)
      .where(eq(Patient.patientId, patientId));
    if (data?.length > 0) {
      return parseStringify({ data: data[0] });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getAppointedPatients = async () => {
  try {
    const data = await db
      .select()
      .from(Patient)
      .where(ne(Appointment.doctorId, ""));

    return parseStringify({ data: data });
  } catch (error) {
    handleError(error);
  }
};

export const createPatientLayout = async (
  state: unknown,
  patientId: string,
  addedBy: string,
  form: {
    firstname: string;
    lastname: string;
    email: string;
    conditionName: string;
    age: string;
    gender: string;
  }
) => {
  try {
    const data = await db.insert(Patient).values({
      patientId: patientId,
      addedBy: addedBy,
      firstname: form.firstname,
      lastname: form.lastname,
      fullname: form.firstname + " " + form.lastname,
      email: form.email,
      conditionName: form.conditionName,
      age: Number(form.age) || 0,
      gender: form.gender,
    });

    if (data) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const updatePatientAvatar = async (
  patientId: string,
  downloadUrl: string
) => {
  try {
    const data = await db
      .update(Patient)
      .set({
        imageUrl: downloadUrl,
      })
      .where(eq(Patient.patientId, patientId));

    if (data) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const updatePatientInfoByReceptionistOrAdmin = async (
  state: unknown,
  patientId: string,
  form: {
    doctorId: string;
    firstname: string;
    lastname: string;
    email: string;
    gender: string;
    age: string;
    address: string;
    contact: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    identificationCardType: string;
    identificationCardNumber: string;
    conditionName: string;
    conditionDescription: string;
    conditionSeverity: string;
    allergies: string;
    familyMedicalHistory: string;
    createdAt: string;
    updatedAt: string;
  }
) => {
  try {
    const data = await db
      .update(Patient)
      .set({
        doctorId: form.doctorId,
        firstname: form.firstname,
        lastname: form.lastname,
        fullname: form.firstname + " " + form.lastname,
        email: form.email,
        gender: form.gender,
        age: Number(form.age) || 0,
        address: form.address,
        contact: form.contact,
        occupation: form.occupation,
        emergencyContactName: form.emergencyContactName,
        emergencyContactNumber: form.emergencyContactNumber,
        insuranceProvider: form.insuranceProvider,
        insurancePolicyNumber: form.insurancePolicyNumber,
        identificationCardType: form.identificationCardType,
        identificationCardNumber: form.identificationCardNumber,
        conditionName: form.conditionName,
        conditionDescription: form.conditionDescription,
        conditionSeverity: form.conditionSeverity,
        allergies: form.allergies,
        familyMedicalHistory: form.familyMedicalHistory,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      })
      .where(eq(Patient.patientId, patientId));

    if (data) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const updatePrescription = async (
  patientId: string,
  prescription: string
) => {
  try {
    const data = await db
      .update(Patient)
      .set({
        prescription: prescription,
      })
      .where(eq(Patient.patientId, patientId));

    if (data) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const deletePatient = async (patientId: string) => {
  try {
    const data = await db
      .delete(Patient)
      .where(eq(Patient.patientId, patientId));
    if (data) {
      const deleteAppointment = await db //delete also the appointment when patient was deleted
        .delete(Appointment)
        .where(eq(Appointment.patientId, patientId));

      if (deleteAppointment) {
        revalidatePath("/dashboard/manage/patients");
        return parseStringify({ data: data });
      }
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
