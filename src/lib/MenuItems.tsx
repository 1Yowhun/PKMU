import { ChartArea, Database, House, LucideIcon, Settings, User } from "lucide-react";
import { cookies } from "next/headers";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Analytics",
      menus: [
        {
          href: "/summary",
          label: "Summary",
          active: pathname === "/summary",
          icon: ChartArea,
        }
      ]
    }
    ,
    {
      groupLabel: "Dashboard",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: House,
          submenus: [
            {
              href: "/dashboard/alokasi-harian",
              label: "Alokasi Harian ",
              active: pathname === "/dashboard/alokasi-harian"
            },
            {
              href: "/dashboard/penyaluran-elpiji",
              label: "Penyaluran Elpiji",
              active: pathname === "/dashboard/penyaluran-elpiji",
            },
            {
              href: "/dashboard/alokasi-bulanan",
              label: "Alokasi Bulanan",
              active: pathname === "/dashboard/alokasi-bulanan",
            },
            // {
            //   href: "/dashboard/cetak-penyaluran",
            //   label: "Cetak Penyaluran",
            //   active: pathname === "/dashboard/cetak-penyaluran"
            // }
          ],
        },
      ],
    },
    {
      groupLabel: "Master Data",
      menus: [
        {
          href: "/master-data",
          label: "Master Data",
          active: pathname.includes("/master-data"),
          icon: Database,
          submenus: [
            {
              href: "/master-data/agents",
              label: "Agen",
              active: pathname === "/master-data/agents",
            },
            {
              href: "/master-data/companies",
              label: "Perusahaan",
              active: pathname === "/master-data/companies",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Setting",
      menus: [
        {
          href: "/setting",
          label: "Setting",
          active: pathname === "/setting",
          icon: Settings,
          submenus: [
            {
              href: "/setting/register",
              label: "Registrasi",
              active: pathname === "/setting/register",
            },
          ],
        },
      ],
    },
  ];
}
