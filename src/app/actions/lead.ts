"use server";

import { prisma } from "@/lib/prisma";

export async function submitLead(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "") || null;
  const message = String(formData.get("message") ?? "") || null;
  const propertyId = formData.get("propertyId") ? Number(formData.get("propertyId")) : null;

  if (!name || !email) return;

  await prisma.lead.create({
    data: { name, email, phone, message, propertyId },
  });
}

export async function getLeads() {
  return prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
}
