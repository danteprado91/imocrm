import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateUser } from "@/app/actions/users";

export default async function EditarUsuarioPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const usuario = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!usuario) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/config/usuarios" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Editar Usuário</h1>
      </div>

      <form action={updateUser.bind(null, usuario.id)} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome</label>
            <input id="name" name="name" type="text" required defaultValue={usuario.name} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
            <input id="email" name="email" type="email" required defaultValue={usuario.email} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nova senha</label>
            <input id="password" name="password" type="password" placeholder="Deixe em branco para manter" className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Função</label>
            <select id="role" name="role" defaultValue={usuario.role} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              <option value="corretor">Corretor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="active" name="active" type="checkbox" defaultChecked={usuario.active} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary" />
          <label htmlFor="active" className="text-sm font-medium text-slate-700 dark:text-slate-300">Usuário ativo</label>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Salvar alterações</button>
          <Link href="/config/usuarios" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
