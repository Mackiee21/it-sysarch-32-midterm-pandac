import { Link } from "react-router-dom";
import { useAppContext } from "../provider";
import logo from "../assets/logo.png";
import Button from "./Button";

const Header = () => {
  const { logout } = useAppContext();
  const handleLogout = () => {
    logout();
  };
  return (
    <header className="text-black/70 bg-gray-100 border-b border-slate-300 flex items-center justify-between py-2 px-14">
      <Link to="/" className="flex items-center gap-1">
        <img className="w-12" src={logo} alt="logo" />
        <h1 className="font-medium">System Architecture</h1>
      </Link>
      <Button className="px-8 py-2" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
};

export default Header;
