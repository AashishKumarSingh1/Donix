export const LogoutModal = ({ isVisible, onClose, onConfirm }: { isVisible: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Confirm Logout</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg">Logout</button>
        </div>
      </div>
    </div>
    );
  };