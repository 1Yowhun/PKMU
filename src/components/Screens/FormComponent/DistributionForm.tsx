"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { postLpgData } from "@/app/actions/lpg-distribution.action";
import { FormSubmit } from "@/lib/types";
import { format } from "date-fns";
import { DatePick } from "@/components/FeatureComponents/DatePick";
import { id } from "date-fns/locale";

const DistributionForm = ({ data, bpe, user }: FormSubmit) => {
  const [date, setDate] = useState<any>(new Date());
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLFormElement>(null);

  const nonReq =
    "cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300";

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    term ? params.set("query", term) : params.delete("query");
    replace(`${pathName}?${params.toString()}`);
  }, 400);

  const handleSubmitDistribution = async (formData: FormData) => {
    setLoading(true);
    formData.set("waktuPengambilan", date);
    const result = await postLpgData(formData);
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
        description: "Distribusi elpiji berhasil ditambahkan",
        duration: 3000,
      });
      redirect("/dashboard/penyaluran-elpiji");
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
    <div className="bg-white">
      <form
        ref={ref}
        action={async (formData) => {
          await handleSubmitDistribution(formData);
        }}
      >
        <div className="grid grid-cols-2 gap-6 p-9">
          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">Nomor Transaksi</Label>
            <Input
              className={nonReq}
              placeholder="Nomor Transaksi bpe-bbyy-autoinc"
              name="nomorTransaksi"
              value={bpe}
              readOnly
            />
          </div>
          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">
              Nomor DO <span className="text-red-500 text-[16px]">*</span>
            </Label>
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
              Waktu Pengambilan{" "}
              <span className="text-red-500 text-[16px]">*</span>
            </Label>
            {/* <Input
                    className={nonReq}
                    placeholder="Waktu pengambilan"
                    name="waktuPengambilan"
                    value={format(new Date(), "yyyy-MM-dd")}
                    required
                /> */}
            <DatePick
              value={date}
              onDateChange={setDate}
              placeholder={format(new Date(), "dd MMMM yyyy", { locale: id })}
            />
          </div>

          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">
              Plat Kendaraan <span className="text-red-500 text-[16px]">*</span>
            </Label>
            <Input placeholder="Plat kendaraan" name="platKendaraan" required />
          </div>

          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">
              Nama Sopir <span className="text-red-500 text-[16px]">*</span>
            </Label>
            <Input placeholder="Nama sopir" name="namaSopir" required />
          </div>

          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">Status</Label>
            <Input
              className={nonReq}
              placeholder="Status"
              name="status"
              value="Approved"
              readOnly
            />
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
              value={data && data.length > 0 ? data[0].allocatedQty * 3 : ""}
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
              defaultValue="0"
              min="0"
            />
          </div>

          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">Isi Kurang</Label>
            <Input
              placeholder="Isi kurang"
              name="isiKurang"
              defaultValue="0"
              min="0"
              type="number"
            />
          </div>

          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">Supervisor</Label>
            <Input placeholder="Supervisor" name="superVisor" type="text" />
          </div>

          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">Gate Keeper</Label>
            <Input placeholder="Gate Keeper" name="gateKeeper" type="text" />
          </div>

          <div className="flex flex-col my-2">
            <Label className="font-bold text-xs my-2">Administrasi</Label>
            <Input placeholder="Administrasi" name="administrasi" type="text" />
          </div>
        </div>

        <div className="flex justify-end m-11">
          {loading ? (
            <Button type="submit" className="px-9" disabled>
              <Loader2 className="animate-spin" />
              Loading...
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

export default DistributionForm;
