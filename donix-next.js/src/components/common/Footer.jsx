"use client";
import React,{useState} from "react";
import {
  HeartHandshake,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Send,
  Circle,
} from "lucide-react";
import Link from "next/link";

const Footer = ({ darkMode }) => {
  const bgGradient = darkMode
    ? "from-gray-950 to-slate-900"
    : "from-gray-900 to-slate-600";
  const textColor = darkMode ? "text-purple-300" : "text-purple-200";
  const hoverTextColor = darkMode
    ? "hover:text-purple-300"
    : "hover:text-purple-200";
  const borderColor = darkMode
    ? "border-purple-700/50"
    : "border-purple-800/50";
  const bgCircle = darkMode ? "bg-purple-700/20" : "bg-purple-800/20";
  const bgIcon = darkMode ? "bg-purple-700/50" : "bg-purple-800/50";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await fetch(
        "https://donix-org-aman.onrender.com/sendMail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail: email, msg: message }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStatus({ success: true, message: data.message });
        setEmail("");
        setMessage("");
      } else {
        setStatus({
          success: false,
          message: data.error || "Failed to send email",
        });
      }
    } catch {
      setStatus({
        success: false,
        message: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <footer
      className={`relative overflow-hidden bg-gradient-to-b ${bgGradient} text-white `}
    >
      <div
        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${bgCircle} blur-3xl`}
      ></div>
      <div
        className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${bgCircle} blur-3xl`}
      ></div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                <HeartHandshake className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Donix
              </span>
            </div>
            <p className={`${textColor} leading-relaxed italic`}>
              Your One Act Can Save Multiple Lives!
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map(
                (Icon, index) => (
                  <Link
                    key={index}
                    href="#"
                    className={`w-10 h-10 rounded-full ${bgIcon} hover:bg-purple-700 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30`}
                  >
                    <Icon className={`h-5 w-5 ${textColor}`} />
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold mb-6 pb-2 border-b ${borderColor} flex items-center`}
            >
              <Circle className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-2" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                "Home",
                "About Us",
                "Donate",
                "Campaigns",
                "Impact Stories",
                "Contact",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className={`${textColor} ${hoverTextColor} flex items-center group transition-all duration-300`}
                  >
                    <Circle className="w-2 h-2 rounded-full bg-purple-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold mb-6 pb-2 border-b ${borderColor} flex items-center`}
            >
              <Circle className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-2" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: MapPin,
                  title: "Address",
                  content: "NIT PATNA BIHTA CAMPUS",
                },
                { icon: Phone, title: "Phone", content: "+91 98765 xxxx" },
                { icon: Mail, title: "Email", content: "donix@gmail.com" },
              ].map(({ icon: Icon, title, content }, index) => (
                <li key={index} className="flex items-start">
                  <div className="mt-1 mr-4">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4
                      className={`font-medium text-purple-100 dark:text-purple-200`}
                    >
                      {title}
                    </h4>
                    <p className={`${textColor} text-sm`}>{content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold mb-6 pb-2 border-b ${borderColor} flex items-center`}
            >
              <Circle className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-2" />
              Newsletter
            </h3>
            <p className={`${textColor} mb-6`}>
              Subscribe to get inspiring stories and updates from Donix.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className={`w-full px-4 py-3 rounded-lg ${bgIcon} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400/70 text-white`}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                placeholder="Your message"
                className={`w-full px-4 py-1 rounded-lg ${bgIcon} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400/70 text-white`}
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                Subscribe
                <Send className="h-5 w-5 ml-2" />
              </button>
              {status && (
                  <p
                    className={`text-sm ${
                      status.success ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
            </form>
          </div>
        </div>

        <div className={`pt-8 border-t ${borderColor}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`${textColor} text-sm mb-4 md:mb-0`}>
              © {new Date().getFullYear()} Donix. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Accessibility",
                "Sitemap",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className={`${textColor} hover:text-white text-sm transition-colors duration-300 hover:underline`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
