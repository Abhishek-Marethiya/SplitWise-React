// // src/pages/GroupDetails.jsx
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { GroupContext } from "../context/GroupContext";
// import { useContext } from "react";

// export default function GroupDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const {getGroupById}=useContext(GroupContext);

//   const [group, setGroup] = useState(null);
//   const [shares, setShares] = useState({});
//   const [settlements, setSettlements] = useState([]);
//   const {isLogin}=useContext(AuthContext);
//   if(!isLogin){
//     navigate('/');
//   }
//   useEffect(() => {
//     async function fetchGroup() {
//       const g = await getGroupById(id);
//       if (!g) return;
//       setGroup(g);
//       calculateSplit(g.participants, g.payer, g.totalAmount);
//     }
//     fetchGroup();
//   }, [id, getGroupById]);

//   function calculateSplit(participants, payer, totalAmount) {
//     const perHead = totalAmount / participants.length;

//     // each member's share
//     const newShares = {};
//     participants.forEach((p) => (newShares[p] = perHead));
//     setShares(newShares);

//     // settlement logic
//     const debts = {};
//     participants.forEach((name) => {
//       if (name === payer) {
//         debts[name] = totalAmount - perHead;
//       } else {
//         debts[name] = -perHead;
//       }
//     });

//     const settlementList = [];
//     Object.keys(debts).forEach((debtor) => {
//       if (debts[debtor] < -0.01) {
//         settlementList.push({
//           from: debtor,
//           to: payer,
//           amount: Math.abs(debts[debtor]),
//         });
//       }
//     });
//     setSettlements(settlementList);
//   }

//   if (!group) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         Loading group details...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-purple-50 to-green-50 min-h-screen">
//       {/* Header */}
//       <header className="header">
//         <div className="header-container flex justify-between items-center p-4 shadow bg-white">
//           <div
//             className="flex items-center cursor-pointer"
//             onClick={() => navigate("/home")}
//           >
//             <div className="logo mr-2">
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="12" y1="1" x2="12" y2="23"></line>
//                 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
//               </svg>
//             </div>
//             <h1 className="text-xl font-bold">SplitWise</h1>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/home")}
//               className="btn btn-outline btn-sm"
//             >
//               Groups
//             </button>
//             <button
//               onClick={() => navigate(`/group/${id}/add-expense`)}
//               className="btn btn-gradient btn-sm"
//             >
//               Add Expense
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Group Summary */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 m-3 flex justify-between">
//         <div className="flex gap-3">
//           <h2 className="text-2xl font-semibold text-gray-800">Group Name:</h2>
//           <h2 className="text-2xl font-semibold text-[#10b981]">
//             {group.name}
//           </h2>
//         </div>
//         <div className="flex gap-3">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Total Amount:
//           </h2>
//           <div className="text-2xl font-semibold text-[#10b981]">
//             Rs. {group.totalAmount}
//           </div>
//         </div>
//       </div>

//       {/* Split Results */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 m-3">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//           Split Results
//         </h2>

//         {!settlements.length && Object.keys(shares).length === 0 ? (
//           <div className="text-center text-gray-500 py-12">
//             <div className="text-6xl mb-4">🧾</div>
//             <p>Enter bill details and calculate to see results</p>
//           </div>
//         ) : (
//           <div>
//             {/* Split Summary */}
//             <div className="bg-gradient-to-r from-primary/10 to-green-100 rounded-lg p-4 mb-6">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-gray-800">
//                   Rs. {group.totalAmount}
//                 </div>
//                 <div className="text-gray-600">
//                   split among {group.participants.length} people
//                 </div>
//                 <div className="text-green-500 mt-1 font-bold">
//                   Paid by {group.payer}
//                 </div>
//               </div>
//             </div>

//             {/* Individual Shares */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                 Individual Shares
//               </h3>
//               <div className="space-y-2">
//                 {Object.keys(shares).map((name) => (
//                   <div
//                     key={name}
//                     className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
//                   >
//                     <span className="font-medium text-gray-800">{name}</span>
//                     <span className="text-lg font-semibold text-gray-900">
//                       Rs. {shares[name].toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Settlements */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                 Who Owes Whom
//               </h3>
//               <div className="space-y-2">
//                 {settlements.length === 0 ? (
//                   <p className="text-center text-gray-500 py-4">
//                     No settlements needed - everyone paid their share!
//                   </p>
//                 ) : (
//                   settlements.map((s, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
//                     >
//                       <span className="text-gray-800">
//                         {s.from} owes {s.to} → Rs. {s.amount.toFixed(2)}
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
