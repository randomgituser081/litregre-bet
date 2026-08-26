export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-lg mx-auto w-full flex flex-col">
      {children}
    </div>
  );
}
