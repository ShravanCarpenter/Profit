import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Video, Upload, Menu, X } from 'lucide-react';

export const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">PF</span>
                        </div>
                        <span className="text-xl font-bold text-indigo-800">PROFit</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <NavLink to="/" current={location.pathname === "/"}>
                        <Home size={18} className="mr-1.5" />
                        Home
                    </NavLink>
                    <div className="flex items-center space-x-8 hidden md:flex">
                        <NavLink to="/live" current={location.pathname === "/live"}>
                            <Video size={18} className="mr-1.5" />
                            Live Detection
                        </NavLink>
                        <NavLink to="/upload" current={location.pathname === "/upload"}>
                            <Upload size={18} className="mr-1.5" />
                            Upload
                        </NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation (without Home) */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="container mx-auto px-4 py-3 space-y-4 bg-white">
                    {/* Home link removed here to hide on mobile */}

                    <MobileNavLink to="/live" current={location.pathname === "/live"} onClick={toggleMenu}>
                        <Video size={18} className="mr-2" />
                        Live Detection
                    </MobileNavLink>
                    <MobileNavLink to="/upload" current={location.pathname === "/upload"} onClick={toggleMenu}>
                        <Upload size={18} className="mr-2" />
                        Upload
                    </MobileNavLink>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, current, children }) => {
    return (
        <Link
            to={to}
            className={`flex items-center py-2 px-1 text-sm font-medium transition-all duration-200 ${current
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-300"
                }`}
        >
            {children}
        </Link>
    );
};

const MobileNavLink = ({ to, current, onClick, children }) => {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center py-3 px-4 rounded-lg transition-colors ${current
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
        >
            {children}
        </Link>
    );
};
