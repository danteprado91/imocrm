import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "http://localhost:3000";

  const properties = await prisma.property.findMany({
    select: { id: true, updatedAt: true },
  });

  const propertyUrls = properties.map((p) => ({
    url: `${baseUrl}/inicio/imovel/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: `${baseUrl}/inicio`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/inicio/imoveis`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/inicio/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...propertyUrls,
  ];
}
