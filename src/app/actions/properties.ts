"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { geocodeAddress } from "@/lib/geocode";

export async function createProperty(formData: FormData) {
  const coverImage = String(formData.get("coverImage") ?? "") || null;
  const extraImagesRaw = formData.get("extraImages");
  let extraImages: string[] = [];
  if (extraImagesRaw) {
    try {
      extraImages = JSON.parse(String(extraImagesRaw));
    } catch { /* ignore */ }
  }

  const address = String(formData.get("address") ?? "");
  const coords = address ? await geocodeAddress(address) : null;

  const property = await prisma.property.create({
    data: {
      title: String(formData.get("title") ?? ""),
      type: String(formData.get("type") ?? ""),
      area: formData.get("area") ? Number(formData.get("area")) : null,
      bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
      garageSpots: formData.get("garageSpots") ? Number(formData.get("garageSpots")) : null,
      address,
      description: String(formData.get("description") ?? ""),
      salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : null,
      rentPrice: formData.get("rentPrice") ? Number(formData.get("rentPrice")) : null,
      status: String(formData.get("status") ?? "Disponível"),
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      coverImage,
    },
  });

  if (extraImages.length > 0) {
    await prisma.propertyImage.createMany({
      data: extraImages.map((url) => ({ url, propertyId: property.id })),
    });
  }

  redirect("/imoveis");
}

export async function updateProperty(id: number, formData: FormData) {
  const coverImage = String(formData.get("coverImage") ?? "") || null;
  const extraImagesRaw = formData.get("extraImages");
  let extraImages: string[] = [];
  if (extraImagesRaw) {
    try {
      extraImages = JSON.parse(String(extraImagesRaw));
    } catch { /* ignore */ }
  }

  const address = String(formData.get("address") ?? "");
  const coords = address ? await geocodeAddress(address) : null;

  await prisma.property.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      type: String(formData.get("type") ?? ""),
      area: formData.get("area") ? Number(formData.get("area")) : null,
      bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
      garageSpots: formData.get("garageSpots") ? Number(formData.get("garageSpots")) : null,
      address,
      description: String(formData.get("description") ?? ""),
      salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : null,
      rentPrice: formData.get("rentPrice") ? Number(formData.get("rentPrice")) : null,
      status: String(formData.get("status") ?? "Disponível"),
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      coverImage,
    },
  });

  if (extraImages.length > 0) {
    await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
    await prisma.propertyImage.createMany({
      data: extraImages.map((url) => ({ url, propertyId: id })),
    });
  }

  redirect(`/imoveis/${id}`);
}
