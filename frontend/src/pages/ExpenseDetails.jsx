// // src/pages/ExpenseDetails.jsx
// import { useEffect, useState } from "react";
// import {  useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { ExpenseContext } from "../context/ExpenseContext";
// import { useContext } from "react";

// export default function ExpenseDetails({expenseId}) {
//   const navigate = useNavigate();
//   const {currentUser,logout}=useContext(AuthContext);
//   const { getExpenseById } = useContext(ExpenseContext);

//   const [expense, setExpense] = useState(null);
//   const [toasts, setToasts] = useState([]);
//     const {isLogin}=useContext(AuthContext);
//   if(!isLogin){
//     navigate('/');
//   }

//   useEffect(() => {
//     async function fetchExpense() {
//       const res = await getExpenseById(expenseId);
//       if (!res) {
//         showToast("Expense not found", "error");
//         return;
//       }
//       setExpense(res);
//     }
//     fetchExpense();
//   }, [expenseId, getExpenseById]);

//   function showToast(message, type = "success") {
//     const id = Date.now();
//     setToasts((prev) => [...prev, { id, message, type }]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 3000);
//   }

//   if (!user) {
//     navigate("/");
//     return null;
//   }

//   if (!expense) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         Loading expense details...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-purple-50 to-green-50 min-h-screen">
//       {/* Toasts */}
//       <div className="fixed top-5 right-5 z-50 space-y-2">
//         {toasts.map((t) => (
//           <div
//             key={t.id}
//             className={`px-4 py-2 rounded shadow text-white transition-smooth ${
//               t.type === "success" ? "bg-green-500" : "bg-red-500"
//             }`}
//           >
//             {t.message}
//           </div>
//         ))}
//       </div>

//       {/* Header */}
//       <header className="bg-white shadow-md py-4">
//         <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
//           <div
//             className="flex items-center space-x-4 cursor-pointer"
//             onClick={() => navigate("/home")}
//           >
//             <div className="logo bg-white/20 backdrop-blur-sm rounded-full">
//               <img src="/images/icons8-rupee-24.png" alt="₹" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-800 animate-fadeIn">
//               Welcome,{" "}
//               <span className="text-cyan-600">{user?.name || "User"}</span>
//             </h1>
//           </div>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="btn-primary text-white px-4 py-2 rounded-md"
//             >
//               ← Back to Expenses
//             </button>
//             <button
//               onClick={logout}
//               className="px-4 py-[6.5px] rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Page Title */}
//       <h1 className="text-2xl font-bold text-black-600 mb-4 text-center mt-10 tracking-[.1em]">
//         Expense Details
//       </h1>

//       {/* Expense Card */}
//       <div className="max-w-xl mx-auto py-10 px-6 bg-white shadow rounded-lg my-4">
//         <div className="text-gray-600">
//           Date: {new Date(expense.date).toLocaleDateString()}
//         </div>
//         <div className="text-lg text-green-600 font-semibold">
//           ₹{expense.amount}
//         </div>
//         <div className="text-sm text-gray-600">
//           Paid by:{" "}
//           <span className="text-blue-800 font-bold">{expense.paidBy}</span>
//         </div>
//         <div className="text-sm text-gray-600">
//           Split between:{" "}
//           <span className="font-medium text-gray-800">
//             {expense.splitBetween
//               .map((e) => `${e.memberName} (₹${e.share})`)
//               .join(", ")}
//           </span>
//         </div>

//         <hr className="my-4" />

//         {/* Individual Shares */}
//         <h3 className="text-lg font-semibold text-gray-800">
//           Individual Shares
//         </h3>
//         <div className="space-y-2">
//           {expense.splitBetween.map((e, idx) => (
//             <div
//               key={idx}
//               className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
//             >
//               <span className="font-medium text-gray-800">{e.memberName}</span>
//               <span className="text-lg font-semibold text-gray-900">
//                 ₹{e.share.toFixed(2)}
//               </span>
//             </div>
//           ))}
//         </div>

//         <hr className="my-4" />

//         {/* Settlements */}
//         <h3 className="text-lg font-semibold text-gray-800">Settlement</h3>
//         <div className="space-y-2">
//           {expense.splitBetween
//             .filter((e) => e.memberName !== expense.paidBy)
//             .map((entry, idx) => (
//               <div
//                 key={idx}
//                 className="flex items-center p-3 mb-1 border border-red-200 rounded-lg"
//               >
//                 <span className="text-red-600">
//                   {entry.memberName} owes {expense.paidBy} ₹
//                   {entry.share.toFixed(2)}
//                 </span>
//               </div>
//             ))}
//         </div>

//         <hr className="my-4" />

//         {/* Split Summary */}
//         <div className="text-center text-gray-700">
//           <div className="text-2xl font-bold text-gray-800">
//             ₹{expense.amount.toFixed(2)}
//           </div>
//           <div className="text-gray-600">
//             split among {expense.splitBetween.length} people
//           </div>
//           <div className="text-sm text-gray-500 mt-1">
//             Paid by {expense.paidBy}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
