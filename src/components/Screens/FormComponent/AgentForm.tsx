"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { postAgentData } from "@/app/actions/agent.action";
import { Loader2 } from "lucide-react";
import { FormSubmit } from "@/lib/types";

const AgentForm = ({ companyName, user }: FormSubmit) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLFormElement>(null);

  const noSpinner =
    "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const handleCompanySelect = (value: any) => {
    const selectedCompany = companyName?.find(
      (company) => company.companyName === value
    );
    setSelectedCompanyId(Number(selectedCompany?.id));
  };

  const handleSubmitAgents = async (formData: FormData) => {
    setLoading(true);
    const result = await postAgentData(formData);
    console.log(result);
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
        description: "Agen berhasil ditambahkan",
        duration: 3000,
      });
      redirect("/master-data/agents");
    }
  };

  if (user.role != "ADMIN") {
    toast({
      variant: "destructive",
      title: "Hanya admin yang bisa akses",
      duration: 3000,
    });
    redirect("/dashboard/penyaluran-elpiji");
  }

  return (
    <div>
      <form className="grid mx-6" action={handleSubmitAgents}>
        <div className="flex flex-col my-2 mt-6">
          <Label className="font-bold text-xs rounded-md my-2">
            Nama <span className="text-red-500 text-[16px]"> *</span>
          </Label>
          <Input placeholder="Nama" name="agentName" required />
        </div>

        <div className="flex flex-col my-2">
          <Label className="font-bold text-xs rounded-md my-2">
            Alamat <span className="text-red-500 text-[16px]"> *</span>
          </Label>
          <Input placeholder="Alamat" name="address" required />
        </div>

        <div className="flex flex-col my-2">
          <Label className="font-bold text-xs rounded-md my-2">
            Kota <span className="text-red-500 text-[16px]"> *</span>
          </Label>
          <Input placeholder="Kota" name="city" required />
        </div>

        <div className="flex flex-col my-2">
          <Label className="font-bold text-xs rounded-md my-2">
            Nomor Telepon <span className="text-red-500 text-[16px]"> *</span>
          </Label>
          <Input
            placeholder="Nomor telepon"
            name="phone"
            type="number"
            value={phone}
            maxLength={15}
            onChange={(e) => {
              const value = e.target.value;
              setPhone(value);
            }}
            className={noSpinner}
            min={0}
            required
          />
        </div>

        <div className="flex flex-col my-2">
          <Label className="font-bold text-xs rounded-md my-2">Fax</Label>
          <Input
            placeholder="Fax"
            name="fax"
            type="number"
            value={fax}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 15) {
                setFax(value);
              }
            }}
            min={0}
            className={noSpinner}
          />
        </div>

        <div className="flex flex-col my-2">
          <Label className="font-bold text-xs rounded-md my-2">
            Perusahaan Asal <span className="text-red-500 text-[16px]"> *</span>
          </Label>
          <Select name="companyName" onValueChange={handleCompanySelect}>
            <SelectTrigger className="outline-none">
              <SelectValue placeholder="Perusahaan Asal" />
            </SelectTrigger>
            <SelectContent>
              {companyName?.map((names, index) => (
                <SelectItem key={index} value={names.companyName}>
                  {names.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="companyId" value={selectedCompanyId} />
        </div>

        <div className="flex justify-end m-11">
          {loading ? (
            <Button type="submit" className="px-9" disabled>
              <Loader2 className="animate-spin" />
              Menyimpan...
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

export default AgentForm;
