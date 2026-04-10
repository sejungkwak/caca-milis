import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Montserrat, Dancing_Script } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "../theme";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing_script",
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Cáca Milis",
  description: "A fictional cake shop based in Dublin",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${dancingScript.variable}`}
    >
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
