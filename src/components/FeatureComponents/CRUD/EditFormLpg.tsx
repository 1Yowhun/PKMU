"use client";
import { UpdateLpgData } from "@/app/actions/lpg-distribution.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import React, { useRef, useState } from "react";
import {redirect} from "next/navigation";

const EditFormLpg = ({ row }: any) => {
  const ref = useRef<HTMLFormElement>(null);
  const [id, setId] = useState(row.id);
  const [platKendaraan, setPlatKendaraan] = useState(row.licensePlate);
  const [namaSopir, setNamaSopir] = useState(row.driverName);
  const [jumlahTabungBocor, setJumlahTabungBocor] = useState(row.bocor);
  const [isiKurang, setIsiKurang] = useState(row.isiKurang);

  const handleEditAgent = async (formData: FormData) => {
    if (!platKendaraan || !namaSopir) {
      toast({
        title: "Gagal",
        description: "Ada field yang kosong",
        variant: "destructive",
      });
      return;
    }

    const result = await UpdateLpgData(formData);

    if (result?.error) {
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
      });
    } else {
      ref.current?.reset();
      toast({
        title: "Berhasil",
        description: "Penyaluran Lpg berhasil diupdate",
      });
      redirect("/dashboard/penyaluran-elpiji");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          className="text-center align-center justify-center w-1"
        >
          <Pencil className="h-4 w-4 text-center align-center cursor-pointer" style={{color:"orange"}} aria-label="Edit"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          ref={ref}
          action={async (formData) => {
            await handleEditAgent(formData);
          }}
        >
          <div>
            <DialogHeader>
              <DialogTitle>Edit Data</DialogTitle>
              <DialogDescription>
                Klik simpan apabila telah melakukan perubahan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">Plat Kendaraan</Label>
                <Input
                  id="platKendaraan"
                  name="platKendaraan"
                  value={platKendaraan}
                  onChange={(e) => setPlatKendaraan(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">Nama Sopir</Label>
                <Input
                  id="namaSopir"
                  name="namaSopir"
                  value={namaSopir}
                  onChange={(e) => setNamaSopir(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">Tabung Bocor</Label>
                <Input
                  id="jumlahTabungBocor"
                  name="jumlahTabungBocor"
                  value={jumlahTabungBocor}
                  onChange={(e) => setJumlahTabungBocor(e.target.value)}
                  className="col-span-3"
                  defaultValue="" min="0" 
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">Isi Kurang</Label>
                <Input
                  id="isiKurang"
                  name="isiKurang"
                  value={isiKurang}
                  onChange={(e) => setIsiKurang(e.target.value)}
                  className="col-span-3"
                  defaultValue="" min="0" 
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="id"
                  name="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="col-span-3 hidden"
                  readOnly
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Kembali</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFormLpg;
