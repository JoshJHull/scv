import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import {gabarito} from "@/components/ui/fonts";

export const metadata: Metadata = {
  title: "SCVisualised",
  description: "Visualise Star Citizen game stats.",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>)
{
  return (
    <html lang="en" className={gabarito.className}>
    <body>
    <div className={"flex h-screen flex-col"}>
        <Navbar />
        <div className={"flex grow overflow-hidden"}>{children}</div>
    </div>
    </body>
    </html>
  );
}
