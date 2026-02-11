import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '../contexts/auth-context';
import Navigation from '../components/navigation';

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
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
