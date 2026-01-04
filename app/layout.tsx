import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TeamCore Workspace",
  description: "Advanced Task Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="font-sans">
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
              <Navbar />
              <main className="p-8 flex-1">
                {children}
              </main>
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#f8fafc",
              },
            }}
            richColors
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  );
}
