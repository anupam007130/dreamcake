import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sweet Cake - Premium Online Cake Ordering",
  description: "Order freshly baked cakes delivered to your doorstep. Premium quality, beautiful designs, and unforgettable taste.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
