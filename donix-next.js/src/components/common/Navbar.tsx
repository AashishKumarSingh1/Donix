"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  HeartHandshake,
  Moon,
  Sun,
  UserRound,
  Building2,
  Lightbulb,
  LogIn,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  BookOpenText,
  HeartPulse
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const menuItems = [
  {
    title: "Register",
    icon: <UserRound className="w-4 h-4" />,
    links: [
      { name: "Donor Registration", path: "/register/donor" },
      { name: "Recipient Registration", path: "/register/recipient" },
      { name: "Hospital & NGO Registration", path: "/register/hospital-ngo" },
    ],
  },
  {
    title: "Hospitals & Partners",
    icon: <Building2 className="w-4 h-4" />,
    links: [
      { name: "Verified Hospitals", path: "/hospitals/verified" },
      { name: "NGO & Partner List", path: "/hospitals/ngo-partners" },
      { name: "Government Agencies", path: "/hospitals/government" },
    ],
  },
  {
    title: "Awareness",
    icon: <Lightbulb className="w-4 h-4" />,
    links: [
      { name: "Upcoming Webinars", path: "/campaigns/webinars" },
      { name: "Donation Events", path: "/campaigns/events" },
      { name: "Educational Articles", path: "/campaigns/articles" },
    ],
  },
];

const Navbar = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const collapseTimeout = useRef<NodeJS.Timeout | null>(null);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  const handleMouseEnter = (title: string) => {
    if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
    setHoveredDropdown(title);
  };

  const handleMouseLeave = () => {
    collapseTimeout.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 300);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 shadow-md backdrop-blur-lg transition-all duration-300 ${
        isDark ? "bg-gradient-to-t from-gray-950 to-slate-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
            <HeartHandshake className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Donix
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full ring-1 ring-fuchsia-400 px-2 py-1">
            {menuItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => toggleDropdown(item.title)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all ${
                    (activeDropdown === item.title ||
                      hoveredDropdown === item.title)
                      ? isDark
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-black"
                      : "hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {(activeDropdown === item.title ||
                    hoveredDropdown === item.title) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {(activeDropdown === item.title ||
                  hoveredDropdown === item.title) && (
                  <div
                    className={`absolute left-0 mt-2 min-w-[220px] rounded-xl shadow-xl p-2 border ${
                      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
                  >
                    {item.links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.path}
                        className={`block px-4 py-2 rounded-lg transition ${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/blog"
            className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 transition"
          >
            <BookOpenText className="w-4 h-4" />
            <span>Blog</span>
          </Link>
          <Link
            href="/available-organs"
            className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 transition"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Available Organs</span>
          </Link>

          <Link
            href={"/Login"}
            className="flex items-center gap-2 px-4 py-2 ml-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>

          <button onClick={toggleTheme} className="cursor-pointer">
            {isDark ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>

        <div className="flex lg:hidden items-center gap-4 cursor-pointer">
          <button onClick={toggleTheme}>
            {isDark ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className={`lg:hidden absolute top-full left-0 w-full ${
            isDark ? "bg-gray-900" : "bg-white"
          } shadow-xl transition-all duration-300`}
        >
          <div className="container mx-auto px-4 py-4">
            {menuItems.map((item) => (
              <div key={item.title} className="mb-2 border-b border-gray-700/50">
                <button
                  onClick={() => toggleDropdown(item.title)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${
                    activeDropdown === item.title
                      ? isDark
                        ? "bg-gray-800"
                        : "bg-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {activeDropdown === item.title ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {activeDropdown === item.title && (
                  <div className="pl-8 py-2 space-y-2">
                    {item.links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.path}
                        className={`block px-4 py-2 rounded-lg ${
                          isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/blog"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpenText className="w-4 h-4" />
              <span>Blog</span>
            </Link>
            <Link
              href="/available-organs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Available Organs</span>
            </Link>
            <button
              onClick={() => {
                router.push("/auth/Login");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
