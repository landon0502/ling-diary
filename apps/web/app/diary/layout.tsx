import { Wrapper as LayoutWrapper } from "@/components/layout";
import { AuthGuard } from "@/components/auth-guard";

export default function DiaryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <LayoutWrapper padding={false}>{children}</LayoutWrapper>
    </AuthGuard>
  );
}
