"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions/lead";

export function ContactForm({ propertyId }: { propertyId: number }) {
  const [sent, setSent] = useState(false);

  return sent ? (
    <p className="mt-3 text-sm font-medium text-green-600">Recebemos seu contato! Em breve responderemos.</p>
  ) : (
    <form
      action={async (formData) => {
        formData.set("propertyId", String(propertyId));
        await submitLead(formData);
        setSent(true);
      }}
      className="mt-4 space-y-3"
    >
      <input name="name" required placeholder="Seu nome" className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      <input name="email" type="email" required placeholder="Seu e-mail" className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      <input name="phone" placeholder="Seu telefone" className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      <textarea name="message" rows={3} placeholder="Mensagem (opcional)" className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      <button type="submit" className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90">Enviar</button>
    </form>
  );
}
