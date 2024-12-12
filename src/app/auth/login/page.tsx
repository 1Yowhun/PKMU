import React from "react";
import { LoginForm } from "./login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpForm from "./RegisterCard";
import { checkUserDb } from "@/app/actions/auth.actions";

const Auth = async () => {
  const user = await checkUserDb();
  const hasUsers = user.length === 0;
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Tabs defaultValue="login" className="w-auto">
        {/* <TabsList>
          {hasUsers && (
            <div>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </div>
          )}
        </TabsList> */}
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        {/* {hasUsers && (
          <TabsContent value="register">
            <SignUpForm />
          </TabsContent>
        )} */}
      </Tabs>
    </div>
  );
};

export default Auth;
