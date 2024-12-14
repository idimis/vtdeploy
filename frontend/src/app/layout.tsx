import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeTribe",
  description: "Your event management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}