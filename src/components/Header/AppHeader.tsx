import Link from "next/link";
import { SheetMenu } from "../Sidebar/SheetMenu";
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Breadcrumb,
} from "../ui/breadcrumb";
import { ToggleMode } from "../ToggleMode";
import React from "react";
import { toNormalCase } from "@/utils/page";
import { Avatar, AvatarImage } from "../ui/avatar";
import { CircleUserRound } from "lucide-react";
import { Profile } from "./Profile";
import { getCurrentSession } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";

interface HeaderProps {
  home: string;
  mainpage?: string;
  childpage?: string;
  childrenpage?: string;
}

export default async function AppHeader({
  home,
  mainpage,
  childpage,
  childrenpage,
}: HeaderProps) {
  const { user } = await getCurrentSession();
  const name = user?.username;
  if (!name) redirect("/auth/login");

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />

          <Breadcrumb>
            <BreadcrumbList>
              {/* Home breadcrumb */}
              <BreadcrumbItem>
                {/* <BreadcrumbLink>
                  <Link href={`/${home}/${mainpage}`}>{toNormalCase(home)}</Link>
                </BreadcrumbLink> */}
                <BreadcrumbPage className={"text-inherit"}>
                  {toNormalCase(home)}
                </BreadcrumbPage>
              </BreadcrumbItem>

              {/* Current page breadcrumb */}
              {mainpage && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {childpage ? (
                      <BreadcrumbLink>
                        <Link href={`/${home}/${mainpage}`}>
                          {toNormalCase(mainpage)}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{toNormalCase(mainpage)}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </>
              )}

              {/* Child page breadcrumb (if exists) */}
              {childpage && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {childrenpage ? (
                      <BreadcrumbLink>
                        <Link href={`/${home}/${mainpage}/${childpage}`}>
                          {toNormalCase(childpage)}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{toNormalCase(childpage)}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </>
              )}

              {/* Children page breadcrumb (if exists) */}
              {childrenpage && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{childrenpage}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-1 items-center justify-end gap-5">
          {/* <ToggleMode /> */}
          <Profile name={name} />
        </div>
      </div>
    </header>
  );
}
