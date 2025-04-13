"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from 'next-themes';
import toast from "react-hot-toast";
export default function UserRegistrationForm() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "Recipient",
    blockchainAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validatePhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      setErrors((prev) => ({
        ...prev,
        phone: validatePhoneNumber(value) ? "" : "Phone Number must be 10 digits.",
      }));
    } else if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email address.",
      }));
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setFormData((prev) => ({ ...prev, blockchainAddress: address }));
      toast.success("Wallet connected!");
    } catch (err) {
      console.error("MetaMask Error:", err);
      toast.error("Failed to connect wallet.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Phone Number must be 10 digits.";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (!formData.blockchainAddress.trim()) newErrors.blockchainAddress = "Please connect your wallet.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { name, email, password, phone, address, role, blockchainAddress } = formData;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/register/sign-up`,
        { name, email, password, phone, address, role, blockchainAddress }
      );
      toast.success("Verification Link has been sent to your email!");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "Recipient",
        blockchainAddress: "",
      });
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "Registration Failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex justify-center items-center p-4 md:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full mx-auto p-6 sm:p-8 shadow-2xl rounded-xl transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          Recipient Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="1234567890"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <label htmlFor="address" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="123 Main St, City"
              value={formData.address}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Blockchain Wallet */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Blockchain Wallet *
            </label>
            <button
              type="button"
              onClick={connectWallet}
              className="w-full p-3 font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
            >
              {formData.blockchainAddress
                ? `Connected: ${formData.blockchainAddress.slice(0, 6)}...${formData.blockchainAddress.slice(-4)}`
                : "Connect MetaMask Wallet"}
            </button>
            {errors.blockchainAddress && <p className="text-red-500 text-sm mt-1">{errors.blockchainAddress}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 font-semibold rounded-lg transition-all flex justify-center items-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}