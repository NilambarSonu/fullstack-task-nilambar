"use client";
import "./globals.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import ParticleCanvas from "../components/ParticleCanvas";
import { NotificationProvider } from "../components/NotificationContext";

export default function RootLayout({ children }) {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>NEXUS | Future Task Management</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ParticleCanvas />

        <div className="particle-1"></div>
        <div className="particle-2"></div>
        <div className="particle-3"></div>
        <div className="particle-4"></div>
        <div className="particle-5"></div>

        {mounted && (
          <nav className="bg-transparent text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold tracking-wider neon-glow-cyan">NEXUS</Link>
              <div className="space-x-4">
                {!isLoggedIn ? (
                  <>
                    <Link href="/login" className="hover:text-blue-400 transition-colors">Login</Link>
                    <Link href="/register" className="hover:text-blue-400 transition-colors">Register</Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors glow-on-hover">
                    Logout
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}
        <main className="container mx-auto p-4">
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </main>
      </body>
    </html>
  );
}