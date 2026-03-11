"use client";

import { useEffect, useState } from "react";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  users: number;
  scope: string;
  perms: string[];
}

export default function AdminRolesPage() {
  const language = useAdminLanguage();
  const tr = language === "tr";
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/roles")
      .then((r) => r.json())
      .then((data) => {
        const items: Role[] = data.items ?? [];
        setRoles(items);
        if (items.length > 0) setSelectedId(items[0].id);
      })
      .catch(() => toast.error(tr ? "Roller yüklenemedi." : "Failed to load roles."))
      .finally(() => setLoading(false));
  }, [tr]);

  const role = roles.find((item) => item.id === selectedId) ?? roles[0] ?? null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Roller ve İzinler" : "Roles and Permissions"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Rol tabanlı erişim kontrolü ve panel görünümleri." : "Role-based access controls and panel views."}</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">{tr ? "Rol Oluştur" : "Create Role"}</button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          {tr ? "Yükleniyor..." : "Loading..."}
        </div>
      ) : roles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-sm text-slate-500">{tr ? "Henüz rol tanımlanmamış." : "No roles defined yet."}</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">{tr ? "Rol" : "Role"}</th>
                  <th className="px-4 py-3">{tr ? "Kullanıcı" : "Users"}</th>
                  <th className="px-4 py-3">{tr ? "Kapsam" : "Scope"}</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((item) => (
                  <tr key={item.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedId(item.id)}>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{item.users}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="space-y-4">
            {role && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{role.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{role.scope}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.perms.map((perm) => (
                    <span key={perm} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{perm}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
