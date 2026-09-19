import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import { getCurrentSession } from "./actions/auth.actions";
import { redirect } from "next/navigation";
import { getCompaniesImage } from "./actions/companies.action";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SPBE",
  icons: [{ rel: "icon", url: "/favicon.ico", type: "image/x-icon" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const dataUser = await getCurrentSession();
  const image = await getCompaniesImage(dataUser.user?.companiesId!);
  // if (!dataUser?.session || !dataUser?.user) {
  //   redirect("/auth/login");
  // }

  return (
    <html lang="en" className="light">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar user={dataUser.user} image={image[0].imageUrl} />
          <main className="w-full">
            <SidebarTrigger className="h-20 w-20" />
            {children}
          </main>
        </SidebarProvider>
        <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
