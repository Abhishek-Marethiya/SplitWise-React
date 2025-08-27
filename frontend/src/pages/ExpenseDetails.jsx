// src/pages/ExpenseDetails.jsx
import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ExpenseContext } from "../context/ExpenseContext";
import { useContext } from "react";

export default function ExpenseDetails() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const {currentUser,logout,isLogin}=useContext(AuthContext);
  const { getExpenseById } = useContext(ExpenseContext);

  const [expense, setExpense] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!isLogin) {
      navigate('/');
      return;
    }
    async function fetchExpense() {
      const res = await getExpenseById(expenseId);
      if (!res) {
        showToast("Expense not found", "error");
        return;
      }
      setExpense(res);
    }
    if (expenseId) {
      fetchExpense();
    }
  }, [expenseId, getExpenseById, isLogin, navigate]);

  function showToast(message, type = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  if (!currentUser) {
    navigate("/");
    return null;
  }


  return (
    <div className="bg-gradient-to-br from-purple-50 to-green-50 min-h-screen">
      

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-black-600 mb-4 text-center mt-10 tracking-[.1em]">
        Expense Details
      </h1>

      {/* Expense Card */}
      <div className="max-w-xl mx-auto py-10 px-6 bg-white shadow rounded-lg my-4">
        <div className="text-gray-600">
          Date: {expense?.date ? new Date(expense.date).toLocaleDateString() : "-"}
        </div>
        <div className="text-lg text-green-600 font-semibold">
          ₹{Number(expense?.amount ?? 0)}
        </div>
        <div className="text-sm text-gray-600">
          Paid by: {" "}
          <span className="text-blue-800 font-bold">{expense?.paidBy?.name || expense?.paidBy || "-"}</span>
        </div>
        <div className="text-sm text-gray-600">
          Split between: {" "}
          <span className="font-medium text-gray-800">
            {(expense?.splitBetween || [])
              .map((e) => `${e.memberName} (₹${e.share})`)
              .join(", ")}
          </span>
        </div>

        <hr className="my-4" />

        {/* Individual Shares */}
        <h3 className="text-lg font-semibold text-gray-800">
          Individual Shares
        </h3>
        <div className="space-y-2">
          {(expense?.splitBetween || []).map((e, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-800">{e.memberName}</span>
              <span className="text-lg font-semibold text-gray-900">
                ₹{Number(e.share).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        {/* Settlements */}
        <h3 className="text-lg font-semibold text-gray-800">Settlement</h3>
        <div className="space-y-2">
          {(expense?.splitBetween || [])
            .filter((e) => (expense?.paidBy?.name || expense?.paidBy) && e.memberName !== (expense?.paidBy?.name || expense?.paidBy))
            .map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center p-3 mb-1 border border-red-200 rounded-lg"
              >
                <span className="text-red-600">
                  {entry.memberName} owes {expense?.paidBy?.name || expense?.paidBy} ₹
                  {Number(entry.share).toFixed(2)}
                </span>
              </div>
            ))}
        </div>

        <hr className="my-4" />

        {/* Split Summary */}
        <div className="text-center text-gray-700">
          <div className="text-2xl font-bold text-gray-800">
            ₹{Number(expense?.amount ?? 0).toFixed(2)}
          </div>
          <div className="text-gray-600">
            split among {(expense?.splitBetween || []).length} people
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Paid by {expense?.paidBy?.name || expense?.paidBy}
          </div>
        </div>
      </div>
    </div>
  );
}
