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
import { format } from "date-fns";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { LpgDistributionSearch } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { postLpgData } from "@/app/actions/lpg-distribution.action";
import { useFormStatus } from "react-dom";
import { postCompaniesData } from "@/app/actions/companies.action";
import { postAgentData } from "@/app/actions/agent.action";

interface Props {
  page: string;
  data?: LpgDistributionSearch[];
  companyName?: { id: number; companyName: string }[];
  bpe?: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

const Form = ({ page, data, companyName, bpe, user }: Props) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");

  const handleCompanySelect = (value: any) => {
    const selectedCompany = companyName?.find(
      (company) => company.companyName === value
    );
    setSelectedCompanyId(Number(selectedCompany?.id) || 0);
  };

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(term);
    const params = new URLSearchParams(searchParams);
    term ? params.set("query", term) : params.delete("query");
    replace(`${pathName}?${params.toString()}`);
  }, 400);

  const ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const { pending } = useFormStatus();
  const nonReq =
    "cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300";
  const noSpinner = "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const handleSubmitDistribution = async (formData: FormData) => {
    setLoading(true);
    const result = await postLpgData(formData);
    if (result?.error) {
      setLoading(false);
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setLoading(false);
      ref.current?.reset();
      toast({
        title: "Berhasil",
        description: "Distribusi elpiji berhasil ditambahkan",
      });
      redirect("/dashboard/penyaluran-elpiji");
    }
  };

  const handleSubmitAgents = async (formData: FormData) => {
    setLoading(true);
    const result = await postAgentData(formData);

    if (result?.error) {
      setLoading(false);
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setLoading(false);
      ref.current?.reset();
      toast({
        title: "Berhasil",
        description: "Agen berhasil ditambahkan",
      });
      redirect("/master-data/agents");
    }
  };

  const handleSubmitCompany = async (formData: FormData) => {
    setLoading(true);
    const result = await postCompaniesData(formData);
    if (result?.error) {
      setLoading(false);
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setLoading(false);
      ref.current?.reset();
      toast({
        title: "Berhasil",
        description: "Perusahaan berhasil ditambahkan",
      });
      redirect("/master-data/companies");
    }
  };

  if (user.role != "ADMIN") {
    toast({
      variant: "destructive",
      title: "Hanya admin yang bisa akses",
    });
    redirect("/dashboard/penyaluran-elpiji");
  }

  return (
    <>
      {page === "distribution" && (
        <div>
          <form
            ref={ref}
            action={async (formData) => {
              await handleSubmitDistribution(formData);
            }}
          >
            <div className="grid grid-cols-2 gap-6 p-9">
              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">
                  Nomor Transaksi
                </Label>
                <Input
                  className={nonReq}
                  placeholder="Nomor Transaksi bpe-bbyy-autoinc"
                  name="nomorTransaksi"
                  value={bpe}
                  readOnly
                />
              </div>
              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">Nomor DO  <span className="text-red-500 text-[16px]">*</span></Label>
                <div className="flex">
                  <Input
                    placeholder="Nomor DO"
                    type="text"
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                    defaultValue={searchParams.get("query")?.toString()}
                    name="nomorDo"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">Nama Agen</Label>
                <Input
                  className={nonReq}
                  placeholder="Nama agen"
                  name="namaAgen"
                  value={data && data.length > 0 ? data[0].agentName : ""}
                  readOnly
                />
              </div>

              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">
                  Waktu Pengambilan
                </Label>
                <Input
                  className={nonReq}
                  placeholder="Waktu pengambilan"
                  name="waktuPengambilan"
                  value={format(new Date(), "yyyy-MM-dd")}
                  readOnly
                />
              </div>

              <div className="flex flex-col my-2">
              <Label className="font-bold text-xs my-2">
                Plat Kendaraan <span className="text-red-500 text-[16px]">*</span>
              </Label>
                <Input placeholder="Plat kendaraan" name="platKendaraan" required/>
              </div>

              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">Nama Sopir <span className="text-red-500 text-[16px]">*</span></Label>
                <Input placeholder="Nama sopir" name="namaSopir" required />
              </div>

              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">Status</Label>
                <Select name="status" defaultValue="Approved">
                  <SelectTrigger className="outline-none">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">Jumlah Tabung</Label>
                <Input
                  type="number"
                  className={nonReq}
                  placeholder="Jumlah tabung"
                  name="jumlahTabung"
                  value={data && data.length > 0 ? data[0].allocatedQty : ""}
                  readOnly 
                />
              </div>

              <div className="hidden my-2">
                <Label className="font-bold text-xs my-2">Id alokasi</Label>
                <Input
                  type="number"
                  className={nonReq}
                  placeholder="alokasi id"
                  name="allocationid"
                  value={data && data.length > 0 ? data[0].id : ""}
                  readOnly
                />
              </div>

              <div className="hidden my-2">
                <Label className="font-bold text-xs my-2">Ship To</Label>
                <Input
                  type="number"
                  className={nonReq}
                  placeholder="shipTo"
                  name="shipTo"
                  value={data && data.length > 0 ? data[0].shipTo.trim() : ""}
                  readOnly
                />
              </div>

              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">Volume Tabung</Label>
                <Input
                  type="number"
                  className={nonReq}
                  placeholder="Volume tabung"
                  name="volumeTabung"
                  value={
                    data && data.length > 0 ? data[0].allocatedQty * 3 : ""
                  }
                  readOnly
                />
              </div>

              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">
                  Jumlah Tabung Bocor
                </Label>
                <Input
                  placeholder="Jumlah tabung bocor"
                  name="jumlahTabungBocor"
                  type="number"
                  defaultValue="0" min="0" 
                />
              </div>

              <div className="flex flex-col my-2">
                <Label className="font-bold text-xs my-2">Isi Kurang</Label>
                <Input 
                  placeholder="Isi kurang" 
                  name="isiKurang"
                  defaultValue="0" min="0" 
                  type="number"
                />
              </div>
            </div>

            <div className="flex justify-end px-11 pb-11">
              <Button type="submit" className="mx-9 px-9" disabled={loading}>
                {pending ? "Menambahkan.. " : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {page === "agents" && (
        <div>
          <form className="grid mx-6" action={handleSubmitAgents}>
            <div className="flex flex-col my-2 mt-6">
              <Label className="font-bold text-xs rounded-md my-2">Nama <span className="text-red-500 text-[16px]"> *</span>
              </Label>
              <Input placeholder="Nama" name="agentName" required/>
            </div>

            <div className="flex flex-col my-2">
              <Label className="font-bold text-xs rounded-md my-2">
                Alamat <span className="text-red-500 text-[16px]"> *</span>
              </Label>
              <Input placeholder="Alamat" name="address" required/>
            </div>

            <div className="flex flex-col my-2">
              <Label className="font-bold text-xs rounded-md my-2">Kota <span className="text-red-500 text-[16px]"> *</span>
              </Label>
              <Input placeholder="Kota" name="city" required/>
            </div>

            <div className="flex flex-col my-2">
              <Label className="font-bold text-xs rounded-md my-2">
                Nomor Telepon <span className="text-red-500 text-[16px]"> *</span>
              </Label>
              <Input placeholder="Nomor telepon" 
                name="phone" 
                type="number" 
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 12) {
                    setPhone(value);
                  }
                }}
                className={noSpinner}
                min={0}
              required/>
            </div>

            <div className="flex flex-col my-2">
              <Label className="font-bold text-xs rounded-md my-2">Fax 
              </Label>
              <Input placeholder="Fax" 
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
                className={noSpinner}/>
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
                  {companyName?.map((names) => (
                    <SelectItem key={names.id} value={names.companyName}>
                      {names.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="companyId" value={selectedCompanyId} />
            </div>

            <div className="flex justify-end m-11">
              <Button type="submit" className="px-9">
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}

      {page === "companies" && (
        <div>
          <form className="grid mx-6 my-2" action={handleSubmitCompany}>
            <div className="flex flex-col mt-6">
              <Label className="font-bold text-s my-2">Nama Perusahaan <span className="text-red-500 text-[16px]"> *</span></Label>
              <Input placeholder="Nama perusahaan" name="companyName" required/>
            </div>

            <div className="flex flex-col my-2">
              <Label className="font-bold text-s my-2">Alamat <span className="text-red-500 text-[16px]"> *</span></Label>
              <Input placeholder="Alamat" name="address" required/>
            </div>

            <div className="flex flex-col my-2">
              <Label className="font-bold text-s my-2">Nomor Telepon <span className="text-red-500 text-[16px]"> *</span></Label>
              <Input placeholder="Nomor telepon" 
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
                required/>
            </div>

            <div className="flex justify-end m-11">
              <Button type="submit" className="px-9">
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Form;
