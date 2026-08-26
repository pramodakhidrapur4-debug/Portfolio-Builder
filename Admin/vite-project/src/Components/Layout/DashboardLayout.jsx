import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineLogout } from "react-icons/hi";
import Sidebar from "../Sidebar/Sidebar";
import { useToast } from "../UI/Toast";
import "./DashboardLayout.css";

// Map routes to page titles
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/payments": "Payments",
  "/portfolios": "Portfolios",
  "/discussions": "Discussions",
  "/enquiries": "Enquiries",
  "/works": "Previous Works",
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const currentTitle = PAGE_TITLES[location.pathname] || "Dashboard";

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    toast.info("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        {/* Top navbar */}
        <header className="topbar">
          <div className="topbar__left">
            <button
              className="topbar__menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineMenuAlt2 />
            </button>
            <h2 className="topbar__title">{currentTitle}</h2>
          </div>

          <div className="topbar__right">
            <button className="topbar__icon-btn" title="Notifications">
              <HiOutlineBell />
              <span className="topbar__notification-dot" />
            </button>

            <div className="topbar__divider" />

            <div className="topbar__admin">
              <div className="topbar__avatar">A</div>
              <span className="topbar__admin-name">Admin</span>
            </div>

            <button
              className="topbar__icon-btn topbar__logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <HiOutlineLogout />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
