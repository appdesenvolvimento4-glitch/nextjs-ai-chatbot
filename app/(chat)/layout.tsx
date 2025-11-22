import { cookies } from "next/headers";
import Script from "next/script";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "../(auth)/auth";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.POSTGRES_URL) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="mx-auto max-w-xl space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Database not configured</h1>
          <p className="text-muted-foreground">
            Set the <code>POSTGRES_URL</code> environment variable to point to your
            database (for example, a Vercel Postgres connection string) and
            redeploy the app.
          </p>
          <p className="text-sm text-muted-foreground">
            Without a database the chatbot cannot create guest accounts or load
            chat history, so the deployed site will appear blank.
          </p>
        </div>
      </div>
    );
  }

  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <SidebarProvider defaultOpen={!isCollapsed}>
          <AppSidebar user={session?.user} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
