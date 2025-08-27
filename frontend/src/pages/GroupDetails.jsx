import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";
import { AuthContext } from "../context/AuthContext";
import { GroupContext } from "../context/GroupContext";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const { getExpensesByGroupId,deleteExpense } = useContext(ExpenseContext);
  const { currentUser,isLogin } = useContext(AuthContext);
  const { getGroupById, removeMemberFromGroup, updateMemberName } = useContext(GroupContext);
  const [expenses, setExpenses] = useState([]); 
  const [settlements, setSettlements] = useState([]);
  const [group, setGroup] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editMemberName, setEditMemberName] = useState("");
  if (!isLogin) {
    navigate('/');
  }

  useEffect(() => {
    const aborter = new AbortController();
    const fetchData = async () => {  
      // Fetch group details
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
      
      // Fetch expenses
      const data = await getExpensesByGroupId(groupId, aborter.signal); 
      const safeExpenses = Array.isArray(data) ? data : [];
      setExpenses(safeExpenses);

      // Build aggregated owes within this group
      const pairToAmount = {};
      for (const exp of safeExpenses) {
        const payer = exp?.paidBy?.name || exp?.paidBy;
        const splits = Array.isArray(exp?.splitBetween) ? exp.splitBetween : [];
        for (const s of splits) {
          if (!payer || !s?.memberName) continue;
          if (s.memberName === payer) continue;
          const key = `${s.memberName}__TO__${payer}`;
          pairToAmount[key] = (pairToAmount[key] || 0) + Number(s.share || 0);
        }
      }
      const aggregated = Object.entries(pairToAmount).map(([key, amount]) => {
        const [from, to] = key.split("__TO__");
        return { from, to, amount };
      });
      setSettlements(aggregated);
    };
    fetchData();
    return () => aborter.abort();
  }, [groupId]);

  const handleRemoveMember = async (memberName) => {
    // Prevent removing the current user
    if (memberName === currentUser?.name) {
      toast.error("You cannot remove yourself from the group!");
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to remove "${memberName}" from the group?\n\nThis will:\n• Remove them from all future expenses\n• Delete all expenses where they were the payer\n• Recalculate all remaining settlements`
    );

    if (!confirmed) {
      return;
    }

    console.log(`Removing member: ${memberName} from group: ${groupId}`);
    
    const success = await removeMemberFromGroup(groupId, memberName);
    if (success) {
      console.log("Member removed successfully, refreshing data...");
      
      // Refresh group data
      const updatedGroup = await getGroupById(groupId);
      setGroup(updatedGroup);
      
      // Refresh expenses to recalculate settlements without the removed member
      const updatedExpenses = await getExpensesByGroupId(groupId);
      const safeExpenses = Array.isArray(updatedExpenses) ? updatedExpenses : [];
      setExpenses(safeExpenses);

      // Recalculate settlements without the removed member
      const pairToAmount = {};
      for (const exp of safeExpenses) {
        const payer = exp?.paidBy?.name || exp?.paidBy;
        const splits = Array.isArray(exp?.splitBetween) ? exp.splitBetween : [];
        for (const s of splits) {
          if (!payer || !s?.memberName) continue;
          if (s.memberName === payer) continue;
          if (s.memberName === memberName) continue; // Skip removed member
          if (payer === memberName) continue; // Skip if payer was removed
          const key = `${s.memberName}__TO__${payer}`;
          pairToAmount[key] = (pairToAmount[key] || 0) + Number(s.share || 0);
        }
      }
      const aggregated = Object.entries(pairToAmount).map(([key, amount]) => {
        const [from, to] = key.split("__TO__");
        return { from, to, amount };
      });
      setSettlements(aggregated);
      
      console.log("Data refreshed successfully after member removal");
      toast.success(`${memberName} removed from group successfully!`);
    } else {
      console.error("Failed to remove member");
      toast.error("Failed to remove member. Please try again.");
    }
  };

  const handleEditMember = (memberName) => {
    setEditingMember(memberName);
    setEditMemberName(memberName);
  };

  const handleUpdateMember = async () => {
    if (editMemberName.trim() === "") return;
    
    const success = await updateMemberName(groupId, editingMember, editMemberName.trim());
    if (success) {
      // Refresh group data
      const updatedGroup = await getGroupById(groupId);
      setGroup(updatedGroup);
      
      // Refresh expenses to update member names in expense data
      const updatedExpenses = await getExpensesByGroupId(groupId);
      const safeExpenses = Array.isArray(updatedExpenses) ? updatedExpenses : [];
      setExpenses(safeExpenses);

      // Recalculate settlements with updated member names
      const pairToAmount = {};
      for (const exp of safeExpenses) {
        const payer = exp?.paidBy?.name || exp?.paidBy;
        const splits = Array.isArray(exp?.splitBetween) ? exp.splitBetween : [];
        for (const s of splits) {
          if (!payer || !s?.memberName) continue;
          if (s.memberName === payer) continue;
          const key = `${s.memberName}__TO__${payer}`;
          pairToAmount[key] = (pairToAmount[key] || 0) + Number(s.share || 0);
        }
      }
      const aggregated = Object.entries(pairToAmount).map(([key, amount]) => {
        const [from, to] = key.split("__TO__");
        return { from, to, amount };
      });
      setSettlements(aggregated);
      
      setEditingMember(null);
      setEditMemberName("");
      toast.success(`Member name updated from "${editingMember}" to "${editMemberName.trim()}"`);
    } else {
      toast.error("Failed to update member name. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditMemberName("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6 ">{group?.name}</h1>

      {/* Expenses Table */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Expenses</h2>
                     <button
             onClick={() => navigate(`/add-member?groupId=${groupId}`)}
             className="text-blue-600 font-medium hover:underline flex items-center"
           >
             + Add Member
           </button>
        </div>

        <div className="border-t border-gray-200">
          <div className="grid grid-cols-4 font-semibold py-2 px-2 text-sm text-gray-700">
            <span>Description</span>
            <span className="text-right">Amount</span>
            <span className="text-center">Paid By</span>
            <span className="text-right">Actions</span>
          </div>

          {expenses.length > 0 ? (
            expenses.map((exp) => (
              <div
                key={exp._id}
                onClick={() => navigate(`/expense/${exp._id}`)}
                className="grid grid-cols-4 gap-3 items-center border rounded-lg p-3 my-2 hover:bg-gray-50 cursor-pointer"
              >
                <button
                 
                  className="text-left"
                  title={exp.description}
                >
                  {exp.description}
                </button>
                <span className="text-green-600 font-medium text-right">₹{exp.amount}</span>
                <span className="text-center">{exp.paidBy?.name || exp.paidBy}</span>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/edit-expense/${groupId}/${exp._id}`); }}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white text-sm"
                  >
                    Edit
                  </button>
                                     <button
                     onClick={async (e) => { 
                       e.stopPropagation(); 
                       const success = await deleteExpense(exp._id);
                       if (success) {
                         // Refresh expenses and recalculate settlements
                         const updatedExpenses = await getExpensesByGroupId(groupId);
                         const safeExpenses = Array.isArray(updatedExpenses) ? updatedExpenses : [];
                         setExpenses(safeExpenses);

                         // Recalculate settlements
                         const pairToAmount = {};
                         for (const expense of safeExpenses) {
                           const payer = expense?.paidBy?.name || expense?.paidBy;
                           const splits = Array.isArray(expense?.splitBetween) ? expense.splitBetween : [];
                           for (const s of splits) {
                             if (!payer || !s?.memberName) continue;
                             if (s.memberName === payer) continue;
                             const key = `${s.memberName}__TO__${payer}`;
                             pairToAmount[key] = (pairToAmount[key] || 0) + Number(s.share || 0);
                           }
                         }
                         const aggregated = Object.entries(pairToAmount).map(([key, amount]) => {
                           const [from, to] = key.split("__TO__");
                           return { from, to, amount };
                         });
                         setSettlements(aggregated);
                       }
                     }}
                     className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
                   >
                     Delete
                   </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-red-500 italic py-4 px-2">No expenses yet</p>
          )}
        </div>

        {/* Total */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Total Group Amount</h3>
                         <div className="flex gap-3">
               <button
                 onClick={() => setShowMembersModal(true)}
                 className="bg-yellow-500  text-white px-3 py-[6.3px] rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
               >
                 Show Members
               </button>
               <button
                 onClick={() => navigate(`/add-expense/${groupId}`)}
                 className="btn btn-gradient btn-sm tracking-widest"
               >
                 Add Expense
               </button>
             </div>
          </div>
          <p className="text-green-600 text-lg font-bold">
            ₹{expenses.reduce((acc, exp) => acc + Number(exp.amount || 0), 0)}
          </p>
        </div>
      </div>

             {/* Aggregated Settlement Summary for this group */}
       <div className="bg-white shadow-md rounded-2xl p-6">
         <h2 className="text-xl font-semibold mb-4">Group Settlement Summary</h2>
         {settlements.length === 0 ? (
           <p className="text-gray-500">No settlements to show.</p>
         ) : (
           <ul className="list-disc pl-6">
             {settlements.map((s, i) => {
               // Determine color based on who owes whom
               let amountClass = "";
               let fromClass = "";
               let toClass = "";
               
               if (s.from === currentUser?.name) {
                 // Current user owes someone (red for amount, red for "owes")
                 amountClass = "text-red-600 font-semibold";
                 fromClass = "text-red-600 font-semibold";
               } else if (s.to === currentUser?.name) {
                 // Someone owes current user (green for amount, green for "owes")
                 amountClass = "text-green-600 font-semibold";
                 toClass = "text-green-600 font-semibold";
               }
               
               return (
                 <li key={`${s.from}-${s.to}-${i}`}>
                   <span className={fromClass}>{s.from}</span> owes{" "}
                   <span className={toClass}>{s.to}</span>{" "}
                   <span className={amountClass}>₹{Number(s.amount).toFixed(2)}</span>
                 </li>
               );
             })}
           </ul>
         )}
       </div>

      {/* Members Modal */}
      <Modal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title="Group Members"
      >
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You cannot remove yourself from the group. When you delete other members, 
            all their expenses will be removed and settlements will be recalculated automatically.
          </p>
        </div>
        <div className="space-y-4">
          {group && group.participants && group.participants.length > 0 ? (
            group.participants.map((member, index) => {
              const isCurrentUser = member === currentUser?.name;
              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  isCurrentUser ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}>
                  {editingMember === member ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={editMemberName}
                        onChange={(e) => setEditMemberName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new name"
                      />
                      <button
                        onClick={handleUpdateMember}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${isCurrentUser ? 'text-green-600' : ''}`}>
                          {member} {isCurrentUser && "(You)"}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Group Creator
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        )}
                        {isCurrentUser && (
                          <button
                            disabled
                            className="bg-gray-300 text-gray-500 px-3 py-1 rounded text-sm cursor-not-allowed"
                            title="You cannot remove yourself from the group"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">No members in this group</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default GroupDetails;
