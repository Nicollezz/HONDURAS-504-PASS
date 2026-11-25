import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
 

import AuthProvider from '../providers/AuthProvider';
import ProviderUsuario from '../providers/ProviderUsuario';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ProviderUsuario>
            {children}
          </ProviderUsuario>
        </AuthProvider>
      </body>
    </html>
  );
}