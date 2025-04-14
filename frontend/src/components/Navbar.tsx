import { Link } from "react-router-dom";
import WalletConnectButton from "./WalletConnectButton";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-md dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-green-600">🌱 CarbonCred</h1>
        <Link to="/" className="text-sm hover:underline">Home</Link>
        <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
        <Link to="/marketplace" className="text-sm hover:underline">Marketplace</Link>
        <Link to="/emission" className="text-sm hover:underline">Emission</Link>
        <Link to="/sandbox" className="text-sm hover:underline">Sandbox</Link>
        <Link to="/admin" className="text-sm hover:underline">Admin</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/authform" className="text-sm hover:underline">Register</Link>
        <WalletConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;
