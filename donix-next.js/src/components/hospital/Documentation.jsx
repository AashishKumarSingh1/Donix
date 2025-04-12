import React, { useState } from 'react';
import { AiOutlineFileText, AiOutlineUserAdd, AiOutlineSearch, AiOutlineCheck, AiOutlineClose, AiOutlineMedicineBox, AiOutlineStar, AiOutlineBell } from 'react-icons/ai';
import { HiOutlineDocumentReport, HiOutlineClipboardList, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

const ComplianceDocumentation = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const [activeTab, setActiveTab] = useState('consent');
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    bloodType: '',
    organNeeded: '',
    priority: 'Medium'
  });
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'John Smith', bloodType: 'O+', organNeeded: 'Kidney', priority: 'High', status: 'Waiting' },
    { id: 2, name: 'Sarah Johnson', bloodType: 'AB-', organNeeded: 'Liver', priority: 'Critical', status: 'Waiting' },
    { id: 3, name: 'Michael Chen', bloodType: 'B+', organNeeded: 'Heart', priority: 'Medium', status: 'Waiting' }
  ]);
  const [matches, setMatches] = useState([
    { id: 1, donor: 'Donor A (O+)', recipient: 'John Smith (O+)', organ: 'Kidney', matchScore: 98, status: 'Pending' },
    { id: 2, donor: 'Donor B (AB-)', recipient: 'Sarah Johnson (AB-)', organ: 'Liver', matchScore: 95, status: 'Pending' }
  ]);
  const [postTransplantPatients, setPostTransplantPatients] = useState([
    { id: 1, name: 'Emma Wilson', organ: 'Kidney', transplantDate: '2023-05-15', lastCheckup: '2023-11-20', status: 'Stable' },
    { id: 2, name: 'David Brown', organ: 'Liver', transplantDate: '2023-06-22', lastCheckup: '2023-11-18', status: 'Improving' }
  ]);

  // Consent Forms Section
  const consentForms = [
    { id: 1, donorName: 'James Wilson', organ: 'Kidney', dateSigned: '2023-11-15', verified: true },
    { id: 2, donorName: 'Lisa Park', organ: 'Liver', dateSigned: '2023-11-18', verified: false },
    { id: 3, donorName: 'Robert Kim', organ: 'Heart', dateSigned: '2023-11-20', verified: true }
  ];

  // Procedure Records Section
  const procedureRecords = [
    { id: 1, donorName: 'James Wilson', organ: 'Kidney', procedureDate: '2023-11-16', surgeon: 'Dr. Smith', hospital: 'City General' },
    { id: 2, donorName: 'Lisa Park', organ: 'Liver', procedureDate: '2023-11-19', surgeon: 'Dr. Johnson', hospital: 'St. Mary' }
  ];

  // Add new recipient
  const handleAddRecipient = (e) => {
    e.preventDefault();
    const newId = recipients.length > 0 ? Math.max(...recipients.map(r => r.id)) + 1 : 1;
    setRecipients([...recipients, { ...newRecipient, id: newId, status: 'Waiting' }]);
    setNewRecipient({ name: '', bloodType: '', organNeeded: '', priority: 'Medium' });
  };

  // Handle match approval/rejection
  const handleMatchAction = (id, action) => {
    setMatches(matches.map(match => 
      match.id === id ? { ...match, status: action } : match
    ));
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Fixed Header */}
      <header className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-10`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AiOutlineStar size={20} />
            <span>Dashboards / Overview</span>
          </div>
          <div className="flex items-center gap-4">
            <AiOutlineSearch size={20} />
            {darkMode ? (
              <HiOutlineSun size={24} onClick={toggleDarkMode} className="cursor-pointer" />
            ) : (
              <HiOutlineMoon size={24} onClick={toggleDarkMode} className="cursor-pointer" />
            )}
            <AiOutlineBell size={20} />
            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </header>
      
      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Compliance & Patient Management</h1>
        
        {/* Navigation Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
          <button
            onClick={() => setActiveTab('consent')}
            className={`px-4 py-2 font-medium ${activeTab === 'consent' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : ''}`}
          >
            <HiOutlineDocumentReport className="inline mr-2" />
            Compliance
          </button>
          <button
            onClick={() => setActiveTab('recipients')}
            className={`px-4 py-2 font-medium ${activeTab === 'recipients' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : ''}`}
          >
            <AiOutlineUserAdd className="inline mr-2" />
            Recipients
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-4 py-2 font-medium ${activeTab === 'matching' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : ''}`}
          >
            <AiOutlineSearch className="inline mr-2" />
            Matching System
          </button>
          <button
            onClick={() => setActiveTab('postTransplant')}
            className={`px-4 py-2 font-medium ${activeTab === 'postTransplant' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : ''}`}
          >
            <AiOutlineMedicineBox className="inline mr-2" />
            Post-Transplant
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'consent' && (
          <div className="space-y-8">
            <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <AiOutlineFileText className="mr-2" />
                  Donor Consent Forms
                </h2>
                <button 
                  onClick={() => setShowConsentForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Add Consent Form
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <tr>
                      <th className="p-3 text-left">Donor Name</th>
                      <th className="p-3 text-left">Organ</th>
                      <th className="p-3 text-left">Date Signed</th>
                      <th className="p-3 text-left">Verified</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consentForms.map(form => (
                      <tr key={form.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="p-3">{form.donorName}</td>
                        <td className="p-3">{form.organ}</td>
                        <td className="p-3">{form.dateSigned}</td>
                        <td className="p-3">
                          {form.verified ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                              Verified
                            </span>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <button className={`mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                            View
                          </button>
                          <button className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <HiOutlineClipboardList className="mr-2" />
                Organ Retrieval Procedure Records
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <tr>
                      <th className="p-3 text-left">Donor Name</th>
                      <th className="p-3 text-left">Organ</th>
                      <th className="p-3 text-left">Procedure Date</th>
                      <th className="p-3 text-left">Surgeon</th>
                      <th className="p-3 text-left">Hospital</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procedureRecords.map(record => (
                      <tr key={record.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="p-3">{record.donorName}</td>
                        <td className="p-3">{record.organ}</td>
                        <td className="p-3">{record.procedureDate}</td>
                        <td className="p-3">{record.surgeon}</td>
                        <td className="p-3">{record.hospital}</td>
                        <td className="p-3">
                          <button className={`mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        
        {activeTab === 'recipients' && (
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h2 className="text-xl font-semibold mb-4">Recipient Registration</h2>
          
          <form onSubmit={handleAddRecipient} className={`mb-6 p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name</label>
                <input
                  type="text"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient({...newRecipient, name: e.target.value})}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Blood Type</label>
                <input
                  type="text"
                  value={newRecipient.bloodType}
                  onChange={(e) => setNewRecipient({...newRecipient, bloodType: e.target.value})}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Organ Needed</label>
                <input
                  type="text"
                  value={newRecipient.organNeeded}
                  onChange={(e) => setNewRecipient({...newRecipient, organNeeded: e.target.value})}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={newRecipient.priority}
                  onChange={(e) => setNewRecipient({...newRecipient, priority: e.target.value})}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Add Recipient
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Blood Type</th>
                  <th className="p-3 text-left">Organ Needed</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map(recipient => (
                  <tr key={recipient.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-3">{recipient.id}</td>
                    <td className="p-3">{recipient.name}</td>
                    <td className="p-3">{recipient.bloodType}</td>
                    <td className="p-3">{recipient.organNeeded}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        recipient.priority === 'Critical' ? (darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800') :
                        recipient.priority === 'High' ? (darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800') :
                        recipient.priority === 'Medium' ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800') :
                        (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                      }`}>
                        {recipient.priority}
                      </span>
                    </td>
                    <td className="p-3">{recipient.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
        
        {activeTab === 'matching' && (
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h2 className="text-xl font-semibold mb-4">AI-Powered Organ Matching System</h2>
          
          <div className="mb-6">
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} mb-4`}>
              <h3 className="font-semibold mb-2">Current Matching Algorithm</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                The system considers blood type compatibility, tissue match, organ size, medical urgency, 
                waiting time, and geographical location to prioritize matches.
              </p>
            </div>
            
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-6">
              Run New Matching Analysis
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <tr>
                  <th className="p-3 text-left">Match ID</th>
                  <th className="p-3 text-left">Donor</th>
                  <th className="p-3 text-left">Recipient</th>
                  <th className="p-3 text-left">Organ</th>
                  <th className="p-3 text-left">Match Score</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(match => (
                  <tr key={match.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-3">{match.id}</td>
                    <td className="p-3">{match.donor}</td>
                    <td className="p-3">{match.recipient}</td>
                    <td className="p-3">{match.organ}</td>
                    <td className="p-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            match.matchScore > 90 ? 'bg-green-500' : 
                            match.matchScore > 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${match.matchScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{match.matchScore}%</span>
                    </td>
                    <td className="p-3">
                      {match.status === 'Approved' ? (
                        <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                          Approved
                        </span>
                      ) : match.status === 'Rejected' ? (
                        <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                          Rejected
                        </span>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {match.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleMatchAction(match.id, 'Approved')}
                            className="mr-2 p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <AiOutlineCheck />
                          </button>
                          <button 
                            onClick={() => handleMatchAction(match.id, 'Rejected')}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <AiOutlineClose />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
        
        {activeTab === 'postTransplant' && (
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h2 className="text-xl font-semibold mb-4">Post-Transplant Patient Monitoring</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h3 className="font-semibold mb-2">Recent Transplants</h3>
              <div className="h-64 overflow-y-auto">
                {postTransplantPatients.map(patient => (
                  <div key={patient.id} className={`mb-3 p-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                    <div className="flex justify-between">
                      <span className="font-medium">{patient.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        patient.status === 'Stable' ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') :
                        patient.status === 'Improving' ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800') :
                        (darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                      }`}>
                        {patient.status}
                      </span>
                    </div>
                    <div className="text-sm mt-1">
                      <div>Organ: {patient.organ}</div>
                      <div>Transplant Date: {patient.transplantDate}</div>
                      <div>Last Checkup: {patient.lastCheckup}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h3 className="font-semibold mb-2">Rejection Risk Analysis</h3>
              <div className={`p-3 rounded mb-3 ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">High Risk Patients: 2</div>
                <div className="text-sm">Require immediate attention</div>
              </div>
              <div className={`p-3 rounded mb-3 ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                <div className="font-medium">Medium Risk Patients: 5</div>
                <div className="text-sm">Schedule additional tests</div>
              </div>
              <div className={`p-3 rounded ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                <div className="font-medium">Low Risk Patients: 12</div>
                <div className="text-sm">Regular monitoring</div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <h3 className="font-semibold mb-2">Add Follow-up Record</h3>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient</label>
                <select className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                  {postTransplantPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date" 
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                  <option>Stable</option>
                  <option>Improving</option>
                  <option>Complications</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea 
                  rows="3"
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                ></textarea>
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save Follow-up
              </button>
            </form>
          </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplianceDocumentation;