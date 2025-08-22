import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [allUsers,setAllUsers]=useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    console.log("inside AuthContext");
    
  const checkAuth = async () => {
    setLoading(true)
  try {
    const res = await fetch("http://localhost:8080/api/auth/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.status === 401) {
      setIsLogin(false);
      return;
    }
  
    if (res.ok) {
      console.log("response ok");
      const user = await res.json();
      console.log(user);
      
      setCurrentUser(user);
      setIsLogin(true);
      setLoading(false)
    }
  } catch (err) {
    console.error("Auth check failed", err);
    setIsLogin(false);
  } finally {
    setLoading(false);
  }
};


    const getAllUsers=async () =>{
       try {
        const res = await fetch("http://localhost:8080/api/auth", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
console.log(res);

   if (res.ok) {
      const users = await res.json();
      setAllUsers(users);
      setIsLogin(true);
    } 

  } catch (err) {
    console.error(err);
    setIsLogin(false);
  }
}
    checkAuth();
    getAllUsers();
  }, []);



  const logout = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Logout failed");
        return;
      }

      setCurrentUser(null);
      setIsLogin(false);
      toast.success("Logged out!");
    } catch (err) {
      console.error("Logout error", err);
      toast.error("Something went wrong");
    }

  }
  return (
    <AuthContext.Provider
      value={{ isLogin, currentUser,allUsers, logout,setIsLogin ,setCurrentUser,loading}}
    >
      {children}
    </AuthContext.Provider>
  );
};
