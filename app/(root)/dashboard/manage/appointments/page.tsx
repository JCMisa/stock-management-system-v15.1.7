import { columns } from "@/components/dataTable/appointments/appointment-columns";
import { DataTable } from "@/components/dataTable/appointments/appointment-data-table";
import {
  getAllAppointments,
  getDoctorAppointments,
} from "@/lib/actions/appointment";
import { getCurrentUser } from "@/lib/actions/user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Appointements",
  description:
    "Manage appointments page to manage appointments by performing CRUD operations to manipulate appointments.",
  robots: {
    index: false,
    follow: true,
  },
};

const AppointmentsPage = async () => {
  try {
    const [user, allAppointmentsList] = await Promise.all([
      getCurrentUser(),
      getAllAppointments(),
    ]);
    if (user?.data === null) redirect("/sign-in");

    const doctorAppointmentsList = await getDoctorAppointments(
      user?.data?.userId
    );
    return (
      <div>
        <DataTable
          columns={columns}
          data={
            user?.data?.role === "admin"
              ? allAppointmentsList?.data?.length > 0
                ? allAppointmentsList?.data
                : []
              : doctorAppointmentsList?.data?.length > 0
              ? doctorAppointmentsList?.data
              : []
          }
          query1="patientName"
          showCreate={
            user?.data?.role === "admin" || user?.data?.role === "doctor"
          }
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load appointments data:", error);
    return <div>Error loading data.</div>;
  }
};

export default AppointmentsPage;
