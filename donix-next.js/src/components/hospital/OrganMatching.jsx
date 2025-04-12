import React, { useState, useEffect } from 'react';
import { AiOutlineStar, AiOutlineBell, AiOutlineSearch, AiOutlineWarning, AiOutlineHeart } from 'react-icons/ai';
import { HiOutlineSun, HiOutlineMoon, HiOutlineTruck } from 'react-icons/hi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OrganDonationTab = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [blinking, setBlinking] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Blinking effect for urgent alerts
    useEffect(() => {
        const interval = setInterval(() => {
            setBlinking(prev => !prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Sample organ transport data
    const [transports, setTransports] = useState([
        {
            id: 1,
            organ: 'Liver',
            from: 'City General Hospital',
            to: 'Mediversal Transplant Center',
            status: 'In Transit',
            timeRemaining: '3h 25m',
            delay: false
        },
        {
            id: 2,
            organ: 'Kidney',
            from: 'St. Mary Hospital',
            to: 'University Medical Center',
            status: 'Preservation',
            timeRemaining: '12h 45m',
            delay: false
        },
        {
            id: 3,
            organ: 'Heart',
            from: 'Regional Trauma Center',
            to: 'Childrens Hospital',
            status: 'Delayed',
            timeRemaining: '1h 30m (2h delay)',
            delay: true
        }
    ]);

    // Sample pending donations
    const [pendingDonations, setPendingDonations] = useState([
        {
            id: 1,
            donor: 'John D. (O+)',
            organ: 'Kidney',
            hospital: 'City General',
            timePending: '2 hours',
            matchPotential: 'High'
        },
        {
            id: 2,
            donor: 'Sarah M. (AB-)',
            organ: 'Liver',
            hospital: 'St. Mary',
            timePending: '5 hours',
            matchPotential: 'Medium'
        },
        {
            id: 3,
            donor: 'Michael T. (B+)',
            organ: 'Heart',
            hospital: 'University Med',
            timePending: '1 hour',
            matchPotential: 'Critical'
        }
    ]);

    // Approve a donation
    const approveDonation = (id) => {
        setPendingDonations(pendingDonations.filter(donation => donation.id !== id));
    };

    return (
        <div className={`flex flex-col h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Fixed Header */}
            <header className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b border-gray-200 sticky top-0 z-10 w-full`}>
                <div className="flex justify-between items-center w-full max-w-full">
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
    
            {/* Full-width Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto w-full">
                <div className="w-full p-6">
                    <div className="w-full space-y-6">
                        {/* Pending Donations Section */}
                        <div className={`p-6 rounded-lg shadow-lg w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <AiOutlineHeart className="text-red-500" />
                                    Pending Donations
                                </h2>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                <th className="p-3 text-left">Donor</th>
                                                <th className="p-3 text-left">Organ</th>
                                                <th className="p-3 text-left">Hospital</th>
                                                <th className="p-3 text-left">Pending</th>
                                                <th className="p-3 text-left">Match Potential</th>
                                                <th className="p-3 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingDonations.map(donation => (
                                                <tr key={donation.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                    <td className="p-3">{donation.donor}</td>
                                                    <td className="p-3">{donation.organ}</td>
                                                    <td className="p-3">{donation.hospital}</td>
                                                    <td className="p-3">{donation.timePending}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            donation.matchPotential === 'High' ? 'bg-green-100 text-green-800' :
                                                            donation.matchPotential === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {donation.matchPotential}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <button 
                                                            onClick={() => approveDonation(donation.id)}
                                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Donor-Recipient Matching Section */}
                        <div className={`p-6 rounded-lg shadow-lg w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h2 className="text-2xl font-bold mb-4">Donor-Recipient Matching</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                    <h3 className="font-semibold mb-2">Available Organs</h3>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between items-center">
                                            <span>Kidney (O+)</span>
                                            <span className="text-sm text-gray-500">2 available</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <span>Liver (AB-)</span>
                                            <span className="text-sm text-gray-500">1 available</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                                    <h3 className="font-semibold mb-2">Waiting Recipients</h3>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between items-center">
                                            <span>Kidney (O+)</span>
                                            <span className="text-sm text-gray-500">Priority: High</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <span>Liver (AB-)</span>
                                            <span className="text-sm text-gray-500">Priority: Critical</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                    Run Matching Algorithm
                                </button>
                            </div>
                        </div>

                        {/* Real-Time Organ Tracking Section */}
                        <div className={`p-6 rounded-lg shadow-lg w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <HiOutlineTruck className="text-blue-500" />
                                Real-Time Organ Tracking
                            </h2>
                            <div className="space-y-4">
                                {transports.map(transport => (
                                    <div 
                                        key={transport.id}
                                        className={`p-4 rounded-lg border-l-4 ${
                                            transport.delay ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
                                        } ${darkMode ? 'bg-gray-700' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{transport.organ} Transport</h3>
                                                <p className="text-sm">
                                                    {transport.from} → {transport.to}
                                                </p>
                                            </div>
                                            <span className={`text-sm ${
                                                transport.delay ? 'text-red-500' : 'text-green-500'
                                            }`}>
                                                {transport.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Time remaining: {transport.timeRemaining}
                                            </span>
                                            {transport.delay && (
                                                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                                    Emergency Delay
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    View All Transports
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrganDonationTab;