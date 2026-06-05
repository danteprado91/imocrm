"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteProperty(id: number) {
  await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
  await prisma.contract.deleteMany({ where: { propertyId: id } });
  await prisma.visit.deleteMany({ where: { propertyId: id } });
  await prisma.property.delete({ where: { id } });
  redirect("/imoveis");
}

export async function deleteCustomer(id: number) {
  await prisma.contract.deleteMany({ where: { customerId: id } });
  await prisma.visit.deleteMany({ where: { customerId: id } });
  await prisma.customer.delete({ where: { id } });
  redirect("/clientes");
}

export async function deleteAgent(id: number) {
  await prisma.contract.deleteMany({ where: { agentId: id } });
  await prisma.visit.deleteMany({ where: { agentId: id } });
  await prisma.agent.delete({ where: { id } });
  redirect("/corretores");
}

export async function deleteContract(id: number) {
  await prisma.contract.delete({ where: { id } });
  redirect("/contratos");
}

export async function deleteVisit(id: number) {
  await prisma.visit.delete({ where: { id } });
  redirect("/visitas");
}
