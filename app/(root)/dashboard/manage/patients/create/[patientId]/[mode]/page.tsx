import Image from "next/image";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAllPatients } from "@/lib/actions/patient";
import CreatePatientForm from "../../../_components/CreatePatientForm";

// for caching a dynamic route to make page loading faster
export async function generateStaticParams() {
  const patientsList = await getAllPatients();

  if (!Array.isArray(patientsList?.data)) {
    return [];
  }

  return patientsList.data.map((patientId: string) => patientId).slice(0, 5);
}

const CreatePatientPage = async ({
  params,
}: {
  params: Promise<{ patientId: string; mode: string }>;
}) => {
  const patientId = (await params)?.patientId;
  const mode = (await params)?.mode;

  return (
    <div>
      <Link
        href={"/dashboard/manage/patients"}
        className="flex items-center gap-1 cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Back to Patients List
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
              <h1 className="text-3xl font-bold">Manage Patient</h1>
            </div>

            <div className="my-10">
              <CreatePatientForm patientId={patientId} mode={mode} />
            </div>

            <p className="text-xs justify-items-end text-center text-gray-500 xl:text-left">
              © 2025 RHU
            </p>
          </div>
        </section>

        <Image
          src="/register-patient-banner.jpg"
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

export default CreatePatientPage;
