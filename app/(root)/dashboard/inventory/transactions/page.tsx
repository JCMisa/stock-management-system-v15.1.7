import { columns } from "@/components/dataTable/transactions/transaction-columns";
import { DataTable } from "@/components/dataTable/transactions/transaction-data-table";
import { getAllTransactions } from "@/lib/actions/transaction";
import { getCurrentUser } from "@/lib/actions/user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Transactions",
  description:
    "Manage transactions page to manage transactions by performing CRUD operations to manipulate transactions.",
  robots: {
    index: false,
    follow: true,
  },
};

const TransactionsPage = async () => {
  const [user, transactionsList] = await Promise.all([
    getCurrentUser(),
    getAllTransactions(),
  ]);
  if (user?.data === null) redirect("/sign-in");

  return (
    <div>
      <DataTable
        columns={columns}
        data={transactionsList?.data}
        query1="patientName"
        showCreate={
          user?.data?.role === "admin" || user?.data?.role === "pharmacist"
        }
      />
    </div>
  );
};

export default TransactionsPage;
