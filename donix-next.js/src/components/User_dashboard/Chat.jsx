"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import jwt from "jsonwebtoken";
import "../../app/globals.css";
import { IoChevronBackCircleSharp, IoChevronBackCircleOutline } from "react-icons/io5";

const socket = io("http://localhost:10000", { transports: ["websocket"] });

function ChatApp() {
  const [totalUsersList, setTotalUsersList] = useState([]);
  const [currentClickedUser, setCurrentClickedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [senderId, setSenderId] = useState(null);
  const [darkMode] = useState(true); 

  const localMessageCache = {};

  // Decode token and set senderId
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwt.decode(token);
        setSenderId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch users and set up socket listeners
  useEffect(() => {
    axios
      .get("https://donix-org-aman.onrender.com/api/users/get-all")
      .then((response) => setTotalUsersList(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    socket.on("connect", () => console.log("Connected to server:", socket.id));
    socket.on("users", (userList) => setTotalUsersList(userList));
    socket.on("receiveMessage", (data) => {
      if (data.sender === selectedUser || data.receiver === selectedUser) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("users");
      socket.off("receiveMessage");
    };
  }, [selectedUser]);

  // Emit joined-chat event when senderId is set
  useEffect(() => {
    if (senderId) {
      socket.emit("joined-chat", senderId);
    }
  }, [senderId]);

  // Handle user click to fetch chat history
  const handleUserClick = async (userId) => {
    setSelectedUser(userId);

    if (!senderId) {
      console.error("Sender ID is missing.");
      return;
    }

    if (localMessageCache[userId]) {
      setMessages(localMessageCache[userId]);
      return;
    }

    try {
      const response = await axios.get("https://donix-org-aman.onrender.com/api/users/chat-history", {
        params: { receiverId: userId, senderId },
      });
      setCurrentClickedUser(response.data);
      const formattedMessages = response.data.map((msg) => ({
        ...msg,
        senderName: msg.sender === senderId ? "You" : totalUsersList.find((user) => user._id === msg.sender)?.fullName || "Unknown",
      }));
      setMessages(formattedMessages);
      localMessageCache[userId] = formattedMessages;
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!message.trim() || !selectedUser || !senderId) {
      console.error("Message, selected user, or sender ID is missing.");
      return;
    }

    const newMessage = {
      message,
      sender: senderId,
      receiver: selectedUser, 
    };

    try {
      // Send message to the server
      const response = await axios.post("https://donix-org-aman.onrender.com/api/users/message-send", newMessage);

      // Emit message to the socket
      socket.emit("sendMessage", response.data.chatMessage);

      // Update local state and cache
    setMessages((prev) => {
      // Check if the message already exists
      const isDuplicate = prev.some(
        (msg) => msg._id === response.data.chatMessage._id
      );
      if (!isDuplicate) {
        return [...prev, response.data.chatMessage];
      }
      return prev;
    });
      localMessageCache[selectedUser] = [...(localMessageCache[selectedUser] || []), response.data.chatMessage];
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar - Users List */}
      <div
        className={`w-full md:w-1/3 p-1 shadow-lg ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        } ${selectedUser ? "hidden md:flex flex-col" : "block"}`}
      >
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-2 mt-2 mb-4 border rounded-lg ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-gray-100 text-gray-800 border-gray-300"
          }`}
        />
        <ul className="space-y-2 overflow-y-auto h-[calc(100vh-80px)] hide-scrollbar">
          {totalUsersList
            .filter((user) =>
              (user.fullName || "").toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <li
                key={user._id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  selectedUser === user._id
                    ? darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleUserClick(user._id)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    darkMode
                      ? "bg-gray-600 text-gray-200"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {(user.fullName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">
                      {user.fullName || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.lastMessageTime
                        ? new Date(user.lastMessageTime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="text-sm truncate">
                    {user.lastMessage || "No messages yet"}
                  </div>
                </div>
                <span className="ml-2">{user.online ? "🟢" : "🔴"}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div
        className={`w-full md:w-2/3 flex flex-col h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
        } ${selectedUser ? "block" : "hidden md:flex"}`}
      >
        {selectedUser ? (
          <>
            <button
              className="md:hidden flex items-center gap-2 p-4"
              onClick={() => setSelectedUser(null)}
            >
              {darkMode ? (
                <IoChevronBackCircleSharp className="text-gray-300 text-3xl" />
              ) : (
                <IoChevronBackCircleOutline className="text-gray-700 text-3xl" />
              )}
              Back
            </button>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-md ${
                    msg.sender === senderId
                      ? darkMode
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-blue-500 text-white ml-auto"
                      : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                >
                  <div className="text-sm font-semibold">{msg.senderName}</div>
                  <div className="text-sm">{msg.message}</div>
                  <div className="text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <div
              className={`p-4 flex items-center sticky bottom-0 w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`flex-1 p-3 border rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className={`ml-3 px-5 py-2 rounded-lg ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;