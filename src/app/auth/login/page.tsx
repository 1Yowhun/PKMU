import React from "react";
import { LoginForm } from "./login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkUserDb, getCurrentSession } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";
import SignUpForm from "./signup";

const Auth = async () => {
  const [user, test] = await Promise.all([checkUserDb(), getCurrentSession()]);

  if (test.session && test.user) {
    redirect("/summary");
  }
  const hasUsers = user.length === 0;
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Tabs defaultValue="login" className="w-auto">
        {hasUsers && (
          <TabsList>
            <div>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </div>
          </TabsList>
        )}
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        {hasUsers && (
          <TabsContent value="register">
            <SignUpForm />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Auth;
