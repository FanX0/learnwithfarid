import SidebarDashboard from "@/app/dashboard/SidebarDashboard";
import { Toaster } from 'sonner'


export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <div className="">

            <div className="ml-64 mx-8">{children}</div>
            <SidebarDashboard/>
            <Toaster richColors position="top-right" />
        </div>

    )
}