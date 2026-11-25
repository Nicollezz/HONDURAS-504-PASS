import AuthProvider from "@/providers/AuthProvider";
import ProviderUsuario from "@/providers/ProviderUsuario";

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProviderUsuario>
        <main className="p-4">
          {children}
        </main>
      </ProviderUsuario>
    </AuthProvider>
  );
}