"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { read, utils } from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { MonthlyAllocation, RawDataMapMonthly } from "@/lib/types";
import { uploadBulkExcelMonthly } from "@/app/actions/upload-file.action";
import { Loader } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

export default function UploadAlokasiBulanan({
  user,
}: {
  user: {
    id: string;
    username: string;
    role: string;
  };
}) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tableData, setTableData] = useState<MonthlyAllocation[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (!validTypes.includes(file.type)) {
        toast({
          title:
            "Jenis file tidak valid. Harap unggah file dengan format .xlsx atau .xls.",
          variant: "destructive",
        });
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSizeInBytes) {
        toast({
          title:
            "Ukuran file melebihi 2 MB. Harap unggah file yang lebih kecil.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      previewExcel(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const excelDateToJSDate = (serial: number) => {
    const excelStartDate = new Date(1900, 0, 1); // January 1, 1900
    const dateInMs =
      excelStartDate.getTime() + (serial - 1) * 24 * 60 * 60 * 1000;
    return new Date(dateInMs);
  };

  const previewExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName];

        const requiredColumns = [
          "Total_Elpiji",
          "Tanggal",
          "Volume_Total_Elpiji",
        ];
        const sheetHeaders: any = utils.sheet_to_json(workSheet, {
          header: 1,
        })[0];
        const missingColumns = requiredColumns.filter(
          (col) => !sheetHeaders.includes(col)
        );

        if (missingColumns.length > 0) {
          toast({
            title: `Kolom yang hilang: ${missingColumns.join(
              ", "
            )}. Harap periksa format file Anda.`,
            variant: "destructive",
          });
          return;
        }
        const json = utils.sheet_to_json(workSheet);
        const uploadedData = json as RawDataMapMonthly[];

        const transformedData = uploadedData.map((row) => {
          if (!row.Total_Elpiji || !row.Tanggal || !row.Volume_Total_Elpiji) {
            toast({
              title: "Gagal",
              description: "Data tidak valid, ada nilai yang kosong/undefiend.",
              variant: "destructive",
            });
          }
          return {
            date:
              typeof row.Tanggal === "number"
                ? excelDateToJSDate(row.Tanggal)
                : row.Tanggal,
            totalElpiji: row.Total_Elpiji,
            volume: row.Volume_Total_Elpiji,
            createdBy: user.id,
            updatedBy: user.id,
          };
        });

        setTableData(transformedData);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadExcel = async () => {
    setLoading(true);
    if (selectedFile && tableData.length > 0) {
      const result = await uploadBulkExcelMonthly(tableData);
      if (result?.error) {
        setLoading(false);
        toast({
          title: "Gagal",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setLoading(false);
        toast({
          title: "Berhasil",
          description: "Alokasi Bulanan berhasil ditambahkan",
        });
        router.push("/dashboard/alokasi-bulanan/");
      }
    } else {
      setLoading(false);
      toast({
        title:
          selectedFile == null
            ? "Harap pilih file untuk diunggah."
            : "Data tidak ditemukan. Harap periksa format file.",
        variant: "destructive",
      });
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
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Upload Excel
        </h1>
      </div>

      <div className="w-full max-w-md">
        <div>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center gap-4 w-full h-96 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                .xlsx, .xls
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
        </div>
        <div className="mt-4 flex justify-center">
          <Input
            disabled
            type="text"
            value={selectedFile ? selectedFile.name : "Upload File"}
            className="text-primary"
          />
          <Button
            onClick={tableData.length > 0 ? uploadExcel : triggerFileInput}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader className="mr-2 animate-spin" /> Uploading...
              </div>
            ) : tableData.length > 0 ? (
              "Upload"
            ) : (
              "Impor"
            )}
          </Button>
        </div>
      </div>

      {tableData.length > 0 && (
        <div className="mt-8 w-full">
          <h2 className="text-2xl font-semibold">Pratinjau Excel</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">Nomor</TableHead>
                <TableHead className="text-lg">Date</TableHead>
                <TableHead className="text-lg">Total</TableHead>
                <TableHead className="text-lg">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index} className="my-6">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {row.date instanceof Date
                      ? row.date.toLocaleDateString("en-GB") // "en-GB" for dd/mm/yyyy format
                      : new Date(row.date).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{row.totalElpiji}</TableCell>
                  <TableCell>{row.volume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
