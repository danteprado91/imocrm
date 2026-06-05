"use server";

import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function login(_prevState: { error: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "E-mail ou senha inválidos" };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: "E-mail ou senha inválidos" };
  }

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect("/");
}
