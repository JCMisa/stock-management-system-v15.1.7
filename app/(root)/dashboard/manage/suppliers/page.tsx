import { columns } from "@/components/dataTable/suppliers/supplier-columns";
import { DataTable } from "@/components/dataTable/suppliers/supplier-data-table";
import { getAllSuppliers } from "@/lib/actions/supplier";
import { getCurrentUser } from "@/lib/actions/user";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Suppliers",
  description:
    "Manage suppliers page to manage suppliers by performing CRUD operations to manipulate suppliers.",
  robots: {
    index: false,
    follow: true,
  },
};

const ManageSuppliersPage = async () => {
  try {
    const [user, suppliersList] = await Promise.all([
      getCurrentUser(),
      getAllSuppliers(),
    ]);
    if (user?.data === null) redirect("/sign-in");

    return (
      <div>
        <DataTable
          columns={columns}
          data={suppliersList?.data}
          query1="supplierName"
          showCreate={user?.data?.role === "admin"}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load medicines data:", error);
    return <div>Error loading data.</div>;
  }
};

export default ManageSuppliersPage;
