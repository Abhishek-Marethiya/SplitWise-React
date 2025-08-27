import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { GroupContext } from "../context/GroupContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const AddMember = () => {
  const { currentUser, allUsers, isLogin, createUser } = useContext(AuthContext);
  const { addMemberToGroup } = useContext(GroupContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const groupId = searchParams.get("groupId");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLogin) navigate("/");
  }, [isLogin, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please enter both name and email!");
      return;
    }

    // Check if user already exists
    const userExists = (allUsers || []).some(
      (u) => (u.email || "").toLowerCase() === email.toLowerCase()
    );
    const userNameExists = (allUsers || []).some(
      (u) => (u.name || "").toLowerCase() === name.toLowerCase()
    );

    if (userExists) {
      toast.error("A user with this email already exists!");
      return;
    }
    if (userNameExists) {
      toast.error("A user with this name already exists!");
      return;
    }

    try {
      // Create new user with default password
      const newUser = await createUser({
        name: name.trim(),
        email: email.trim(),
        password: "Default@123",
      });

      // Add the new user to the group if groupId is provided
      if (groupId) {
        await addMemberToGroup(groupId, newUser.name);
        toast.success("Member added successfully!");
        navigate(`/group/${groupId}`);
      } else {
        // If no groupId, just navigate to create group page
        toast.success("User created successfully! You can now create a group.");
        navigate(`/create-group`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Form card */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black-600 tracking-[.1em]">
          Add New Member & User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
            />
          </div>

          {/* Email input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
            />
          </div>

          {/* Info text */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Default Login Credentials:</p>
            <p>Password: <span className="font-mono">Default@123</span></p>
            <p className="text-xs mt-1">The user can change their password after first login.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full btn-primary text-white py-2 px-4 rounded-md font-medium transition-smooth"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
