import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Groepsreizen Booking",
  description: "Boek je volgende groepsreis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
