import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

const AuthPage = () => {
  const { setIsLogin,setCurrentUser} = useContext(AuthContext);
  const navigate=useNavigate();
  const [isLoginPage, setIsLoginPage] = useState(true);
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginPage && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const endpoint = isLoginPage ? "http://localhost:8080/api/auth/login" : "http://localhost:8080/api/auth/signup";
      const body = isLoginPage
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };


      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(body),
      });

      const Userdata = await res.json();

      if (!res.ok) {
        toast.error(Userdata.message || Userdata.error || "Something went wrong");
        return;
      }

      if (isLoginPage) {
        setCurrentUser(Userdata);
        setIsLogin(true);
        toast.success("Logged in successfully!");
        navigate('/');
      } else {
      
        toast.success("Account created successfully! Please sign in.");
        setIsLoginPage(true)
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const toggleForm = () => setIsLoginPage(!isLoginPage);

  return (
    <div className="min-h-screen flex">
 
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white relative overflow-hidden bg-[linear-gradient(135deg,#0ea5e9,#06b6d4)]">
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/30 rounded-full p-3">
                <img src="./images/icons8-rupee-24.png" alt="logo" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Splitwise</h1>
            <p className="text-xl opacity-90 mb-8">
              Split expenses with friends and family
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="hero-feature flex items-center space-x-4">
              <div className="bg-white/30 rounded-full p-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <span className="text-left">Add friends and split bills easily</span>
            </div>

            <div className="hero-feature flex items-center space-x-4">
              <div className="bg-white/30 rounded-full p-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-left">Track expenses and balances</span>
            </div>

            <div className="hero-feature flex items-center space-x-4">
              <div className="bg-white/30 rounded-full p-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <span className="text-left">Settle up with one click</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-[linear-gradient(135deg,#0ea5e9,#06b6d4)] rounded-full p-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-[linear-gradient(135deg,#0ea5e9,#06b6d4)] bg-clip-text text-transparent">
              Splitwise
            </h1>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {isLoginPage ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-gray-500">
              {isLoginPage
                ? "Sign in to your account to continue"
                : "Join thousands who split expenses effortlessly"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginPage && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required={!isLoginPage}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-cyan-400 transition"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-cyan-400 transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-cyan-400 transition"
              />
            </div>

            {!isLoginPage && (
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required={!isLoginPage}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-cyan-400 transition"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[linear-gradient(135deg,#0ea5e9,#06b6d4)] text-white py-2 px-4 rounded-md font-medium transition hover:opacity-90"
            >
              {isLoginPage ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-2 border rounded-md transition hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Toggle */}
          <div className="text-center text-sm mt-6">
            <span className="text-gray-500">
              {isLoginPage ? "Don't have an account?" : "Already have an account?"}{" "}
            </span>
            <button
              type="button"
              onClick={toggleForm}
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              {isLoginPage ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
