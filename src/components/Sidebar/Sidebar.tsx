"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { useStore } from "zustand";
import { cn } from "@/lib/utils";
import { SidebarToggle } from "./SidebarToggle";
import { Button } from "../ui/button";
import { Menu } from "./Menu";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar({}) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const pathname = usePathname();

  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  const updateSelectedKey = (key: string) => {
    setSelectedKeys([key]);
    localStorage.setItem("selectedKey", key);
  };

  useEffect(() => {
    if (pathname === "/dashboard/alokasi-harian") {
      setSelectedKeys(["2"]);
    } else if (pathname === "/dashboard/penyaluran-elpiji") {
      setSelectedKeys(["3"]);
    } else if (pathname === "/dashboard/alokasi-bulanan") {
      setSelectedKeys(["4"]);
    } else if (pathname === "/dashboard/cetak-penyaluran") {
      setSelectedKeys(["5"]);
    } else if (pathname === "/master-data/agents") {
      setSelectedKeys(["6"]);
    } else if (pathname === "/master-data/companies") {
      setSelectedKeys(["7"]);
    } else if (pathname === "/register") {
      updateSelectedKey("8");
    } else if (pathname === "/summary") {
      updateSelectedKey("9");
    } else if (pathname === "/dashboard/Rekap") {
      updateSelectedKey("10");
    }
    // TODO
    // if (userRole === "admin" && pathname === "/register") {
    //   updateSelectedKey("8");
    // }
  }, [pathname]);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      {/* bg-slate-300 dark:bg-slate-800 */}
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 ">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link
            href="/dashboard/alokasi-harian"
            className="flex items-center gap-2"
          >
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-500",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              <Image src="/icon.svg" width={100} height={100} alt="ini icon" />
            </h1>
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
