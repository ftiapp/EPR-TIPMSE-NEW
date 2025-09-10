import { Prompt } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import CookieConsent from "./components/CookieConsent";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: {
    default: "EPR Event by TIPMSE & FTI",
    template: "%s | TIPMSE"
  },
  description: "Unite to drive EPR: Transform packaging into raw materials. Organized by TIPMSE under FTI.",
  icons: {
    icon: [
      { url: "/Logo_FTI.webp", type: "image/webp" }
    ]
  },
  openGraph: {
    title: "EPR Event by TIPMSE & FTI",
    description: "Join the movement to drive EPR in Thailand. Learn, connect, and take action.",
    url: "https://localhost:3000/",
    siteName: "TIPMSE",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/2560x403-01.png",
        width: 2560,
        height: 403,
        alt: "EPR Event Banner"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "EPR Event by TIPMSE & FTI",
    description: "Unite to drive EPR in Thailand.",
    images: ["/2560x403-01.png"],
    creator: "@tipmse"
  }
};

export const viewport = {
  themeColor: "#10b981",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${prompt.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
