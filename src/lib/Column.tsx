"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Allocation,
  Agents,
  Companies,
  LpgDistributions,
  MonthlyAllocation,
} from "@/lib/types";
import { PackageOpen, Printer, ShoppingBag, SquarePlus } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditFormAgents from "../components/FeatureComponents/CRUD/EditFormAgents";
import EditFormLpg from "@/components/FeatureComponents/CRUD/EditFormLpg";
import CetakPenyaluran from "@/components/FeatureComponents/CetakDistribusi/CetakPenyaluran";
import { formatDateTime } from "@/utils/page";
import { getCurrentSession } from "@/app/actions/auth.actions";
import CetakPlastikWrap from "@/components/FeatureComponents/CetakDistribusi/CetakPlastikWrap";
import { formatDate } from "date-fns";

export const lpgDistributionColumns: ColumnDef<LpgDistributions>[] = [
  {
    header: "Tindakan",
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-1">
          <Button
            variant="outline"
            asChild
            className="text-center align-center justify-center w-1"
            aria-hidden="false"
          >
            <PDFDownloadLink
              className="text-center"
              document={<CetakPenyaluran data={row.original} />}
              fileName={`Penyaluran Elpiji ${row.original.deliveryNumber}.pdf`}
              aria-label={`Download Penyaluran Elpiji PDF for delivery number ${row.original.deliveryNumber}`}
            >
              <Printer
                className="h-4 w-4 text-center align-center cursor-pointer"
                style={{ color: "blue" }}
                aria-hidden="true" 
              />
            </PDFDownloadLink>
          </Button>
          <EditFormLpg row={row.original} />
          <Button
            variant="outline"
            asChild
            className="text-center align-center justify-center w-1"
          >
            <PDFDownloadLink
              className="text-center"
              document={<CetakPlastikWrap data={row.original} />}
              fileName={`Plastik Wrap ${row.original.deliveryNumber}.pdf`}
              aria-label={`Download Plastik Wrap PDF for delivery number ${row.original.deliveryNumber}`}
            >
              <PackageOpen
                className="h-4 w-4 text-center align-center text-green-500 cursor-pointer"
                aria-hidden="true" 
              />
            </PDFDownloadLink>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "bpeNumber",
    header: "Nomor BPE",
    enableSorting: false,
  },
  {
    accessorKey: "giDate",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.giDate ? new Date(row.original.giDate) : null;
      return (
        <div className="flex-[1]">
          {date
            ? `${date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}`
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "agentName",
    header: "Nama Agen",
  },
  {
    accessorKey: "licensePlate",
    header: "Nomor Plat",
    enableSorting: false,
  },
  {
    accessorKey: "deliveryNumber",
    header: "Nomor DO",
    enableSorting: false,
  },
  {
    accessorKey: "allocatedQty",
    header: "Jumlah Alokasi",
  },
  {
    accessorKey: "distributionQty",
    header: "Jumlah Tabung",
  },
  {
    accessorKey: "volume",
    header: "Volume Tabung",
    enableSorting: false,
  },
  {
    accessorKey: "updatedAt",
    header: "Diperbarui",
    sortingFn: "datetime",
    sortDescFirst: true,
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
];

export const allocationColumns: ColumnDef<Allocation>[] = [
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={status == "Pending" ? "text-orange-500" : "text-lime-500"}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryNumber",
    header: "Nomer DO",
    enableSorting: false,
  },
  {
    accessorKey: "shipTo",
    header: "Ship To",
    enableSorting: false,
  },
  {
    accessorKey: "agentName",
    header: "Nama Agen",
  },
  {
    accessorKey: "materialName",
    header: "Nama Material",
    enableSorting: false,
  },
  {
    accessorKey: "allocatedQty",
    header: "Jumlah Alokasi",
  },
  {
    accessorKey: "plannedGiDate",
    header: "Planned GI Date",
    cell: ({ row }) => {
      const date = row.original.plannedGiDate
        ? new Date(row.original.plannedGiDate)
        : null;
      return (
        <div className="flex-[1]">
          {date
            ? `${date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}`
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "giDate",
    header: "GI Date",
    cell: ({ row }) => {
      const date = row.original.giDate ? new Date(row.original.giDate) : null;
      return (
        <div className="flex-[1]">
          {date
            ? `${date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}`
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "bpeNumber",
    header: "Nomer BPE",
    enableSorting: false,
    cell: ({ row }) => {
      const bpe = row.original.bpeNumber;
      return <>{bpe ? bpe : "-"}</>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diperbarui",
    size: 1,
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(), // Format tanggal
  // },
];

export const adminAllocationColumns: ColumnDef<Allocation>[] = [
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={status == "Pending" ? "text-orange-500" : "text-lime-500"}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryNumber",
    header: "Nomer DO",
    enableSorting: false,
  },
  {
    accessorKey: "shipTo",
    header: "Ship To",
    enableSorting: false,
  },
  {
    accessorKey: "agentName",
    header: "Nama Agen",
    enableSorting: false,
  },
  {
    accessorKey: "materialName",
    header: "Nama Material",
    enableSorting: false,
  },
  {
    accessorKey: "allocatedQty",
    header: "Jumlah Alokasi",
  },
  {
    accessorKey: "plannedGiDate",
    header: "Planned GI Date",
    cell: ({ row }) => {
      const date = row.original.plannedGiDate
        ? new Date(row.original.plannedGiDate)
        : null;
      return (
        <div className="flex-[1]">
          {date
            ? `${date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}`
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "giDate",
    header: "GI Date",
    cell: ({ row }) => {
      const date = row.original.giDate ? new Date(row.original.giDate) : null;
      return (
        <div className="flex-[1]">
          {date
            ? `${date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}`
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "bpeNumber",
    header: "Nomer BPE",
    enableSorting: false,
    cell: ({ row }) => {
      const bpe = row.original.bpeNumber;
      return <>{bpe ? bpe : "-"}</>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diperbarui",
    size: 1,
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
  {
    header: "Tindakan",
    enableHiding: false,
    cell: ({ row }) => {
      const bpeNumber = row.original.bpeNumber;
      const status = row.original.status;
      const giDate = row.original.giDate;

      return (
        <Button variant="outline" disabled={status === "Approved" && bpeNumber !== null && giDate !== null}>
          <Link
            href={`penyaluran-elpiji/form?query=${row.original.deliveryNumber}`}
            className={
              status === "Approved" && bpeNumber !== null && giDate !== null ? "cursor-not-allowed" : ""
            }
          >
            <SquarePlus className="h-4 w-4" />
          </Link>
        </Button>
      );
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(), // Format tanggal
  // },
];

export const monthlyAllocationColumns: ColumnDef<MonthlyAllocation>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    sortDescFirst: false,
    cell: ({ row }) => {
      const date = row.original.date
      return (
        <div>{formatDateTime(date)}</div>
      );
    },
  },
  {
    accessorKey: "totalElpiji",
    header: "Jumlah",
    enableSorting: false,
    size: 3,
    cell: ({ row }) => {
      return <div className="flex-[3]">{row.original.totalElpiji}</div>;
    },
  },
  {
    accessorKey: "volume",
    header: "Total Volume",
    enableSorting: false,
    size: 3,
    cell: ({ row }) => {
      return <div className="flex-[3]">{row.original.totalElpiji * 3}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diperbarui",
    enableSorting: false,
    size: 1,
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
];

export const agentColumns: ColumnDef<Agents>[] = [
  {
    accessorKey: "agentName",
    header: "Nama Agen",
  },
  {
    accessorKey: "address",
    header: "Alamat",
    enableSorting: false,

  },
  {
    accessorKey: "city",
    header: "Kota",
    enableSorting: false,
  },
  {
    accessorKey: "phone",
    header: "No HP",
    enableSorting: false,
  },
  {
    accessorKey: "fax",
    header: "Fax",
    enableSorting: false,
  },
  {
    accessorKey: "companyName",
    header: "Nama Perusahaan",
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    enableSorting: false,
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diperbarui",
    enableSorting: false,
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
];

export const adminAgentColumns: ColumnDef<Agents>[] = [
  {
    accessorKey: "Tindakan",
    enableSorting: false,
    cell: ({ row }) => {
      return <EditFormAgents row={row.original} />;
    },
  },
  {
    accessorKey: "agentName",
    header: "Nama Agen",
  },
  {
    accessorKey: "address",
    header: "Alamat",
    enableSorting: false,
  },
  {
    accessorKey: "city",
    header: "Kota",
    enableSorting: false,
  },
  {
    accessorKey: "phone",
    header: "No HP",
    enableSorting: false,
  },
  {
    accessorKey: "fax",
    header: "Fax",
    enableSorting: false,
  },
  {
    accessorKey: "companyName",
    header: "Nama Perusahaan",
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    enableSorting: false,
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diperbarui",
    enableSorting: false,
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
];

export const companiesColumns: ColumnDef<Companies>[] = [
  {
    accessorKey: "companyName",
    header: "Nama Perusahaan",
  },
  {
    accessorKey: "address",
    header: "Alamat",
    enableSorting: false,
  },
  {
    accessorKey: "telephone",
    header: "No HP",
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    enableSorting: false,
    size: 1,
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diperbarui",
    enableSorting: false,
    size: 1,
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <div>{formatDateTime(date)}</div>;
    },
  },
];

export const Role = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];
