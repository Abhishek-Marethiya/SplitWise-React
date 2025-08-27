import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { GroupContext } from "../context/GroupContext";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const CreateGroup = () => {
  const { currentUser, allUsers, isLogin } = useContext(AuthContext);
  const { groups, createGroup } = useContext(GroupContext);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  // Auto-select the current user when component loads
  useEffect(() => {
    if (currentUser && currentUser._id) {
      setSelectedUsers([currentUser._id]);
    }
  }, [currentUser]);

  
  
    if (!isLogin) navigate("/");


  // Handle checkbox toggle
  const toggleUser = (userId) => {
    console.log(userId);
    
    // Prevent current user from being unchecked
    if (userId === currentUser?._id) {
      return;
    }
    
    setSelectedUsers((prev) => {
      const updated = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];

      console.log("selected users:", updated);
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate group names
    if (groups.some((g) => (g.name).toLowerCase() === groupName.toLowerCase())) {
      toast.error("Group with this name already exists!");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error("Please select at least 2 participants.");
      return;
    }

    try {
      const selectedNames = allUsers
    .filter(u => selectedUsers.includes(u._id))
    .map(u => u.name.trim());
      await createGroup(groupName, selectedNames);
      navigate("/");
    } catch (err) {
      console.error("Group creation error", err);
      toast.error("Error while creating group.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-green-50 min-h-screen">

      {/* Create Group Form */}
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md animate-fadeIn">
        <h1 className="text-2xl font-bold mb-6 text-center tracking-[.1em]">
          Create a Group
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group name */}
          <div>
            <label className="block mb-1 font-medium">Group Name</label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded input-focus"
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block mb-1 font-medium">Add Participants</label>
            <p className="text-sm text-gray-600 mb-2">
              You are automatically included in the group. Select additional participants below:
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto border p-3 rounded bg-gray-50">
              {allUsers?.map((user) => (
                <div key={user._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`user-${user._id}`}
                    value={user._id}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUser(user._id)}
                    disabled={user._id === currentUser?._id}
                    className={`mr-2 ${user._id === currentUser?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <label
                    htmlFor={`user-${user._id}`}
                    className={
                      user._id === currentUser?._id
                        ? "text-green-600 font-semibold"
                        : ""
                    }
                  >
                    {user.name} {user._id === currentUser?._id && "(You)"}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button
             onClick={() => navigate(`/add-member`)}
             className="text-blue-600 font-medium hover:underline flex items-center"
           >
             + Create User
           </button>
          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full text-white py-2 rounded"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
