"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSiteConfigs(formData: FormData) {
  const entries = formData.entries();
  for (const [key, value] of entries) {
    if (key === "$ACTION_ID_6f6e6820f594a32e07385e6d468c8b3b7aa58cab") continue;
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  revalidatePath("/config");
  revalidatePath("/inicio");
  revalidatePath("/inicio/imoveis");
  revalidatePath("/inicio/contato");
}

export async function getSiteConfigs() {
  const configs = await prisma.siteConfig.findMany();
  const map: Record<string, string> = {};
  for (const c of configs) {
    map[c.key] = c.value;
  }
  return map;
}
