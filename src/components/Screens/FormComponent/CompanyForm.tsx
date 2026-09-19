"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FormSubmit } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { postCompaniesData } from "@/app/actions/companies.action";
import { Loader2 } from "lucide-react";

const CompanyForm = ({ user }: FormSubmit) => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const noSpinner =
    "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const handleSubmitCompany = async (formData: FormData) => {
    setLoading(true);
    const result = await postCompaniesData(formData);
    if (result?.error) {
      setLoading(false);
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
        duration: 3000,
      });
    } else {
      setLoading(false);
      ref.current?.reset();
      toast({
        title: "Berhasil",
        description: "Perusahaan berhasil ditambahkan",
        duration: 3000,
      });
      router.push("/master-data/companies");
    }
  };

  if (user.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        Hanya admin yang bisa akses halaman ini.
      </div>
    );
  }

  return (
    <div>
      <form className="grid mx-6 my-2" action={handleSubmitCompany}>
        <div className="flex flex-col mt-6">
          <Label className="font-bold text-s my-2">
            Nama Perusahaan <span className="text-red-500 text-[16px]"> *</span>
          </Label>
          <Input placeholder="Nama perusahaan" name="companyName" required />
        </div>

        <div className="flex flex-col my-2">
          <Label className="font-bold text-s my-2">
            Alamat <span className="text-red-500 text-[16px]"> *</span>
          </Label>
          <Input placeholder="Alamat" name="address" required />
        </div>

        <div className="flex flex-col my-2">
          <Label className="font-bold text-s my-2">
            Nomor Telepon <span className="text-red-500 text-[16px]"> *</span>
          </Label>
          <Input
            placeholder="Nomor telepon"
            name="telephone"
            type="number"
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 15) {
                setPhone(value);
              }
            }}
            min={0}
            className={noSpinner}
            required
          />
        </div>

        <div className="flex justify-end m-11">
          {loading ? (
            <Button type="submit" className="px-9" disabled>
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="px-9">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
