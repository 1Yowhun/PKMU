import { getCurrentSession } from "@/app/actions/auth.actions";
import {
  getNextNumber,
  searchDeliveryNumber,
} from "@/app/actions/lpg-distribution.action";
import DistributionForm from "@/components/Screens/FormComponent/DistributionForm";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Form Penyaluran Elpiji",
};

const FormLpgPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  const query = searchParams?.query || "";
  const data = await searchDeliveryNumber(query, user.companiesId);
  const bpe = await getNextNumber(user.companiesId);

  return <DistributionForm data={data} bpe={bpe} user={user} />;
};

export default FormLpgPage;
