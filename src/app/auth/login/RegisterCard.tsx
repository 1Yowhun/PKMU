"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
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

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignInValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    const res = await registerAction(values);
    if (res.error) {
      router.push("/auth/login");
      toast({
        variant: "destructive",
        title: "Gagal",
        description: res.error,
      });
    } else {
      router.push("/summary");
      toast({
        title: "Berhasill",
        description: "Register Berhasil"
      });
    }
  }

  return (
    <Card className="w-screen justify-center items-center max-w-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold flex justify-between">
          Welcome back!
          {/* <ToggleMode /> */}
        </CardTitle>
        <CardDescription className="text-gray-500">
          Sign Up your account to continue.
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
                      // className="max-w-lg"
                      placeholder="Enter your username..."
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative max-w-lg">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password..."
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
