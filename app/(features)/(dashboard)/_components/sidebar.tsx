import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"

export const Sidebar = () => {
    return (
        <div className="h-full border-r bg-white flex flex-col overflow-auto shadow-sm">
            <div className="p-6">
                <div className="flex"> <Logo /> <span className="text-2xl mt-1 ml-1">DAPPLED</span></div>
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
    )
}

