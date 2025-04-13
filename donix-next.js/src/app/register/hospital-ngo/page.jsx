"use client";
import { useState, useEffect } from "react";
import { useTheme } from 'next-themes';
import { toast } from 'react-hot-toast';

export default function HospitalRegistrationForm() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    hospitalName: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    countryCode: "+91",
    contactNumber: "",
    email: "",
    website: "",
    authorizedPerson: "",
    designation: "",
    medicalLicenseNumber: "",
    issuingAuthority: "",
    licenseFile: null,
    declaration: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const validatePincode = (pincode) => {
    if (!pincode) return true;
    return /^\d{6}$/.test(pincode);
  };

  const validateNumber = (value) => /^\d+$/.test(value);
  const validatePhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file") {
      const file = files[0];
      if (file && file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      if (name === "pincode") {
        setErrors((prev) => ({
          ...prev,
          pincode: validatePincode(value) ? "" : "Pincode must be 6 digits",
        }));
      } else if (name === "registrationNumber") {
        setErrors((prev) => ({
          ...prev,
          registrationNumber: validateNumber(value) ? "" : "Must be a number",
        }));
      } else if (name === "medicalLicenseNumber") {
        setErrors((prev) => ({
          ...prev,
          medicalLicenseNumber: validateNumber(value) ? "" : "Must be a number",
        }));
      } else if (name === "contactNumber") {
        setErrors((prev) => ({
          ...prev,
          contactNumber: validatePhoneNumber(value) ? "" : "Must be 10 digits",
        }));
      } else if (name === "email") {
        setErrors((prev) => ({
          ...prev,
          email: validateEmail(value) ? "" : "Invalid email address",
        }));
      } else if (name === "declaration") {
        setErrors((prev) => ({
          ...prev,
          declaration: checked ? "" : "You must agree to the declaration",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = [
      "hospitalName", "registrationNumber", "address", "city", "state",
      "contactNumber", "email", "authorizedPerson", "designation",
      "medicalLicenseNumber", "issuingAuthority", "licenseFile"
    ];

    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (!validatePincode(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    if (!validateNumber(formData.registrationNumber)) newErrors.registrationNumber = "Must be a number";
    if (!validateNumber(formData.medicalLicenseNumber)) newErrors.medicalLicenseNumber = "Must be a number";
    if (!validatePhoneNumber(formData.contactNumber)) newErrors.contactNumber = "Must be 10 digits";
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.declaration) newErrors.declaration = "You must agree to the declaration";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Hospital details has been sent to the super admin. You will be verified shortly!");
      setFormData({
        hospitalName: "",
        registrationNumber: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        countryCode: "+91",
        contactNumber: "",
        email: "",
        website: "",
        authorizedPerson: "",
        designation: "",
        medicalLicenseNumber: "",
        issuingAuthority: "",
        licenseFile: null,
        declaration: false,
      });
    } catch (error) {
      toast.error("Hospital details has been sent to the super admin. You will be verified shortly!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null; 
  }

  return (
    <div className={`min-h-screen flex justify-center items-start p-4 md:p-8 transition-colors duration-300 ${
      darkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <div className={`max-w-4xl w-full mx-auto my-8 p-6 sm:p-8 shadow-xl rounded-xl transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}>
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className={`text-2xl sm:text-3xl font-bold ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}>
              Hospital Registration
            </h1>
          </div>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Please fill in all required fields marked with *
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <h2 className={`text-xl font-semibold mb-4 pb-2 border-b ${
              darkMode ? "border-gray-700 text-blue-300" : "border-gray-200 text-blue-600"
            }`}>
              Hospital Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Hospital Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.hospitalName ? "border-red-500" : ""}`}
                />
                {errors.hospitalName && <p className="text-red-500 text-xs mt-1">{errors.hospitalName}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.registrationNumber ? "border-red-500" : ""}`}
                />
                {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                  "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.city ? "border-red-500" : ""}`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.state ? "border-red-500" : ""}`}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.pincode ? "border-red-500" : ""}`}
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </section>
          <section>
            <h2 className={`text-xl font-semibold mb-4 pb-2 border-b ${
              darkMode ? "border-gray-700 text-blue-300" : "border-gray-200 text-blue-600"
            }`}>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Contact Number *
                </label>
                <div className="flex">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className={`p-3 border rounded-l-lg focus:ring-2 focus:outline-none transition ${
                      darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                      "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  >
                    <option value="+91">+91 (IN)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                  </select>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`flex-1 p-3 border-t border-b border-r rounded-r-lg focus:ring-2 focus:outline-none transition ${
                      darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                      "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } ${errors.contactNumber ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                  "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-4 pb-2 border-b ${
              darkMode ? "border-gray-700 text-blue-300" : "border-gray-200 text-blue-600"
            }`}>
              Authorized Person Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="authorizedPerson"
                  value={formData.authorizedPerson}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.authorizedPerson ? "border-red-500" : ""}`}
                />
                {errors.authorizedPerson && <p className="text-red-500 text-xs mt-1">{errors.authorizedPerson}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.designation ? "border-red-500" : ""}`}
                />
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
              </div>
            </div>
          </section>
          <section>
            <h2 className={`text-xl font-semibold mb-4 pb-2 border-b ${
              darkMode ? "border-gray-700 text-blue-300" : "border-gray-200 text-blue-600"
            }`}>
              License Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Medical License Number *
                </label>
                <input
                  type="text"
                  name="medicalLicenseNumber"
                  value={formData.medicalLicenseNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.medicalLicenseNumber ? "border-red-500" : ""}`}
                />
                {errors.medicalLicenseNumber && <p className="text-red-500 text-xs mt-1">{errors.medicalLicenseNumber}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Issuing Authority *
                </label>
                <input
                  type="text"
                  name="issuingAuthority"
                  value={formData.issuingAuthority}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    darkMode ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                    "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } ${errors.issuingAuthority ? "border-red-500" : ""}`}
                />
                {errors.issuingAuthority && <p className="text-red-500 text-xs mt-1">{errors.issuingAuthority}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Upload License (PDF, Max 5MB) *
              </label>
              <div className={`p-3 border rounded-lg transition ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              } ${errors.licenseFile ? "border-red-500" : ""}`}>
                <input
                  type="file"
                  name="licenseFile"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="w-full text-sm"
                />
              </div>
              {errors.licenseFile && <p className="text-red-500 text-xs mt-1">{errors.licenseFile}</p>}
              {formData.licenseFile && (
                <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Selected file: {formData.licenseFile.name}
                </p>
              )}
            </div>
          </section>
          <div className="mt-6">
            <div className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label className="ml-2 text-sm">
                  <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    I, <strong className={darkMode ? "text-white" : "text-gray-900"}>{formData.authorizedPerson || "[Name]"}</strong>, 
                    serving as <strong className={darkMode ? "text-white" : "text-gray-900"}>{formData.designation || "[Designation]"}</strong>, 
                    declare that all information provided is accurate to the best of my knowledge and authorize the use of this data as required.
                  </span>
                </label>
              </div>
              {errors.declaration && <p className="text-red-500 text-xs mt-2">{errors.declaration}</p>}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex justify-center items-center ${
                darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
              } text-white ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
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
                "Register Hospital"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}