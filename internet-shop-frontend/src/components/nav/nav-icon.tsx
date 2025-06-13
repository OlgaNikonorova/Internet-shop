import { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface NavIconProps {
  icon: ReactNode;
  to?: string;
  onClick?: () => void;
}

const NavIcon = ({ icon, to, onClick }: NavIconProps) => {
  const content = (
    <button
      className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
      onClick={onClick}
    >
      {icon}
    </button>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default NavIcon;
