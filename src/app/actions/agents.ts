"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createAgent(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "") || undefined;
  const phone = String(formData.get("phone") ?? "") || undefined;
  const document = String(formData.get("document") ?? "") || undefined;
  const creci = String(formData.get("creci") ?? "") || undefined;
  const commission = Number(formData.get("commission") ?? 5);
  const notes = String(formData.get("notes") ?? "") || undefined;

  await prisma.agent.create({
    data: { name, email, phone, document, creci, commission, notes },
  });

  redirect("/corretores");
}

export async function updateAgent(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "") || undefined;
  const phone = String(formData.get("phone") ?? "") || undefined;
  const document = String(formData.get("document") ?? "") || undefined;
  const creci = String(formData.get("creci") ?? "") || undefined;
  const commission = Number(formData.get("commission") ?? 5);
  const notes = String(formData.get("notes") ?? "") || undefined;

  await prisma.agent.update({
    where: { id },
    data: { name, email, phone, document, creci, commission, notes },
  });

  redirect(`/corretores/${id}`);
}
