"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SignInValues } from "@/lib/types";
import { registerAction } from "@/app/actions/auth.actions";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToggleMode } from "@/components/ToggleMode";
import { getCompaniesMetaData } from "@/app/actions/companies.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState<any>();
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);

  const form = useForm<SignInValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleCompanySelect = (value: string) => {
    const selectedCompany = companies?.find(
      (company: any) => company.companyName === value
    );
    setSelectedCompanyId(Number(selectedCompany?.id) || 0);
  };

  const handlePrepareCompany = async () => {
    const result = await getCompaniesMetaData();
    setCompanies(result);
  };

  useEffect(() => {
    handlePrepareCompany();
  }, []);

  // async function onSubmit(values: SignInValues) {

  // const res = await registerAction(values);
  // if (res.error) {
  //   router.push("/auth/login");
  //   toast({
  //     variant: "destructive",
  //     title: "Gagal",
  //     description: res.error,
  //     duration: 3000,
  //   });
  // } else {
  //   router.push("/summary");
  //   toast({
  //     title: "Berhasill",
  //     duration: 3000,
  //     description: "Register Berhasil",
  //   });
  // }
  // }

  async function onSubmit(values: SignInValues) {
    const payload = {
      ...values,
      companyId: selectedCompanyId,
    };

    const res = await registerAction(payload);
    if (res.error) {
      router.push("/auth/login");
      toast({
        variant: "destructive",
        title: "Gagal",
        description: res.error,
        duration: 3000,
      });
    } else {
      router.push("/summary");
      toast({
        title: "Berhasil",
        duration: 3000,
        description: "Register Berhasil",
      });
    }
  }

  return (
    <Card className="w-screen justify-center items-center max-w-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold mr-2">
            Selamat Datang Kembali!
          </CardTitle>
          <div className="w-20 h-20 items-center justify-center rounded flex flex-row pe-4">
            <Image
              src="/assets/logo/pkmu.svg"
              width={60}
              height={60}
              alt="Icon PKMU"
            />
            <Image
              src="/assets/logo/smg.svg"
              width={70}
              height={70}
              alt="Icon SMG"
            />
          </div>
        </div>
        <CardDescription className="text-gray-500">
          Masuk ke akun Anda untuk melanjutkan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Masukan username..."
                      {...field}
                      className="focus:border-primary focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative max-w-lg">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukan password..."
                        {...field}
                      />
                      {/* Eye Icon Button */}
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Select onValueChange={handleCompanySelect}>
              <SelectTrigger className="outline-none">
                <SelectValue placeholder="Perusahaan Asal" />
              </SelectTrigger>
              <SelectContent>
                {companies?.map((company: any) => (
                  <SelectItem key={company.id} value={company.companyName}>
                    {company.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="companyId" value={selectedCompanyId} />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isLoading}
            >
              Register
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 px-3 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
