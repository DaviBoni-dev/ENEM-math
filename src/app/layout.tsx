import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <Providers>
          {/* A Navbar fica aqui, acima de todas as páginas */}
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}