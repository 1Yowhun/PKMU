import {
  getNextNumber,
  searchDeliveryNumber,
} from "@/app/actions/lpg-distribution.action";
import { ContentLayout } from "@/components/ContentLayout";
import Form from "@/components/FormComponent/Form";
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

  return (
    <ContentLayout
      home={"dashboard"}
      mainpage={"penyaluran-elpiji"}
      childpage={"form"}
      children={<Form page={"distribution"} data={data} bpe={bpe} />}
    />
  );
};

export default FormLpgPage;