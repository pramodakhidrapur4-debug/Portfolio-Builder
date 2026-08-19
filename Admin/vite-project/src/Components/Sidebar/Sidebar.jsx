import { NavLink, useLocation } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineCreditCard,
  HiOutlineCollection,
  HiOutlineChatAlt2,
  HiOutlineInbox,
  HiOutlineX,
} from "react-icons/hi";
import "./Sidebar.css";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: <HiOutlineViewGrid /> },
  { path: "/users", label: "Users", icon: <HiOutlineUsers /> },
  { path: "/payments", label: "Payments", icon: <HiOutlineCreditCard /> },
  { path: "/portfolios", label: "Portfolios", icon: <HiOutlineCollection /> },
  { path: "/discussions", label: "Discussions", icon: <HiOutlineChatAlt2 /> },
  { path: "/enquiries", label: "Enquiries", icon: <HiOutlineInbox /> },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <span>P</span>
          </div>
          <div className="sidebar__brand-text">
            <h2>Portfolio</h2>
            <span>Admin Panel</span>
          </div>
          <button className="sidebar__close" onClick={onClose}>
            <HiOutlineX />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <span className="sidebar__nav-label">Menu</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
              onClick={onClose}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <span className="sidebar__link-label">{item.label}</span>
              {/* Active indicator dot */}
              {location.pathname === item.path && (
                <span className="sidebar__link-dot" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <div className="sidebar__footer-card">
            <p>Portfolio Builder</p>
            <span>v2.0 • Admin</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
