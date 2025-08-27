import { useContext, useEffect, useMemo, useState } from "react";
import { GroupContext } from "../context/GroupContext";
import { Link, useNavigate } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import { AuthContext } from "../context/AuthContext";
import GroupDetails from "./GroupDetails";
import AddExpense from "./AddExpense";
import { ExpenseContext } from "../context/ExpenseContext";

const Group = () => {

  const { groups, loading, deleteGroup } = useContext(GroupContext);
  const { isLogin, currentUser } = useContext(AuthContext);
  const { expenses, fetchAllExpenses } = useContext(ExpenseContext);
  const navigate=useNavigate();
  const [overallMap, setOverallMap] = useState({});
  
  useEffect(() => {
    if (!isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    console.log("Fetching all expenses...");
    fetchAllExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    console.log("Calculating overall balance for user:", currentUser.name);
    console.log("Current user:", currentUser);
    console.log("Expenses data:", expenses);
    
    const netMap = {};
    
    // Process each expense
    for (const exp of expenses || []) {
      console.log("Processing expense:", exp);
      
      const payer = exp?.paidBy;
      const splits = Array.isArray(exp?.splitBetween) ? exp.splitBetween : [];
      
      console.log(`Expense: ${exp.description}, Amount: ₹${exp.amount}, Paid by: ${payer}`);
      console.log("Splits:", splits);
      
      // Skip if no valid payer or splits
      if (!payer || splits.length === 0) {
        console.log("Skipping expense - no valid payer or splits");
        continue;
      }
      
      // Process each split
      for (const split of splits) {
        const member = split?.memberName;
        const share = Number(split?.share || 0);
        
        console.log(`Split: ${member} owes ${payer} ₹${share}`);
        
        // Skip if no valid member or share
        if (!member || share <= 0) {
          console.log("Skipping split - no valid member or share");
          continue;
        }
        
        // Skip if member is the same as payer (they don't owe themselves)
        if (member === payer) {
          console.log("Skipping - member is the same as payer");
          continue;
        }
        
        // Case 1: Current user owes someone else
        if (member === currentUser.name) {
          netMap[payer] = (netMap[payer] || 0) - share;
          console.log(`${currentUser.name} owes ${payer} ₹${share}, netMap[${payer}] = ${netMap[payer]}`);
        }
        
        // Case 2: Someone else owes current user
        if (payer === currentUser.name) {
          netMap[member] = (netMap[member] || 0) + share;
          console.log(`${member} owes ${currentUser.name} ₹${share}, netMap[${member}] = ${netMap[member]}`);
        }
        
        // Debug: Check if current user is involved in this split
        if (member === currentUser.name || payer === currentUser.name) {
          console.log(`Current user involved: member="${member}", payer="${payer}", currentUser="${currentUser.name}"`);
        }
      }
    }
    
    console.log("Final netMap:", netMap);
    setOverallMap(netMap);
  }, [expenses, currentUser]);
  
  if (loading) {
    return <p className="text-center">Loading groups...</p>;
  }

  const { owesEntries, owedByEntries, owesTotal, owedByTotal } = useMemo(() => {
    console.log("Calculating summary from overallMap:", overallMap);
    const entries = Object.entries(overallMap || {});
    console.log("Entries:", entries);
    
    const owes = entries.filter(([_, amt]) => amt < 0).map(([name, amt]) => [name, Math.abs(amt)]);
    const owedBy = entries.filter(([_, amt]) => amt > 0).map(([name, amt]) => [name, amt]);
    
    console.log("Owes entries:", owes);
    console.log("Owed by entries:", owedBy);
    
    const owesSum = owes.reduce((acc, [, v]) => acc + Number(v), 0);
    const owedBySum = owedBy.reduce((acc, [, v]) => acc + Number(v), 0);
    
    console.log("Owes total:", owesSum, "Owed by total:", owedBySum);
    
    return {
      owesEntries: owes,
      owedByEntries: owedBy,
      owesTotal: owesSum,
      owedByTotal: owedBySum,
    };
  }, [overallMap]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[20px] font-bold text-gray-700 tracking-[.1em]">
          Your Groups
        </h2>
        <a
          href="/create-group"
          className="btn-primary text-white px-2 py-2 rounded-md flex items-center gap-2 transition-smooth"
          onClick={() => navigate('/create-group')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          Create Group
        </a>
      </div>

      {/* Groups list */}
      <div className="space-y-4" id="groups-container">
        {groups.length === 0 ? (
          <p className="text-gray-500">You haven\'t joined any groups yet.</p>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              onClick={()=>{navigate(`/group/${group._id}`)}}
              className="bg-white p-5 shadow rounded cursor-pointer hover:bg-gray-50 flex justify-between items-start relative"
            >
              <div>
                <h3 className="text-lg font-semibold text-green-700">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Members: {group.participants?.length || 0}
                </p>
                <p className="text-[12px] text-gray-500 mt-2">
                  {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={(e)=>{
                    e.stopPropagation();
                    navigate(`/add-expense/${group._id}`)
                  }}
                  className="btn btn-gradient btn-sm tracking-widest"
                >
                  Add Expense
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    
                    // Show confirmation dialog
                    const confirmed = window.confirm(
                      `Are you sure you want to delete "${group.name}"?\n\nThis will:\n• Delete the group permanently\n• Remove all expenses in this group\n• Recalculate your overall balance`
                    );
                    
                    if (!confirmed) {
                      return;
                    }
                    
                    const success = await deleteGroup(group._id);
                    if (success) {
                      // Refresh expenses to recalculate overall balance
                      await fetchAllExpenses();
                    }
                  }}
                  className="btn btn-sm btn-gradient btn-delete tracking-widest ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Section below groups */}
      <div className="bg-white p-5 rounded shadow-md mt-6">
        <h3 className="text-lg font-bold text-gray-700 mb-2 tracking-[.1em]">
          Overall Balance
        </h3>

   
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* You Owe */}
            <div className="bg-red-50 p-3 rounded shadow">
              <h4 className="font-semibold text-red-600 mb-2">You Owe</h4>
              <ul className="list-disc pl-5">
                {owesEntries.map(([name, amt]) => (
                  <li key={`owe-${name}`}>You owe <strong>{name}</strong> ₹{Number(amt).toFixed(2)}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-red-900 font-bold">Total: ₹{owesTotal.toFixed(2)}</p>
            </div>

            {/* Owed to You */}
            <div className="bg-green-50 p-3 rounded shadow">
              <h4 className="font-semibold text-green-600 mb-2">Owed to You</h4>
              <ul className="list-disc pl-5">
                {owedByEntries.map(([name, amt]) => (
                  <li key={`owed-${name}`}><strong>{name}</strong> owes you ₹{Number(amt).toFixed(2)}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-bold text-green-900">Total: ₹{owedByTotal.toFixed(2)}</p>
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default Group;
