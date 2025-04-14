import SideNav from "@/components/SideNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <div className="w-64 hidden md:block">
        <SideNav />
      </div>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
