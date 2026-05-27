import { Wrapper as LayoutWrapper } from "@/components/layout";
import { AuthGuard } from "@/components/auth-guard";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <LayoutWrapper>{children}</LayoutWrapper>
    </AuthGuard>
  );
}
