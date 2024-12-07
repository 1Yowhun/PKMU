"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { SignInValues } from "@/lib/types";
import { signIn } from "@/app/actions/auth.actions";
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { ToggleMode } from "@/components/ToggleMode";
import { toast } from "@/hooks/use-toast";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    setIsLoading(true); 
    const result = await signIn(values);
    if (result.error) {
      setIsLoading(false); 
      toast({
        variant: "destructive",
        title: result.error,
      });
      router.push("/auth/login");
    } else {
      setIsLoading(false); 
      router.push("/summary");
      toast({
        title: "Login has been successfully",
      });
    }
  }

  return (
    <Card className="w-screen max-w-lg rounded-lg shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold flex justify-between">
          Welcome back!
          {/* <ToggleMode /> */}
        </CardTitle>
        <CardDescription className="text-gray-500">
          Sign in to your account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                      placeholder="Enter your Username..."
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
              render={({ field }) => {
                const [showPassword, setShowPassword] = useState(false);

                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password..."
                          {...field}
                          className="focus:border-primary focus:ring-primary w-full"
                          onChange={(e) => {
                            e.target.value = e.target.value.trim();
                            field.onChange(e);
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 text-xs"
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
                );
              }}
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader className="mr-2 h-4 w-4 px-3 animate-spin" />
              )}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
