"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions/lead";

export function ContactPageForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="mt-6 rounded-xl bg-green-50 p-6 text-center">
        <p className="font-medium text-green-700">Mensagem enviada com sucesso!</p>
        <p className="mt-1 text-sm text-green-600">Em breve entraremos em contato.</p>
      </div>
    );
  }

  return (
    <form
      action={async (formData) => {
        await submitLead(formData);
        setSent(true);
      }}
      className="mt-6 space-y-4"
    >
      <input name="name" required placeholder="Seu nome completo" className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      <input name="email" type="email" required placeholder="Seu e-mail" className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      <input name="phone" placeholder="Seu telefone" className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      <textarea name="message" rows={4} placeholder="Sua mensagem" className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      <button type="submit" className="w-full rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:opacity-90">Enviar Mensagem</button>
    </form>
  );
}
