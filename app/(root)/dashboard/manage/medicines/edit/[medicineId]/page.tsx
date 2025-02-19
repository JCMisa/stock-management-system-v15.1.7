import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UpdateMedicineForm from "./_components/UpdateMedicineForm";
import { getAllMedicines } from "@/lib/actions/medicine";

// for caching a dynamic route to make page loading faster
export async function generateStaticParams() {
  const medicinesList = await getAllMedicines();

  if (!Array.isArray(medicinesList?.data)) {
    return [];
  }

  return medicinesList.data.map((medicineId: string) => medicineId).slice(0, 5);
}

const MedicineManagePage = async ({
  params,
}: {
  params: Promise<{ medicineId: string }>;
}) => {
  const medicineId = (await params)?.medicineId;
  return (
    <div>
      <Link
        href={"/dashboard/manage/medicines"}
        className="flex items-center gap-1 cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Back to Medicines List
        </p>
      </Link>
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar relative flex-1 overflow-y-auto">
          <div className="flex size-full flex-col py-10 max-w-[98%] flex-1">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/blur.jpg"
                height={1000}
                width={1000}
                alt="logo"
                className="w-20 h-20"
              />
              <h1 className="text-3xl font-bold">Create New Medicine</h1>
            </div>

            <div className="my-10">
              <UpdateMedicineForm medicineId={medicineId} />
            </div>

            <p className="text-xs justify-items-end text-center text-gray-500 xl:text-left">
              © 2025 RHU
            </p>
          </div>
        </section>

        <Image
          src="/create-medicine-img.png"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/blur.jpg"
          height={1000}
          width={1000}
          alt="banner"
          className="hidden h-full object-cover xl:block max-w-[390px]"
        />
      </div>
    </div>
  );
};

export default MedicineManagePage;
