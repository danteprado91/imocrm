"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "corretor");

  const hashed = await hashPassword(password);

  await prisma.user.create({
    data: { name, email, password: hashed, role },
  });

  redirect("/config/usuarios");
}

export async function updateUser(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "corretor");
  const active = formData.get("active") === "on";

  const data: Record<string, unknown> = { name, email, role, active };
  if (password) {
    data.password = await hashPassword(password);
  }

  await prisma.user.update({ where: { id }, data });

  redirect("/config/usuarios");
}
