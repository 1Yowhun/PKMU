import { getCurrentSession } from "@/app/actions/auth.actions";
import {
  getNextNumber,
  searchDeliveryNumber,
} from "@/app/actions/lpg-distribution.action";
import { ContentLayout } from "@/components/ContentLayout";
import Form from "@/components/Screens/FormComponent/Form";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Form PKMU",
};

const FormLpgPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const data = await searchDeliveryNumber(query);
  const bpe = await getNextNumber();
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }

  return (
    <ContentLayout
      home={"dashboard"}
      mainpage={"penyaluran-elpiji"}
      childpage={"form"}
      children={
        <Form page={"distribution"} data={data} bpe={bpe} user={user} />
      }
    />
  );
};

export default FormLpgPage;
