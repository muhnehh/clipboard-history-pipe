import type { Metadata } from "next";
import { Toaster } from "../lib/use-toast";

export const metadata: Metadata = {
  title: "Example Pipe • Screenpipe",
  description: "A clean starting point for your Screenpipe pipe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body 
        style={{ margin: 0, padding: 0, minHeight: '100vh' }}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
