import { createContext, useState } from "react";
import toast from "react-hot-toast";

export const ExpenseContext=createContext();

export const ExpenseProvider=({children})=>{

   const [expenses, setExpenses] = useState([]);
   const [loading, setLoading] = useState(false);

  const addExpense = async (expenseData) => {
    try {
      const res = await fetch(`http://localhost:8080/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(expenseData),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      const data = await res.json();
      
      // Update local expenses state
      setExpenses((prev) => [...prev, data]);
      
      // Refresh all expenses to ensure overall balance is updated
      await fetchAllExpenses();
      
      toast.success("Expense added!");
    } catch (err) {
      console.error("addExpense error:", err);
      toast.error("Could not add expense");
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) {
          // Expense not found, remove it from local state anyway
          setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
          toast.success("Expense deleted!");
          return true;
        }
        throw new Error("Failed to delete expense");
      }

      // Update local expenses state
      setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
      
      // Refresh all expenses to ensure overall balance is updated
      await fetchAllExpenses();
      
      toast.success("Expense deleted!");
      return true;
    } catch (err) {
      console.error("deleteExpense error:", err);
      toast.error("Could not delete expense");
      return false;
    }
  };

  const getExpensesByGroupId = async (groupId, abortSignal) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/expenses`, {
        credentials: "include",
        signal: abortSignal,
      });

      if (!res.ok) throw new Error("Failed to fetch group expenses");

      let data = await res.json();
      data = Array.isArray(data) ? data.filter((d) => d.groupId?._id === groupId || d.groupId === groupId) : [];
      setExpenses(data);
      return data;
    } catch (err) {
      if (err?.name === 'AbortError') {
        // request was aborted; ignore
        return [];
      }
      console.error("getExpensesByGroupId error:", err);
      toast.error("Could not fetch group expenses");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getExpenseById = async (expenseId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch expense");

      return await res.json();
    } catch (err) {
      console.error("getExpenseById error:", err);
      toast.error("Could not fetch expense");
      return null;
    }
  };

  const fetchAllExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/expenses`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch expenses");

      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchExpenses error:", err);
      toast.error("Could not fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const editExpense = async (expenseId, updatedData) => {
    try {
      const res = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update expense");

      const updatedExpense = await res.json();
      
      // Update local expenses state
      setExpenses((prev) => prev.map((e) => (e._id === expenseId ? updatedExpense : e)));
      
      // Refresh all expenses to ensure overall balance is updated
      await fetchAllExpenses();
      
      toast.success("Expense updated!");
      return updatedExpense;
    } catch (err) {
      console.error("editExpense error:", err);
      toast.error("Could not update expense");
      throw err;
    }
  };

  return (
    <ExpenseContext.Provider
      value={{expenses,loading,setExpenses,fetchAllExpenses,deleteExpense,addExpense,getExpenseById,editExpense,getExpensesByGroupId}}
    >
        {children}
    </ExpenseContext.Provider>
  )
}