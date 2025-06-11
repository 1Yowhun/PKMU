import { ChartArea, Database, House } from "lucide-react";

export const sidebarItems = {
  summary: [
    {
      name: "Summary",
      url: "/summary",
      icon: ChartArea,
    },
  ],
  dashboard: [
    {
      title: "Dashboard",
      url: "/dashboard/penyaluran-elpiji",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Alokasi Harian",
          url: "/dashboard/alokasi-harian",
        },
        {
          title: "Penyaluran Elpiji",
          url: "/dashboard/penyaluran-elpiji",
        },
        {
          title: "Alokasi Bulanan",
          url: "/dashboard/alokasi-bulanan",
        },
        {
          title: "Rekap Penyaluran",
          url: "/dashboard/download-rekap",
        },
        // 3 DIBAWAH HANYA KHUSUS DEV, ELSE COMMENT
        // {
        //   title: "ALOKASI BE",
        //   url: "/dashboard/alokasi-harian/test-be",
        // },
        // {
        //   title: "PENYALURAN BE",
        //   url: "/dashboard/penyaluran-elpiji-be",
        // },
      ],
    },
  ],
  masterData: [
    {
      title: "Master Data",
      url: "/master-data/agents",
      icon: Database,
      isActive: true,
      items: [
        {
          title: "Agen",
          url: "/master-data/agents",
        },
        {
          title: "Perusahaan",
          url: "/master-data/companies",
        },
        {
          title: "Registrasi",
          url: "/setting/register",
        },
      ],
    },
  ],
};
