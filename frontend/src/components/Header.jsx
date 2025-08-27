import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Header({username, onLogout}) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Function to get back button text and navigation based on current path
  const getBackButtonInfo = () => {
    const path = location.pathname;
    
    if (path.startsWith('/add-expense/')) {
      const groupId = path.split('/')[2];
      return {
        text: "← Back to Group",
        onClick: () => navigate(`/group/${groupId}`)
      };
    }
    
    if (path.startsWith('/edit-expense/')) {
      const groupId = path.split('/')[2];
      return {
        text: "← Back to Group",
        onClick: () => navigate(`/group/${groupId}`)
      };
    }
    
    if (path.startsWith('/group/')) {
      return {
        text: "← Back to Groups",
        onClick: () => navigate('/')
      };
    }
    
    if (path.startsWith('/expense/')) {
      const expenseId = path.split('/')[2];
      return {
        text: "← Back to Expense",
        onClick: () => navigate(`/expense/${expenseId}`)
      };
    }
    
    if (path === '/create-group') {
      return {
        text: "← Back to Groups",
        onClick: () => navigate('/')
      };
    }
    
    if (path === '/add-member') {
      const searchParams = new URLSearchParams(location.search);
      const groupId = searchParams.get('groupId');
      if (groupId) {
        return {
          text: "← Back to Group",
          onClick: () => navigate(`/group/${groupId}`)
        };
      }
      return {
        text: "← Back to Groups",
        onClick: () => navigate('/')
      };
    }
    
    // Default case - no back button
    return null;
  };

  const backButtonInfo = getBackButtonInfo();
  
  return (
    <header className="bg-white shadow-md py-4 transition-smooth">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
      
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="logo bg-white/20 backdrop-blur-sm rounded-full">
            <img src="./images/icons8-rupee-24.png" alt="logo" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 animate-fadeIn">
            Welcome, <span className="text-cyan-600">{username.name}</span>
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          {backButtonInfo && (
            <button
              onClick={backButtonInfo.onClick}
              className="btn-primary text-white px-4 py-2 rounded-md flex items-center gap-2 transition-smooth"
            >
              {backButtonInfo.text}
            </button>
          )}
          
          <button
            onClick={onLogout}
            className="px-4 py-[6.5px] rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-smooth"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
