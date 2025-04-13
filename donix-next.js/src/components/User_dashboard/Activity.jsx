/**
 * @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]}
 */
import React, { useState, useEffect } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import {
  AiOutlineUserAdd,
  AiOutlineSearch,
  AiOutlineFileText,
} from "react-icons/ai";
import Cookies from "js-cookie";
import axios from "axios";

export default function Activity() {
  const [darkMode] = useState(true); 
  const [activeTab, setActiveTab] = useState("updates");
  const [organData, setOrganData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webinar, setWebinar] = useState({
    title: "",
    date: "",
    description: "",
    link: "",
  });
  const [message, setMessage] = useState("");
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    imageUrl: "",
    donationLink: "",
  });

  useEffect(() => {
    const fetchOrganData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("Authorization token is missing.");
          setLoading(false);
          return;
        }
  
        const response = await axios.get("https://donix-org-aman.onrender.com/allOrganData", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
  
        setOrganData(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch organ data.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganData();
  }, []);

 

  const handleWebinarSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) {
        setMessage("Authorization token is missing.");
        return;
      }

      const response = await axios.post(
        "https://donix-org-aman.onrender.com/addWebinar",
        webinar,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setWebinar({ title: "", date: "", description: "", link: "" });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to schedule webinar. Try again later."
      );
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) {
        setMessage("Authorization token is missing.");
        return;
      }

      const response = await axios.post("https://donix-org-aman.onrender.com/addBlog", blog, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      setBlog({ title: "", description: "", imageUrl: "", donationLink: "" });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add blog. Try again later."
      );
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">User Activity</h1>

      {/* Tabs Navigation */}
      <div
        className={`flex border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } mb-6`}
      >
        <button
          onClick={() => setActiveTab("updates")}
          className={`px-4 py-2 font-medium ${
            activeTab === "updates"
              ? darkMode
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-blue-600 border-b-2 border-blue-600"
              : ""
          }`}
        >
          <HiOutlineDocumentReport className="inline mr-2" />
          Updates
        </button>
        <button
          onClick={() => setActiveTab("conductWebinar")}
          className={`px-4 py-2 font-medium ${
            activeTab === "conductWebinar"
              ? darkMode
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-blue-600 border-b-2 border-blue-600"
              : ""
          }`}
        >
          <AiOutlineUserAdd className="inline mr-2" />
          Conduct Webinar
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-4 py-2 font-medium ${
            activeTab === "blogs"
              ? darkMode
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-blue-600 border-b-2 border-blue-600"
              : ""
          }`}
        >
          <AiOutlineSearch className="inline mr-2" />
          Add Blogs
        </button>
      </div>

      {/* Updates Section */}
      {activeTab === "updates" && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-lg shadow ${
              darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              <AiOutlineFileText className="inline mr-2" />
              Organ Requests
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">Pending</h3>
                {organData.organRequests.pending.length > 0 ? (
                  <ul className="space-y-2">
                    {organData.organRequests.pending.map((request) => (
                      <li
                        key={request._id}
                        className={`p-4 rounded-lg shadow-md ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p>
                          <strong>Organ:</strong> {request.organ}
                        </p>
                        <p>
                          <strong>Requested At:</strong>{" "}
                          {new Date(request.requestedAt).toLocaleString()}
                        </p>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-500 text-white">
                          Pending
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No pending organ requests.</p>
                )}

                <h3 className="text-lg font-semibold mt-6 mb-2">Approved</h3>
                {organData.organRequests.approved.length > 0 ? (
                  <ul className="space-y-2">
                    {organData.organRequests.approved.map((request) => (
                      <li
                        key={request._id}
                        className={`p-4 rounded-lg shadow-md ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p>
                          <strong>Organ:</strong> {request.organ}
                        </p>
                        <p>
                          <strong>Requested At:</strong>{" "}
                          {new Date(request.requestedAt).toLocaleString()}
                        </p>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-500 text-white">
                          Approved
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No approved organ requests.</p>
                )}
              </>
            )}
          </div>

          <div
            className={`p-6 rounded-lg shadow ${
              darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              <AiOutlineFileText className="inline mr-2" />
              Organ Donations
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">Pending</h3>
                {organData.organDonations.pending.length > 0 ? (
                  <ul className="space-y-2">
                    {organData.organDonations.pending.map((donation) => (
                      <li
                        key={donation._id}
                        className={`p-4 rounded-lg shadow-md ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p>
                          <strong>Organ:</strong> {donation.organ}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {new Date(donation.createdAt).toLocaleString()}
                        </p>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-500 text-white">
                          Pending
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No pending organ donations.</p>
                )}

                <h3 className="text-lg font-semibold mt-6 mb-2">Approved</h3>
                {organData.organDonations.approved.length > 0 ? (
                  <ul className="space-y-2">
                    {organData.organDonations.approved.map((donation) => (
                      <li
                        key={donation._id}
                        className={`p-4 rounded-lg shadow-md ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p>
                          <strong>Organ:</strong> {donation.organ}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {new Date(donation.createdAt).toLocaleString()}
                        </p>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-500 text-white">
                          Approved
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No approved organ donations.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Conduct Webinar Section */}
      {activeTab === "conductWebinar" && (
        <div
          className={`p-6 rounded-lg shadow ${
            darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-900"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Conduct Webinar</h2>
          <form
            onSubmit={handleWebinarSubmit}
            className={`mb-6 p-4 rounded ${
              darkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={webinar.title}
                  onChange={(e) =>
                    setWebinar({ ...webinar, title: e.target.value })
                  }
                  placeholder="Enter webinar title"
                  className={`w-full p-2 rounded border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={webinar.date}
                  onChange={(e) =>
                    setWebinar({ ...webinar, date: e.target.value })
                  }
                  className={`w-full p-2 rounded border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={webinar.description}
                  onChange={(e) =>
                    setWebinar({ ...webinar, description: e.target.value })
                  }
                  placeholder="Enter webinar description"
                  className={`w-full p-2 rounded border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  rows="3"
                  required
                />
              </div>

              {/* Webinar Link */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Webinar Link
                </label>
                <input
                  type="url"
                  value={webinar.link}
                  onChange={(e) =>
                    setWebinar({ ...webinar, link: e.target.value })
                  }
                  placeholder="Enter webinar link"
                  className={`w-full p-2 rounded border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Schedule Webinar
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-sm ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {/* Add Blogs Section */}
      {activeTab === "blogs" && (
        <div
          className={`p-6 rounded-lg shadow ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Add Blog</h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Explore educational blogs related to organ donation, recovery, and
            health maintenance.
          </p>
          <form
            onSubmit={handleBlogSubmit}
            className={`mt-4 p-4 rounded ${
              darkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={blog.title}
                  onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                  placeholder="Enter blog title"
                  className={`w-full p-2 rounded border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={blog.description}
                  onChange={(e) =>
                    setBlog({ ...blog, description: e.target.value })
                  }
                  placeholder="Enter blog description"
                  className={`w-full p-2 rounded border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  rows="3"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={blog.imageUrl}
                  onChange={(e) =>
                    setBlog({ ...blog, imageUrl: e.target.value })
                  }
                  placeholder="Enter image URL"
                  className={`w-full p-2 rounded border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Donation Link */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Donation Link
                </label>
                <input
                  type="url"
                  value={blog.donationLink}
                  onChange={(e) =>
                    setBlog({ ...blog, donationLink: e.target.value })
                  }
                  placeholder="Enter donation link"
                  className={`w-full p-2 rounded border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Blog
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-sm ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
