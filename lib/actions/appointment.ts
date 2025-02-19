"use server";

import { db } from "@/utils/db";
import { parseStringify } from "../utils";
import { Appointment, Patient } from "@/utils/schema";
import { eq } from "drizzle-orm";

export const getAllAppointments = async () => {
  try {
    const data = await db.select().from(Appointment);
    return parseStringify({ data: data });
  } catch (error) {
    handleError(error);
  }
};

export const getAppointmentByAppointmentId = async (appointmentId: string) => {
  try {
    const data = await db
      .select()
      .from(Appointment)
      .where(eq(Appointment.appointmentId, appointmentId as string));

    if (data?.length > 0) {
      return parseStringify({ data: data[0] });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getDoctorAppointments = async (doctorId: string) => {
  try {
    const data = await db
      .select()
      .from(Appointment)
      .where(eq(Appointment.doctorId, doctorId as string));
    return parseStringify({ data: data });
  } catch (error) {
    handleError(error);
  }
};

export const addAppointment = async (
  appointmentId: string,
  patientId: string,
  doctorId: string,
  patientName: string,
  reason: string,
  conditionDescription: string,
  severity: string,
  familyMedicalHistory: string,
  allergies: string,
  status: string,
  createdAt: string
) => {
  try {
    const data = await db.insert(Appointment).values({
      appointmentId: appointmentId,
      patientId: patientId,
      doctorId: doctorId,
      patientName: patientName,
      reason: reason,
      conditionDescription: conditionDescription,
      severity: severity,
      familyMedicalHistory: familyMedicalHistory,
      allergies: allergies,
      status: status,
      createdAt: createdAt,
    });
    if (data) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const updateAppointment = async (
  appointmentId: string,
  patientId: string,
  form: {
    patientName: string;
    doctorName: string;
    reason: string;
    conditionDescription: string;
    severity: string;
    familyMedicalHistory: string;
    allergies: string;
    status: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    prescription: string;
  }
) => {
  try {
    const data = await db
      .update(Appointment)
      .set({
        patientName: form.patientName,
        doctorName: form.doctorName,
        reason: form.reason,
        conditionDescription: form.conditionDescription,
        severity: form.severity,
        familyMedicalHistory: form.familyMedicalHistory,
        allergies: form.allergies,
        status: form.status,
        date: form.date,
        timeStart: form.timeStart,
        timeEnd: form.timeEnd,
      })
      .where(eq(Appointment.appointmentId, appointmentId));

    if (data) {
      const data2 = await db
        .update(Patient)
        .set({
          prescription: form.prescription,
        })
        .where(eq(Patient.patientId, patientId));

      if (data2) {
        return parseStringify({ data: data2 });
      }
      return parseStringify({ data: null });
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
