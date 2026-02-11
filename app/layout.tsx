import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from '../lib/query-provider';
import Navigation from '../components/navigation';
import AuthInitializer from '../components/auth-initializer';

export const metadata: Metadata = {
  title: "ECommerce Platform",
  description: "Your one-stop destination for online shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthInitializer />
          <Navigation />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
