import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-8 py-7 max-w-6xl w-full">{children}</main>
      </div>
    </div>
  );
}
