"use client";
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PackageOpen, Printer } from "lucide-react";
import React, { useRef, useState } from "react";
import CetakPenyaluran from "./CetakPenyaluran";
import CetakPlastikWrap from "./CetakPlastikWrap";

const ConfirmCetak = ({ row, type }: any) => {
    const [id, setId] = useState(row.id);
    const [platKendaraan, setPlatKendaraan] = useState(row.licensePlate);
    const [namaSopir, setNamaSopir] = useState(row.driverName);
    const [namaSupervisor, setNamaSupervisor] = useState(row.superVisor);
    const [namaGateKeeper, setNamaGateKeeper] = useState(row.gateKeeper);
    const [namaAdministrasi, setNamaAdministrasi] = useState(row.administrasi);
    const [jumlahTabungBocor, setJumlahTabungBocor] = useState(row.bocor);
    const [isiKurang, setIsiKurang] = useState(row.isiKurang);

    return (
        <Dialog>
        <DialogTrigger>
            <Button
            variant="outline"
            className="text-center align-center justify-center w-1"
            >
            {type == "wrap" ?
                <PackageOpen
                className="h-4 w-4 text-center align-center text-green-500 cursor-pointer"
                aria-hidden="true" 
                />
                :
                <Printer
                    className="h-4 w-4 text-center align-center cursor-pointer"
                    style={{ color: "blue" }}
                    aria-hidden="true" 
                />
            }
            </Button>
        </DialogTrigger>
        <DialogContent>
            <div>
                <DialogHeader>
                <DialogTitle>Print Data</DialogTitle>
                <DialogDescription>
                    Apakah data sudah sesuai?
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-center">Plat Kendaraan</Label>
                    <Input
                        id="platKendaraan"
                        name="platKendaraan"
                        value={platKendaraan}
                        className="col-span-3 cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-center">Nama Sopir</Label>
                    <Input
                        id="namaSopir"
                        name="namaSopir"
                        value={namaSopir}
                        className="col-span-3 cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-center">GateKeeper</Label>
                    <Input
                        id="gateKeeper"
                        name="gateKeeper"
                        value={namaGateKeeper}
                        className="col-span-3 cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-center">Supervisor</Label>
                    <Input
                        id="superVisor"
                        name="superVisor"
                        value={namaSupervisor}
                        className="col-span-3 cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-center">Administrasi</Label>
                    <Input
                        id="administrasi"
                        name="administrasi"
                        value={namaAdministrasi}
                        className="col-span-3 cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-center">Tabung Bocor</Label>
                    <Input
                        id="jumlahTabungBocor"
                        name="jumlahTabungBocor"
                        value={jumlahTabungBocor}
                        className="col-span-3 cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        type="number"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-center">Isi Kurang</Label>
                    <Input
                        id="isiKurang"
                        name="isiKurang"
                        value={isiKurang}
                        className="col-span-3 cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        type="number"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Input
                        id="id"
                        name="id"
                        value={id}
                        className="col-span-3 hidden cursor-not-allowed outline outline-2 outline-gray-200 bg-gray-200 dark:outline-gray-600 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        readOnly
                    />
                </div>
                </div>
                <DialogFooter>
                <DialogClose asChild>
                    <Button asChild>
                        <PDFDownloadLink
                            className="text-center"
                            document={
                                type === 'wrap'
                                    ? <CetakPlastikWrap data={row} />
                                    : <CetakPenyaluran data={row} />
                            }
                            fileName={`Penyaluran Elpiji ${row.deliveryNumber}.pdf`}
                            aria-label={`Download Penyaluran Elpiji PDF for delivery number ${row.deliveryNumber}`}
                        >
                            {type === 'wrap' ?
                                'Download Plastik Wrap PDF'
                                :
                                'Download Penyaluran PDF'
                            }
                        </PDFDownloadLink>
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button>Kembali</Button>
                </DialogClose>
                </DialogFooter>
            </div>
        </DialogContent>
        </Dialog>
    );
};

export default ConfirmCetak;
