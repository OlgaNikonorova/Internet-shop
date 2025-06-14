import { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface NavLinkProps {
  to: string;
  children: ReactNode;
  active?: boolean;
  icon?: ReactNode;
}

const NavLink = ({ to, children, active = false, icon }: NavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center gap-1 text-lg hover:text-gray-300 transition-colors ${
      active ? "font-bold text-white" : "text-gray-200"
    }`}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {children}
  </Link>
);

export default NavLink;
