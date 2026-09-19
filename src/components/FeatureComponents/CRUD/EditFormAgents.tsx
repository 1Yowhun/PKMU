"use client";
import { updateAgentData } from "@/app/actions/agent.action";
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
import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const EditFormAgents = ({ row }: any) => {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [agentName, setAgentName] = useState(row.agentName);
  const [phone, setPhone] = useState(row.phone);
  const [fax, setFax] = useState(row.fax);
  const [address, setAddress] = useState(row.address);
  const [city, setCity] = useState(row.city);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditAgent = async (formData: FormData) => {
    try {
      setLoading(true);
      const result = await updateAgentData(formData);

      if (result?.error) {
        toast({
          title: "Gagal",
          description: result.error,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        ref.current?.reset();
        toast({
          title: "Berhasil",
          description: "Agent berhasil diupdate",
          duration: 3000,
        });
        router.push("/master-data/agents");
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui agent",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const noSpinner =
    "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const resetFormState = () => {
    setAgentName(row.agentName);
    setAddress(row.address);
    setCity(row.city);
    setPhone(row.phone);
    setFax(row.fax);
  };

  const handleCancel = (e: React.MouseEvent) => {
    if (
      agentName !== row.agentName ||
      address !== row.address ||
      city !== row.city ||
      fax !== row.fax ||
      phone !== row.phone
    ) {
      const confirmClose = confirm(
        "Perubahan belum disimpan. Apakah Anda yakin ingin keluar?"
      );
      if (!confirmClose) {
        e.preventDefault();
      } else {
        resetFormState();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetFormState();
        }
      }}
    >
      <DialogTrigger asChild>
        <span>
          <Button
            variant="outline"
            className="text-center align-center justify-center"
          >
            <Pencil
              className="h-4 w-4 text-center align-center cursor-pointer"
              style={{ color: "orange" }}
              aria-label="Edit"
            />
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
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
                <Label className="text-center">
                  Nama Agen <span className="text-red-500 text-[16px]"> *</span>
                </Label>
                <Input
                  id="agentName"
                  name="agentName"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value.toUpperCase())}
                  className="col-span-3"
                  required={true}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">
                  Nomor Telepon{" "}
                  <span className="text-red-500 text-[16px]"> *</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={phone}
                  type="number"
                  className={`${noSpinner} col-span-3`}
                  required={true}
                  maxLength={15}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPhone(value);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">Fax</Label>
                <Input
                  id="fax"
                  name="fax"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">
                  Alamat <span className="text-red-500 text-[16px]"> *</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value.toUpperCase())}
                  className="col-span-3"
                  required={true}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">
                  Kota <span className="text-red-500 text-[16px]"> *</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value.toUpperCase())}
                  className="col-span-3"
                  required={true}
                />
                <Input
                  id="city"
                  name="agentId"
                  value={row.id}
                  onChange={(e) => setCity(e.target.value)}
                  className="col-span-3 hidden"
                  readOnly
                  required={true}
                />
              </div>
            </div>
            <DialogFooter>
              {loading ? (
                <Button type="button" className="px-9" disabled>
                  <Loader2 className="animate-spin mr-2" />
                  Menyimpan...
                </Button>
              ) : (
                <Button type="submit">Simpan Perubahan</Button>
              )}
              <DialogClose asChild>
                <Button onClick={handleCancel}>Kembali</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFormAgents;
