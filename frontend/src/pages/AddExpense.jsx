// src/pages/AddExpense.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ExpenseContext } from "../context/ExpenseContext";
import { GroupContext } from "../context/GroupContext";
import toast from "react-hot-toast";

export default function AddExpense() {

    const {groupId}=useParams();
     const navigate = useNavigate();
  const {isLogin}=useContext(AuthContext);
  if(!isLogin){
    navigate('/');
  }
 

  const { currentUser, logout } = useContext(AuthContext);
  const { addExpense } = useContext(ExpenseContext);
  const {currentGroup, setCurrentGroup,getGroupById} = useContext(GroupContext)
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);


  // Fetch group participants
  useEffect(() => {
    async function fetchGroup() {
      const g = await getGroupById(groupId);
      console.log(g);
      
      if (g) setCurrentGroup(g);
    }
    fetchGroup();
  }, [groupId]);
  
  const toggleMember = (name) => {
    setSelectedMembers((prev) =>
      prev.includes(name)
        ? prev.filter((m) => m !== name)
        : [...prev, name]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !paidBy) {
      toast.success("All fields are required", "error");
      return;
    }
    if (selectedMembers.length < 1) {
      toast.error("Please select at least 1 participant");
      return;
    }

    const splitBetween = selectedMembers.map((name) => ({
      memberName: name,
      share: parseFloat((amount / selectedMembers.length).toFixed(2)),
    }));

    const newExpense = {
      groupId,
      description: title,
      amount: parseFloat(amount),
      paidBy,
      splitType: "equal",
      date: new Date().toISOString(),
      splitBetween,
    };

    try {
      await addExpense(newExpense);
      navigate(`/group/${groupId}`);
    } catch (err) {
      toast("Something went wrong", "error");
    }
  };

  if (!currentUser) return null; // redirect logic already in AuthContext or Router guard

  return (
    <div className="bg-gradient-to-br from-purple-50 to-green-50 min-h-screen">
    

      {/* Form */}
      <div className="max-w-xl mx-auto py-10 px-6 bg-white shadow rounded-lg mt-10 animate-fadeIn">
        <h1 className="text-2xl font-bold text-black-600 mb-4 tracking-[.1em]">
          Add New Expense
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div className="space-y-2">
            <label className="block mb-1 font-semibold text-gray-700">
              Group Name
            </label>
            <input
              value={currentGroup?.name || ""}
              readOnly
              className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Expense Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
              required
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block mb-1 font-medium">Split Between</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border p-3 rounded bg-gray-50">
              {currentGroup ?.participants?.map((member) => (
                <div key={member} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`currentuser-${member}`}
                    value={member}
                    checked={selectedMembers.includes(member)}
                    onChange={() => toggleMember(member)}
                    className="mr-2"
                  />
                  <label htmlFor={`currentuser-${member}`}>{member}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Paid By */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Paid By
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
              required
            >
              <option value="">Select option</option>
              {currentGroup?.participants?.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <p className="text-green-600 italic w-full text-center py-4 mt-10">
            The amount will be shared equally between the selected members.
          </p>

          <button
            type="submit"
            className="btn-primary text-white px-4 py-2 rounded w-full"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
