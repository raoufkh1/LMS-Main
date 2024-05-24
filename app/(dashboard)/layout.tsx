import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pr-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>

      <main className="md:pr-56 pt-[80px] h-full">{children}</main>
      <div className="hidden md:flex h-full w-56 flex-col fixed right-0 inset-y-0 z-50">
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
