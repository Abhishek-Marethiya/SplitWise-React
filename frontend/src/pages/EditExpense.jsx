// // src/pages/EditExpense.jsx
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useGroup } from "../context/GroupContext";
// import { useExpense } from "../context/ExpenseContext";

// export default function EditExpense() {
//   const { groupId, expenseId } = useParams();
//   const navigate = useNavigate();

//   const { user, logout } = useAuth();
//   const { getGroupById } = useGroup();
//   const { getExpenseById, updateExpense } = useExpense();

//   const [group, setGroup] = useState(null);
//   const [expense, setExpense] = useState(null);
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paidBy, setPaidBy] = useState("");
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [toast, setToast] = useState(null);
//     const {isLogin}=useContext(AuthContext);
//   if(!isLogin){
//     navigate('/');
//   }
//   // Load group and expense
//   useEffect(() => {
//     async function fetchData() {
//       const g = await getGroupById(groupId);
//       setGroup(g);

//       const exp = await getExpenseById(expenseId);
//       setExpense(exp);

//       if (exp) {
//         setTitle(exp.description);
//         setAmount(exp.amount);
//         setPaidBy(exp.paidBy);
//         setSelectedMembers(exp.splitBetween.map((p) => p.memberName));
//       }
//     }
//     fetchData();
//   }, [groupId, expenseId, getGroupById, getExpenseById]);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const toggleMember = (name) => {
//     setSelectedMembers((prev) =>
//       prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !amount || !paidBy) {
//       showToast("All fields are required", "error");
//       return;
//     }
//     if (selectedMembers.length < 1) {
//       showToast("Please select at least 1 participant", "error");
//       return;
//     }

//     const splitBetween = selectedMembers.map((name) => ({
//       memberName: name,
//       share: parseFloat((amount / selectedMembers.length).toFixed(2)),
//     }));

//     const updatedExpense = {
//       ...expense,
//       description: title,
//       amount: parseFloat(amount),
//       paidBy,
//       splitType: "equal",
//       splitBetween,
//       date: new Date().toISOString(),
//     };

//     try {
//       await updateExpense(updatedExpense);
//       showToast("Expense updated!");
//       navigate(`/group/${groupId}`);
//     } catch (err) {
//       showToast("Something went wrong", "error");
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="bg-gradient-to-br from-purple-50 to-green-50 min-h-screen">
//       {/* Header */}
//       <header className="bg-white shadow-md py-4 transition-smooth">
//         <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
//           <div
//             className="flex items-center space-x-4 cursor-pointer"
//             onClick={() => navigate("/home")}
//           >
//             <div className="logo bg-white/20 backdrop-blur-sm rounded-full">
//               <img src="/images/icons8-rupee-24.png" alt="logo" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-800 animate-fadeIn">
//               Welcome, <span className="text-cyan-600">{user?.name}</span>
//             </h1>
//           </div>

//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => navigate("/home")}
//               className="btn-primary text-white px-4 py-2 rounded-md flex items-center gap-2 transition-smooth"
//             >
//               Groups
//             </button>
//             <button
//               onClick={logout}
//               className="px-4 py-[6.5px] rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-smooth"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Toast */}
//       {toast && (
//         <div
//           className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow text-white ${
//             toast.type === "success" ? "bg-green-500" : "bg-red-500"
//           } animate-slideIn`}
//         >
//           {toast.msg}
//         </div>
//       )}

//       {/* Form */}
//       <div className="max-w-xl mx-auto py-10 px-6 bg-white shadow rounded-lg mt-10 animate-fadeIn">
//         <h1 className="text-2xl font-bold text-black-600 mb-4 tracking-[.1em]">
//           Edit Expense
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Group Name */}
//           <div className="space-y-2">
//             <label className="block mb-1 font-semibold text-gray-700">
//               Group Name
//             </label>
//             <input
//               value={group?.name || ""}
//               readOnly
//               className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
//             />
//           </div>

//           {/* Title */}
//           <div>
//             <label className="block mb-1 font-semibold text-gray-700">
//               Expense Title
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
//               required
//             />
//           </div>

//           {/* Amount */}
//           <div>
//             <label className="block mb-1 font-semibold text-gray-700">
//               Amount
//             </label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
//               required
//             />
//           </div>

//           {/* Participants */}
//           <div>
//             <label className="block mb-1 font-medium">Split Between</label>
//             <div className="space-y-2 max-h-48 overflow-y-auto border p-3 rounded bg-gray-50">
//               {group?.participants?.map((member) => (
//                 <div key={member} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`user-${member}`}
//                     value={member}
//                     checked={selectedMembers.includes(member)}
//                     onChange={() => toggleMember(member)}
//                     className="mr-2"
//                   />
//                   <label htmlFor={`user-${member}`}>{member}</label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Paid By */}
//           <div>
//             <label className="block mb-1 font-semibold text-gray-700">
//               Paid By
//             </label>
//             <select
//               value={paidBy}
//               onChange={(e) => setPaidBy(e.target.value)}
//               className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
//               required
//             >
//               <option value="">Select option</option>
//               {group?.participants?.map((member) => (
//                 <option key={member} value={member}>
//                   {member}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <p className="text-green-600 italic w-full text-center py-4 mt-10">
//             The amount will be shared equally between the selected members.
//           </p>

//           <button
//             type="submit"
//             className="btn-primary text-white px-4 py-2 rounded w-full"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
