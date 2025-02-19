import { columns } from "@/components/dataTable/patients/patient-columns";
import { DataTable } from "@/components/dataTable/patients/patient-data-table";
import { getAllPatients } from "@/lib/actions/patient";
import { getCurrentUser } from "@/lib/actions/user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Patients",
  description:
    "Manage patients page to manage patients by performing CRUD operations to manipulate patients.",
  robots: {
    index: false,
    follow: true,
  },
};

const ManagePatientsPage = async () => {
  try {
    const [user, patientList] = await Promise.all([
      getCurrentUser(),
      getAllPatients(),
    ]);
    if (user?.data === null) redirect("/sign-in");

    return (
      <div>
        <DataTable
          columns={columns}
          data={patientList?.data?.length > 0 ? patientList?.data : []}
          query1="fullname"
          showCreate={
            user?.data?.role === "admin" || user?.data?.role === "receptionist"
          }
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load patients data:", error);
    return <div>Error loading data.</div>;
  }
};

export default ManagePatientsPage;
