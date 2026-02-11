import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from '../lib/query-provider';
import Navigation from '../components/navigation';
import AuthInitializer from '../components/auth-initializer';
import AuthRefresher from '../components/auth-refresher';

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
          <AuthRefresher />
          <Navigation />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
