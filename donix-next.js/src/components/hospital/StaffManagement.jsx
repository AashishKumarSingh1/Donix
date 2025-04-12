import React, { useState } from 'react';
import { 
  AiOutlineUser, 
  AiOutlineTeam, 
  AiOutlineSchedule, 
  AiOutlineCheck, 
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineFileText,
  AiOutlineLock,
  AiOutlineBell,
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineCloseCircle,
} from 'react-icons/ai';
import { HiOutlineDocumentReport, HiOutlineClipboardList, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { FaUserMd, FaUserNurse, FaUserShield } from 'react-icons/fa';

const DoctorStaffManagement = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('registrations');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Sample data
  const [doctorApplications, setDoctorApplications] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', license: 'MD123456', status: 'pending', submitted: '2023-11-15' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Nephrology', license: 'MD789012', status: 'pending', submitted: '2023-11-18' },
    { id: 3, name: 'Dr. Emily Wilson', specialty: 'Hepatology', license: 'MD345678', status: 'approved', submitted: '2023-11-10' }
  ]);
  
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: 'Dr. Robert Smith', role: 'doctor', email: 'r.smith@hospital.org', lastActive: '2023-11-20' },
    { id: 2, name: 'Nurse Jane Doe', role: 'nurse', email: 'j.doe@hospital.org', lastActive: '2023-11-21' },
    { id: 3, name: 'Admin Alex Brown', role: 'admin', email: 'a.brown@hospital.org', lastActive: '2023-11-22' },
    { id: 4, name: 'Coordinator Lisa Wang', role: 'coordinator', email: 'l.wang@hospital.org', lastActive: '2023-11-19' }
  ]);
  
  const [followUps, setFollowUps] = useState([
    { id: 1, patient: 'John Smith', doctor: 'Dr. Robert Smith', date: '2023-11-25', status: 'scheduled', type: 'Post-Op Check' },
    { id: 2, patient: 'Emma Johnson', doctor: 'Dr. Sarah Johnson', date: '2023-11-28', status: 'pending', type: 'Lab Results' },
    { id: 3, patient: 'Michael Chen', doctor: 'Dr. Emily Wilson', date: '2023-12-02', status: 'scheduled', type: 'Consultation' }
  ]);

  // Handle application approval/rejection
  const handleApplicationAction = (id, action) => {
    setDoctorApplications(doctorApplications.map(app => 
      app.id === id ? { ...app, status: action } : app
    ));
  };

  // Handle role change
  const handleRoleChange = (id, newRole) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === id ? { ...staff, role: newRole } : staff
    ));
  };

  // Filter applications based on search
  const filteredApplications = doctorApplications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center">
          <button 
            className="md:hidden mr-4"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <AiOutlineCloseCircle size={20} /> : <AiOutlineMenu size={20} />}
          </button>
          <FaUserMd className="text-2xl mr-2 text-blue-500" />
          <h1 className="text-xl font-bold">Doctor & Staff Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <AiOutlineSearch size={20} />
          {darkMode ? (
            <HiOutlineSun size={24} onClick={() => setDarkMode(!darkMode)} className="cursor-pointer" />
          ) : (
            <HiOutlineMoon size={24} onClick={() => setDarkMode(!darkMode)} className="cursor-pointer" />
          )}
          <div className="relative">
            <AiOutlineBell className="text-xl cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <AiOutlineUser />
          </div>
        </div>
        
      </header>

      
      <div className="flex flex-1 overflow-hidden">
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileSidebarOpen(false)}></div>
        )}
        <aside className={`${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-64 transform translate-x-0' : 'fixed -translate-x-full'} md:relative md:translate-x-0 md:w-64 p-4 border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} overflow-y-auto transition-transform duration-300 ease-in-out`}>
          <nav>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('registrations');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded flex items-center ${activeTab === 'registrations' ? (darkMode ? 'bg-blue-900' : 'bg-blue-100 text-blue-800') : ''}`}
                >
                  <AiOutlineFileText className="mr-2" />
                  Doctor Registrations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('staff');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded flex items-center ${activeTab === 'staff' ? (darkMode ? 'bg-blue-900' : 'bg-blue-100 text-blue-800') : ''}`}
                >
                  <AiOutlineTeam className="mr-2" />
                  Staff Management
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('roles');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded flex items-center ${activeTab === 'roles' ? (darkMode ? 'bg-blue-900' : 'bg-blue-100 text-blue-800') : ''}`}
                >
                  <AiOutlineLock className="mr-2" />
                  Role Management
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('followups');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded flex items-center ${activeTab === 'followups' ? (darkMode ? 'bg-blue-900' : 'bg-blue-100 text-blue-800') : ''}`}
                >
                  <AiOutlineSchedule className="mr-2" />
                  Follow-ups & Reminders
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'registrations' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">Doctor Registrations</h2>
                <div className="relative w-full md:w-auto">
                  <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>

              <div className={`rounded-lg overflow-hidden shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-x-auto`}>
                <table className="w-full min-w-max">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Specialty</th>
                      <th className="p-3 text-left">License</th>
                      <th className="p-3 text-left">Submitted</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(application => (
                      <tr key={application.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="p-3">{application.name}</td>
                        <td className="p-3">{application.specialty}</td>
                        <td className="p-3">{application.license}</td>
                        <td className="p-3">{application.submitted}</td>
                        <td className="p-3">
                          {application.status === 'approved' ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                              Approved
                            </span>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {application.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleApplicationAction(application.id, 'approved')}
                                className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                <AiOutlineCheck />
                              </button>
                              <button 
                                onClick={() => handleApplicationAction(application.id, 'rejected')}
                                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                <AiOutlineClose />
                              </button>
                              <button className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                <HiOutlineDocumentReport />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <h3 className="font-semibold mb-2">License Verification</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Connect to medical board databases to automatically verify licenses. Click "Verify" on pending applications to check credentials.
                </p>
                <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                  Connect to Medical Board API
                </button>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Staff Management</h2>
              
              <div className={`rounded-lg overflow-hidden shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-x-auto`}>
                <table className="w-full min-w-max">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Last Active</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers.map(staff => (
                      <tr key={staff.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="p-3">{staff.name}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            staff.role === 'admin' ? (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800') :
                            staff.role === 'doctor' ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800') :
                            staff.role === 'nurse' ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') :
                            (darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                          }`}>
                            {staff.role === 'admin' && <FaUserShield className="mr-1" />}
                            {staff.role === 'doctor' && <FaUserMd className="mr-1" />}
                            {staff.role === 'nurse' && <FaUserNurse className="mr-1" />}
                            {staff.role === 'coordinator' && <AiOutlineTeam className="mr-1" />}
                            {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                          </span>
                        </td>
                        <td className="p-3">{staff.email}</td>
                        <td className="p-3">{staff.lastActive}</td>
                        <td className="p-3">
                          <button className={`mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                            Edit
                          </button>
                          <button className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}>
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <h3 className="font-semibold mb-3">Add New Staff Member</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select 
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                      <option value="coordinator">Transplant Coordinator</option>
                      <option value="admin">Hospital Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="md:col-span-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Add Staff Member
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Role-Based Access Control</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="font-semibold mb-3">Role Permissions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                      <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <tr>
                          <th className="p-2 text-left">Role</th>
                          <th className="p-2 text-left">Patient Data</th>
                          <th className="p-2 text-left">Donor Data</th>
                          <th className="p-2 text-left">Admin</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className="p-2">Admin</td>
                          <td className="p-2">Full Access</td>
                          <td className="p-2">Full Access</td>
                          <td className="p-2">Full Access</td>
                        </tr>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className="p-2">Doctor</td>
                          <td className="p-2">Full Access</td>
                          <td className="p-2">View Only</td>
                          <td className="p-2">No Access</td>
                        </tr>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className="p-2">Nurse</td>
                          <td className="p-2">Limited</td>
                          <td className="p-2">No Access</td>
                          <td className="p-2">No Access</td>
                        </tr>
                        <tr>
                          <td className="p-2">Coordinator</td>
                          <td className="p-2">View Only</td>
                          <td className="p-2">Full Access</td>
                          <td className="p-2">No Access</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="font-semibold mb-3">Modify Role Permissions</h3>
                  <form>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Select Role</label>
                      <select 
                        className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        <option>Hospital Admin</option>
                        <option>Doctor</option>
                        <option>Nurse</option>
                        <option>Transplant Coordinator</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium">Access Permissions</h4>
                      <div className="flex items-center">
                        <input type="checkbox" id="patientData" className="mr-2" />
                        <label htmlFor="patientData">Full Patient Data Access</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="donorData" className="mr-2" />
                        <label htmlFor="donorData">Full Donor Data Access</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="sensitiveData" className="mr-2" />
                        <label htmlFor="sensitiveData">Access to Sensitive Data</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="adminFunctions" className="mr-2" />
                        <label htmlFor="adminFunctions">Administrative Functions</label>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Update Permissions
                    </button>
                  </form>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="font-semibold mb-3">Change User Roles</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <tr>
                        <th className="p-2 text-left">User</th>
                        <th className="p-2 text-left">Current Role</th>
                        <th className="p-2 text-left">New Role</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffMembers.map(staff => (
                        <tr key={staff.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className="p-2">{staff.name}</td>
                          <td className="p-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              staff.role === 'admin' ? (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800') :
                              staff.role === 'doctor' ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800') :
                              staff.role === 'nurse' ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') :
                              (darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                            }`}>
                              {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                            </span>
                          </td>
                          <td className="p-2">
                            <select
                              value={staff.role}
                              onChange={(e) => handleRoleChange(staff.id, e.target.value)}
                              className={`p-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            >
                              <option value="admin">Admin</option>
                              <option value="doctor">Doctor</option>
                              <option value="nurse">Nurse</option>
                              <option value="coordinator">Coordinator</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <button 
                              onClick={() => handleRoleChange(staff.id, staff.role)} // In a real app, this would save to backend
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Save
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

          {activeTab === 'followups' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">Follow-ups & Reminders</h2>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full md:w-auto">
                  + Schedule New Follow-up
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="font-semibold mb-3">Upcoming (Next 7 days)</h3>
                  <div className="space-y-3">
                    {followUps.filter(f => f.status === 'scheduled').map(followUp => (
                      <div 
                        key={followUp.id} 
                        className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{followUp.patient}</span>
                          <span className="text-sm">{followUp.date}</span>
                        </div>
                        <div className="text-sm mt-1">With {followUp.doctor}</div>
                        <div className="text-xs mt-1">{followUp.type}</div>
                        <button className="mt-2 text-xs text-blue-500 hover:text-blue-700">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="font-semibold mb-3">Pending Scheduling</h3>
                  <div className="space-y-3">
                    {followUps.filter(f => f.status === 'pending').map(followUp => (
                      <div 
                        key={followUp.id} 
                        className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{followUp.patient}</span>
                          <span className="text-sm">Not scheduled</span>
                        </div>
                        <div className="text-sm mt-1">With {followUp.doctor}</div>
                        <div className="text-xs mt-1">{followUp.type}</div>
                        <div className="flex space-x-2 mt-2">
                          <button className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Schedule
                          </button>
                          <button className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="font-semibold mb-3">Reminder Settings</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Reminder Time</label>
                      <select className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                        <option>15 minutes before</option>
                        <option>30 minutes before</option>
                        <option>1 hour before</option>
                        <option>1 day before</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Notification Methods</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="emailReminders" className="mr-2" defaultChecked />
                          <label htmlFor="emailReminders">Email Reminders</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="smsReminders" className="mr-2" />
                          <label htmlFor="smsReminders">SMS Reminders</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="appNotifications" className="mr-2" defaultChecked />
                          <label htmlFor="appNotifications">In-App Notifications</label>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save Settings
                    </button>
                  </form>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="font-semibold mb-3">Schedule New Follow-up</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Patient</label>
                    <select className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                      <option>Select patient...</option>
                      <option>John Smith</option>
                      <option>Emma Johnson</option>
                      <option>Michael Chen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Doctor</label>
                    <select className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                      <option>Select doctor...</option>
                      <option>Dr. Robert Smith</option>
                      <option>Dr. Sarah Johnson</option>
                      <option>Dr. Emily Wilson</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                      <option>Post-Op Check</option>
                      <option>Lab Results</option>
                      <option>Consultation</option>
                      <option>Medication Review</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea 
                      rows="3"
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="md:col-span-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Schedule Follow-up
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorStaffManagement;