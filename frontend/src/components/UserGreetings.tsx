import React from "react";


interface UserGreetingProps {
  username: string | null;
  role: string | null;
  onLogout: () => void;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ username, role, onLogout }) => {
    console.log("UserGreeting Props:", { username, role }); 
  
    return (
      <div className="flex items-center space-x-4">
        {username ? (
          <>
            <span className="text-black hidden md:block">
              Hello, {username}. Welcome back!
            </span>
            
      
            <button
              onClick={onLogout}
              className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            
          </>
        )}
      </div>
    );
  };
  

export default UserGreeting;
