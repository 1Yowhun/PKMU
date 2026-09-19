"use server";

import prisma from "@/lib/db";
import { SignInValues } from "@/lib/types";
import { Argon2id } from "oslo/password";
import {
  deleteSessionTokenCookie,
  getSessionToken,
  setSession,
} from "@/lib/lucia";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  SessionValidationResult,
  createSession,
  generateSessionToken,
  invalidateSession,
  validateSessionToken,
} from "@/auth";
import { getErrorMessage } from "./error.action";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "../../../generated/prisma_client";

export const signIn = async (values: SignInValues) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: values.username },
    });

    if (!user || !user.password) {
      console.log(`Failed login attempt for username: ${values.username}`);
      return { success: false, error: "Salah password atau username" };
    }

    const passwordMatch = await new Argon2id().verify(
      user.password,
      values.password
    );

    if (!passwordMatch) {
      console.log(`Failed login attempt for username: ${values.username}`);
      return { success: false, error: "Salah password atau username" };
    }
    await setSession(user.id);
    return { success: true };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const logOut = async () => {
  // Retrieve the session token and compute session ID
  const sessionToken = getSessionToken();
  if (sessionToken) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionToken))
    );

    // Invalidate the session using session ID
    await invalidateSession(sessionId);
  } else {
    return {
      error: "Tidak ada session atau user yang sedang login",
      success: false,
    };
  }

  // Delete session token cookie
  deleteSessionTokenCookie();

  // Redirect to login page
  redirect("/auth/login");
};

export const registerAction = async (values: SignInValues) => {
  try {
    // console.log(values, "Payload Register");
    const existingUsers = await prisma.user.findMany();

    if (existingUsers.length === 0) {
      const user = await prisma.user.create({
        data: {
          username: values.username,
          password: await new Argon2id().hash(values.password),
          companiesId: values.companyId,
          role: "ADMIN",
        },
      });
      await setSession(user.id);
      return { success: true };
    } else {
      const existingUser = await prisma.user.findUnique({
        where: {
          username: values.username,
        },
      });

      if (existingUser) {
        return { error: "User already exists", success: false };
      }

      const user = await prisma.user.create({
        data: {
          username: values.username,
          password: await new Argon2id().hash(values.password),
          companiesId: values.companyId,
          role: "USER",
        },
      });
      await setSession(user.id);
      return { success: true };
    }
  } catch (error) {
    return { error: getErrorMessage(error), success: false };
  }
};

export const onlyRegister = async (values: SignInValues) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: values.username,
      },
    });
    if (existingUser) {
      return { error: "Sudah ada username", success: false };
    }

    const user = await prisma.user.create({
      data: {
        username: values.username,
        password: await new Argon2id().hash(values.password),
        role: values.role,
        companiesId: Number(values.company),
      },
    });
    return { success: true, data: user };
  } catch (error) {
    return { error: "Terjadi kesalahan", success: false };
  }
};

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    try {
      const cookieStore = cookies();
      const token = cookieStore.get("spbe-auth-cookies")?.value ?? null;

      if (token === null) {
        console.log("No token found in cookies");
        return { session: null, user: null };
      }

      const result = await validateSessionToken(token);

      if (!result) {
        console.log("Session token validation failed or returned null");
      }

      return result;
    } catch (error) {
      console.error("Error during getCurrentSession:", error);
      return { session: null, user: null };
    }
  }
);

export const checkUserDb = cache(async () => {
  try {
    const checkUsername = await prisma.user.findMany();

    if (!checkUsername || checkUsername.length === 0) {
      console.log("No user data found in the database");
    }

    return checkUsername as User[];
  } catch (error) {
    console.error("Error during checkUserDb:", error);
    return [];
  }
});
