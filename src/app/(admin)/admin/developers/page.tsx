"use client";
import { Container } from "@/components/layout/Container";
export default function AdminDevelopersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight capitalize">developers</h1>
        <p className="text-muted-foreground mt-1">Manage marketplace developers.</p>
      </div>
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed text-muted-foreground">
         <h3 className="text-lg font-medium text-foreground">Coming Soon</h3>
         <p className="mt-1">This module is part of the v2 roadmap.</p>
      </div>
    </div>
  );
}