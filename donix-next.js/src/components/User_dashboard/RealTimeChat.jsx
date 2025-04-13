"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import jwt from "jsonwebtoken";
import { 
  Search, ArrowLeft, Send, Smile, Paperclip, 
  CircleDot, Circle, Check, CheckCheck, 
  Menu, MoreVertical, User 
} from "lucide-react";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_ENDPOINT, { transports: ["websocket"] });

function RealTimeChatApp() {
  const [totalUsersList, setTotalUsersList] = useState([]);
  const [currentClickedUser, setCurrentClickedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [senderId, setSenderId] = useState(null);
  const messagesEndRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const localMessageCache = {};

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/users/get-all`)
      .then((response) => setTotalUsersList(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    socket.on("connect", () => console.log("Connected to server:", socket.id));
    socket.on("users", (userList) => setTotalUsersList(userList));
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
      if (localMessageCache[data.senderId]) {
        localMessageCache[data.senderId].push(data);
      }
    });
    
    return () => {
      socket.off("connect");
      socket.off("users");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (senderId) {
      socket.emit("joined-chat", senderId);
    }
  }, [senderId]);

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);
    setIsMobileMenuOpen(false);

    if (!senderId) {
      console.error("Sender ID is missing.");
      return;
    }

    if (localMessageCache[userId]) {
      setMessages(localMessageCache[userId]);
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/users/chat-history`, {
        params: { receiverId: userId, senderId },
      });
      setCurrentClickedUser(response.data);
      const formattedMessages = response.data.history.map((msg) => ({
        ...msg,
        senderName: msg.sender === senderId ? "You" : totalUsersList.find((user) => user.userId === msg.sender)?.name || "Unknown",
      }));
      setMessages(formattedMessages);
      localMessageCache[userId] = formattedMessages;
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser || !senderId) {
      console.error("Message, selected user, or sender ID is missing.");
      return;
    }
  
    const newMessage = {
      message,
      senderId,
      receiverId: selectedUser,
      dateAndTimeSend: new Date().toISOString(),
      senderName: "You",
    };
  
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/users/message-send`, newMessage);
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      localMessageCache[selectedUser] = [...(localMessageCache[selectedUser] || []), newMessage];
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown time";
    
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">

      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="text-gray-700 dark:text-gray-300" />
      </button>

      <div className={`w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:relative z-40`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Messages</h1>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical className="text-gray-500 dark:text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {totalUsersList
            .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
            .map((user) => (
              <div
                key={user.userId}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedUser === user.userId ? "bg-blue-50 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                onClick={() => handleUserClick(user.userId)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {getInitials(user.name)}
                  </div>
                  {user.online ? (
                    <CircleDot className="absolute bottom-0 right-0 text-green-500 bg-white dark:bg-gray-800 rounded-full" size={16} />
                  ) : (
                    <Circle className="absolute bottom-0 right-0 text-gray-400 bg-white dark:bg-gray-800 rounded-full" size={16} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{user.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {user.lastMessageTime ? formatTime(user.lastMessageTime) : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.lastMessage || "No messages yet"}
                    </p>
                    {user.unreadCount ? (
                      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {user.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col h-screen ${selectedUser ? 'block' : 'hidden md:flex'}`}>
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSelectedUser(null)}
                >
                  <ArrowLeft className="text-gray-700 dark:text-gray-300" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {getInitials(totalUsersList.find(u => u.userId === selectedUser)?.name || "U")}
                  </div>
                  {totalUsersList.find(u => u.userId === selectedUser)?.online ? (
                    <CircleDot className="absolute bottom-0 right-0 text-green-500 bg-white dark:bg-gray-800 rounded-full" size={14} />
                  ) : (
                    <Circle className="absolute bottom-0 right-0 text-gray-400 bg-white dark:bg-gray-800 rounded-full" size={14} />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-white">
                    {totalUsersList.find(u => u.userId === selectedUser)?.name || "Unknown User"}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {totalUsersList.find(u => u.userId === selectedUser)?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreVertical className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === senderId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 ${msg.sender === senderId 
                        ? "bg-blue-500 text-white rounded-br-none" 
                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"}`}
                    >
                      {msg.sender !== senderId && (
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-1">
                          {msg.senderName}
                        </div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${msg.sender === senderId ? "text-blue-100" : "text-gray-400"}`}>
                        {formatTime(msg.dateAndTimeSend || msg.timestamp)}
                        {msg.sender === senderId && (
                          msg.read ? (
                            <CheckCheck className="ml-1" size={14} />
                          ) : (
                            <Check className="ml-1" size={14} />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Smile size={20} />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white px-4"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`p-2 rounded-full ${message.trim() ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              <User className="text-gray-400 dark:text-gray-500" size={48} />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No chat selected</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Select a conversation from the sidebar to start chatting or search for users to connect with.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RealTimeChatApp;