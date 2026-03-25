import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokédex",
  description: "A Pokédex portfolio project powered by Next.js and Drupal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
