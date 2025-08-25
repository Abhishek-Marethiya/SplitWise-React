import { useContext } from "react";
import { GroupContext } from "../context/GroupContext";
import { Link, useNavigate } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import { AuthContext } from "../context/AuthContext";
import GroupDetails from "./GroupDetails";
import AddExpense from "./AddExpense";

const Group = () => {

  const { groups, loading, deleteGroup, summary } = useContext(GroupContext);
  const {isLogin}=useContext(AuthContext);
  const navigate=useNavigate();
  
  
  if(!isLogin){
    navigate('/');
  }
  
  if (loading) {
    return <p className="text-center">Loading groups...</p>;
  }

  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[20px] font-bold text-gray-700 tracking-[.1em]">
          Your Groups
        </h2>
            <a
            href="/create-group"
            className="btn-primary text-white px-2 py-2 rounded-md flex items-center gap-2 transition-smooth"
            onClick={() => navigate(<CreateGroup/>)}
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
      <div id="groups-container">
        {groups.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            You haven&apos;t joined any groups yet.
          </p>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              onClick={()=>{navigate(`/groupdetails/${group._id}`)}}
              className="bg-white min-w-fit p-6 mb-4 shadow rounded cursor-pointer hover:bg-gray-50 flex justify-between items-center relative"
            >
              <div>
                <h3 className="text-lg font-semibold text-green-700">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Members: {group.participants?.length || 0}
                </p>
                <p className="text-[12px] text-gray-500 absolute bottom-0 right-6">
                  {group.createdAt
                    ? new Date(group.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
              <div>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroup(group._id);
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

      {/* Summary Section */}
      <hr className="mt-6" />
      <div id="showAllExpensesDetail" className="mt-6">
        <h3 className="text-lg font-bold text-gray-700 mb-2 tracking-[.1em]">
          Expenses Details
        </h3>

        {summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* You Owe */}
            <div className="bg-red-50 p-3 rounded shadow">
              <h4 className="font-semibold text-red-600 mb-2">You Owe</h4>
              <ul className="list-disc pl-5">
                {Object.entries(summary)
                  .filter(([_, amt]) => amt < 0)
                  .map(([name, amt]) => (
                    <li key={name}>
                      You owe <strong>{name}</strong> ₹{Math.abs(amt).toFixed(2)}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Owed to You */}
            <div className="bg-green-50 p-3 rounded shadow">
              <h4 className="font-semibold text-green-600 mb-2">Owed to You</h4>
              <ul className="list-disc pl-5">
                {Object.entries(summary)
                  .filter(([_, amt]) => amt > 0)
                  .map(([name, amt]) => (
                    <li key={name}>
                      <strong>{name}</strong> owes you ₹{amt.toFixed(2)}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No expense details available.</p>
        )}
      </div>
    </div>
  );
};

export default Group;
