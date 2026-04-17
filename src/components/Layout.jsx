import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#0a1628] ">
            
            {/* Header */}
            <div className= "p-3">
                <Header/>
            </div>

            {/* Sidebar + Contenido */}
            <div className="flex flex-1 gap-3 p-3 pt-0">

            {/* Sidebar */}
            <div
                className="w-48 flex-shrink-0"
                style={{
                    position: 'sticky',
                    top: '12px',
                    height: 'calc(100vh - 90px)',
                    backgroundColor: "rgba(13, 31, 60, 0.45)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                }}
            >
                <Sidebar />
            </div>

                {/* Contenido */}
                <div className="flex-1" style={{overflow: 'hidden'}}>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default Layout