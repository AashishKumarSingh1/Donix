import React, { useState, useEffect } from 'react';
import { AiOutlineStar, AiOutlineBell, AiOutlineSearch, AiOutlineWarning } from 'react-icons/ai';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Profile = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [blinking, setBlinking] = useState(false);

    // Blinking effect for urgent alerts
    useEffect(() => {
        const interval = setInterval(() => {
            setBlinking(prev => !prev);
        }, 1000); // Blink every second
        return () => clearInterval(interval);
    }, []);

    // Transplant trend data
    const transplantTrendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Transplants Completed',
            data: [12, 19, 15, 27, 23, 32],
            borderColor: '#3B82F6',
            backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true,
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: darkMode ? '#fff' : '#333',
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                titleColor: darkMode ? '#FFFFFF' : '#1E293B',
                bodyColor: darkMode ? '#E2E8F0' : '#64748B',
                borderColor: darkMode ? '#334155' : '#E2E8F0',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: darkMode ? '#E2E8F0' : '#64748B'
                }
            },
            y: {
                grid: {
                    color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: darkMode ? '#E2E8F0' : '#64748B',
                    stepSize: 5
                }
            }
        }
    };

    // Alert data
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'new-request',
            title: 'New Organ Donation Request',
            message: 'Liver donation from St. Mary Hospital needs review',
            time: '10 mins ago',
            urgent: true,
            acknowledged: false
        },
        {
            id: 2,
            type: 'status-update',
            title: 'Transplant Status Update',
            message: 'Heart transplant #TH-2023-0421 completed successfully',
            time: '1 hour ago',
            urgent: false,
            acknowledged: true
        },
        {
            id: 3,
            type: 'urgent-match',
            title: 'Urgent Donor-Recipient Match',
            message: 'Blood type AB+ kidney recipient waiting 142 days - potential donor identified',
            time: '2 hours ago',
            urgent: true,
            acknowledged: false
        },
        {
            id: 4,
            type: 'compliance',
            title: 'Compliance Alert',
            message: '3 donor consent forms need verification',
            time: '5 hours ago',
            urgent: false,
            acknowledged: true
        }
    ]);

    // Handle acknowledging an alert
    const acknowledgeAlert = (id) => {
        setAlerts(alerts.map(alert => 
            alert.id === id ? { ...alert, acknowledged: true } : alert
        ));
    };

    return (
        <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Fixed Header */}
            <header className="p-6 bg-inherit border-b border-gray-200 sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <AiOutlineStar size={20} />
                        <span>Dashboards / Overview</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <AiOutlineSearch size={20} />
                        {darkMode ? (
                            <HiOutlineSun size={24} onClick={() => setDarkMode(false)} className="cursor-pointer" />
                        ) : (
                            <HiOutlineMoon size={24} onClick={() => setDarkMode(true)} className="cursor-pointer" />
                        )}
                        <AiOutlineBell size={20} />
                        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
            </header>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-semibold">Hello, Mediversal 👋</h1>
                    </div>
                    <div className="bg-gray-300 w-24 h-24 rounded-lg flex justify-center items-center">
                        <p>QR Code</p>
                    </div>
                </div>
                
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
                        <h2 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Registered Doctors</h2>
                        <p className="text-2xl font-bold">1,248</p>
                    </div>
                    {[
                        { label: 'Total Registered Donors', value: 214 },
                        { label: 'Total Registered Recipients', value: 72 },
                    ].map((item, index) => (
                        <div key={index} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
                            <h2 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</h2>
                            <p className="text-2xl font-bold">{item.value}</p>
                        </div>
                    ))}
                </div>
                
                {/* Donations Section */}
                <div className={`p-6 rounded-lg shadow-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-2xl font-bold mb-4">Donations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
                        {[  
                            { label: 'Pending Donations', value: 56 },
                            { label: 'Approved Donations', value: 214 },
                            { label: 'Completed Donations', value: 72 },
                        ].map((item, index) => (
                            <div key={index} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                                <h2 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</h2>
                                <p className="text-2xl font-bold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transplant Trends Chart */}
                <div className={`p-6 rounded-lg shadow-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-2xl font-bold mb-4">Transplant Trends</h2>
                    <div className="h-80">
                        <Line 
                            data={transplantTrendData} 
                            options={chartOptions}
                        />
                    </div>
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Transplants Section */}
                <div className={`p-6 rounded-lg shadow-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-2xl font-bold mb-4">Transplants</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[  
                            { label: 'Ongoing Transplants', value: 56 },
                            { label: 'Completed Transplants', value: 214 },
                        ].map((item, index) => (
                            <div key={index} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                                <h2 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</h2>
                                <p className="text-2xl font-bold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Pending Approvals Section */}
                <div className={`p-6 rounded-lg shadow-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Pending (Donors)', value: 24 },
                            { label: 'Pending (Recipients)', value: 18 },
                            { label: 'Pending (Transplants)', value: 12 },
                            { label: 'Matching Requests', value: 132 },
                        ].map((item, index) => (
                            <div key={index} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                                <h2 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</h2>
                                <p className="text-2xl font-bold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts & Notifications Section with blinking red bullet */}
                <div className={`p-6 rounded-lg shadow-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <AiOutlineWarning className="text-yellow-500" />
                            Alerts & Notifications
                        </h2>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {alerts.filter(a => !a.acknowledged).length} unread
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div 
                                key={alert.id}
                                className={`p-4 rounded-lg border-l-4 transition-all ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${
                                    alert.urgent 
                                        ? 'border-red-500' 
                                        : alert.type === 'new-request' 
                                            ? 'border-blue-500' 
                                            : 'border-green-500'
                                } ${alert.acknowledged ? 'opacity-80' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold flex items-center gap-2">
                                            {alert.urgent && !alert.acknowledged && (
                                                <span className={`inline-block h-3 w-3 rounded-full ${blinking ? 'bg-red-500' : 'bg-red-300'} mr-2`}></span>
                                            )}
                                            {alert.title}
                                            {alert.acknowledged && (
                                                <span className="text-xs text-gray-500 ml-2">(acknowledged)</span>
                                            )}
                                        </h3>
                                        <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {alert.message}
                                        </p>
                                    </div>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {alert.time}
                                    </span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button 
                                        onClick={() => acknowledgeAlert(alert.id)}
                                        className={`px-3 py-1 text-xs rounded ${
                                            darkMode 
                                                ? 'bg-gray-600 hover:bg-gray-500' 
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        {alert.acknowledged ? 'Viewed' : 'Mark as Read'}
                                    </button>
                                    {alert.urgent && (
                                        <button className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600">
                                            Urgent
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
                    <ul className="space-y-3">
                        {[
                            "Successfully organized a blood donation camp",
                            "Matched a kidney donor with recipient",
                            "Published new blog on organ donation awareness",
                            "Completed liver transplant surgery",
                            "Approved 5 new doctor registrations"
                        ].map((activity, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                    ✔
                                </span>
                                <span>{activity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Profile;