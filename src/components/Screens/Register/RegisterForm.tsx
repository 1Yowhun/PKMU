"use client";
import { EyeOff, Eye, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { onlyRegister } from "@/app/actions/auth.actions";
import { toast } from "@/hooks/use-toast";
import { SignInValues } from "@/lib/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCompaniesMetaData } from "@/app/actions/companies.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register = ({ role }: { role?: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState<any>();
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);

  const form = useForm<SignInValues>({
    defaultValues: {
      username: "",
      password: "",
      role: "",
      company: "",
    },
  });

  const roleOptions = [
    { value: "ADMIN", label: "ADMIN" },
    { value: "USER", label: "USER" },
  ];

  const companyOptions = [
    { value: 1, label: "PT. Puri Kencana Merdeka Utama" },
    { value: 2, label: "PT. Satya Mitra Gas" },
  ];

  useEffect(() => {
    handlePrepareCompany();
  }, []);

  const handlePrepareCompany = async () => {
    const result = await getCompaniesMetaData();
    setCompanies(result);
  };

  async function onSubmit(values: SignInValues) {
    const payload = {
      ...values,
      companyId: selectedCompanyId,
    };

    setIsLoading(true);
    console.log("Payload:", payload);
    const res = await onlyRegister(payload);
    console.log("Response:", res);
    if (res.error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: res.error,
        duration: 3000,
      });
    } else {
      setIsLoading(false);
      router.push("/dashboard/penyaluran-elpiji");
      toast({
        title: "Registrasi berhasil",
        duration: 3000,
      });
    }
  }

  if (role !== "ADMIN") {
    toast({
      variant: "destructive",
      title: "Hanya admin yang bisa mengakses halaman ini",
      duration: 3000,
    });
    redirect("/dashboard/penyaluran-elpiji");
  }

  return (
    <div className="flex w-full h-auto">
      <Card className="p-6 m-6 justify-center items-center w-full">
        <CardHeader>
          <CardTitle className="text-xl">Form Registrasi Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nama Pengguna</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nama pengguna..."
                            {...field}
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
                      <FormItem className="flex-1">
                        <FormLabel>Kata Sandi</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Masukkan kata sandi..."
                              {...field}
                            />
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
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Peran</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih peran" />
                            </SelectTrigger>
                            <SelectContent>
                              {roleOptions.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Perusahaan</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = companies?.find(
                                (c: any) => c.companyName === value
                              );
                              setSelectedCompanyId(selected?.id || 0);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih perusahaan" />
                            </SelectTrigger>
                            <SelectContent>
                              {companyOptions.map((company) => (
                                <SelectItem
                                  key={company.value}
                                  value={String(company.label)}
                                >
                                  {company.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="self-end w-full md:w-auto"
              >
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Daftar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
