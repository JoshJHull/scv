import type { Metadata } from "next";
import "./globals.css";
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
        <div className={"flex grow overflow-hidden"}>{children}</div>
    </div>
    </body>
    </html>
  );
}
