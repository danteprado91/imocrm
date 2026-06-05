"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createVisit(formData: FormData) {
  const customerId = Number(formData.get("customerId"));
  const agentId = Number(formData.get("agentId"));
  const propertyId = Number(formData.get("propertyId"));
  const date = new Date(String(formData.get("date") ?? Date.now()));
  const notes = String(formData.get("notes") ?? "") || undefined;

  await prisma.visit.create({
    data: { date, notes, customerId, agentId, propertyId },
  });

  redirect("/visitas");
}

export async function updateVisit(id: number, formData: FormData) {
  const customerId = Number(formData.get("customerId"));
  const agentId = Number(formData.get("agentId"));
  const propertyId = Number(formData.get("propertyId"));
  const date = new Date(String(formData.get("date") ?? Date.now()));
  const notes = String(formData.get("notes") ?? "") || undefined;
  const status = String(formData.get("status") ?? "Pendente");

  await prisma.visit.update({
    where: { id },
    data: { date, notes, status, customerId, agentId, propertyId },
  });

  redirect(`/visitas/${id}`);
}
