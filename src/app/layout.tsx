import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropPulse – Sports Prop Analytics",
  description: "Data-driven sports prop analytics, projections, and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "#0d0d0f", color: "#f0f0f0" }}>
        {children}
      </body>
    </html>
  );
}
