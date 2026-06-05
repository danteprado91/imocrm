"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createContract(formData: FormData) {
  const customerId = Number(formData.get("customerId"));
  const agentId = Number(formData.get("agentId"));
  const propertyId = Number(formData.get("propertyId"));
  const type = String(formData.get("type") ?? "");
  const value = Number(formData.get("value") ?? 0);
  const date = new Date(String(formData.get("date") ?? Date.now()));
  const notes = String(formData.get("notes") ?? "") || undefined;

  await prisma.contract.create({
    data: { type, value, date, notes, customerId, agentId, propertyId },
  });

  redirect("/contratos");
}

export async function updateContract(id: number, formData: FormData) {
  const customerId = Number(formData.get("customerId"));
  const agentId = Number(formData.get("agentId"));
  const propertyId = Number(formData.get("propertyId"));
  const type = String(formData.get("type") ?? "");
  const value = Number(formData.get("value") ?? 0);
  const date = new Date(String(formData.get("date") ?? Date.now()));
  const notes = String(formData.get("notes") ?? "") || undefined;
  const status = String(formData.get("status") ?? "Ativo");

  await prisma.contract.update({
    where: { id },
    data: { type, value, date, notes, status, customerId, agentId, propertyId },
  });

  redirect(`/contratos/${id}`);
}
