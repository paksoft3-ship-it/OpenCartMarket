"use client";

import { createContext, useContext } from "react";

export type AdminLanguage = "tr" | "en";

const AdminLanguageContext = createContext<AdminLanguage>("tr");

export function AdminLanguageProvider({ language, children }: { language: AdminLanguage; children: React.ReactNode }) {
  return <AdminLanguageContext.Provider value={language}>{children}</AdminLanguageContext.Provider>;
}

export function useAdminLanguage() {
  return useContext(AdminLanguageContext);
}

