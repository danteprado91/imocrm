"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createCustomer(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "") || undefined;
  const phone = String(formData.get("phone") ?? "") || undefined;
  const document = String(formData.get("document") ?? "") || undefined;
  const type = String(formData.get("type") ?? "Comprador");
  const birthDate = String(formData.get("birthDate") ?? "") || undefined;
  const address = String(formData.get("address") ?? "") || undefined;
  const notes = String(formData.get("notes") ?? "") || undefined;

  await prisma.customer.create({
    data: { name, email, phone, document, type, birthDate, address, notes },
  });

  redirect("/clientes");
}

export async function updateCustomer(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "") || undefined;
  const phone = String(formData.get("phone") ?? "") || undefined;
  const document = String(formData.get("document") ?? "") || undefined;
  const type = String(formData.get("type") ?? "Comprador");
  const birthDate = String(formData.get("birthDate") ?? "") || undefined;
  const address = String(formData.get("address") ?? "") || undefined;
  const notes = String(formData.get("notes") ?? "") || undefined;

  await prisma.customer.update({
    where: { id },
    data: { name, email, phone, document, type, birthDate, address, notes },
  });

  redirect(`/clientes/${id}`);
}
