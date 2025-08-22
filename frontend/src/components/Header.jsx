import React from "react";

function Header({username,onLogout}) {
  console.log(username);
  
  return (
    <header className="bg-white shadow-md py-4 transition-smooth">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Logo + Welcome */}
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => (window.location.href = "/")}
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
