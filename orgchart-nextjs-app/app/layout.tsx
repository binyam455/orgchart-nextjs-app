import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Organization Chart",
  description: "Organization Chart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="toplevel">
        {children}
      </body>
    </html>
  );
}
