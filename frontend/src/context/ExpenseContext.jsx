// import { createContext, useState } from "react";



// export const ExpenseContext=createContext();



// export const ExpenseProvider=({children})=>{

//     const [expenses,setExpenses]=useState();
//     const [loading, setLoading] = useState(true);

// const addExpense = async (groupId, expenseData) => {
//     try {
//       const res = await fetch(`http://localhost:8080/api/expenses`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ groupId, ...expenseData }),
//       });

//       if (!res.ok) throw new Error("Failed to add expense");

//       const data = await res.json();
//       setExpenses((prev) => [...prev, data]);
//       toast.success("Expense added!");
//     } catch (err) {
//       console.error("addExpense error:", err);
//       toast.error("Could not add expense");
//     }
//   };

//     const deleteExpense = async (expenseId) => {
//     try {
//       const res = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (!res.ok) throw new Error("Failed to delete expense");

//       setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
//       toast.success("Expense deleted!");
//     } catch (err) {
//       console.error("deleteExpense error:", err);
//       toast.error("Could not delete expense");
//     }
//   };

//   const getExpenseById = async (expenseId) => {
//     try {
//       const res = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to fetch expense");

//       return await res.json();
//     } catch (err) {
//       console.error("getExpenseById error:", err);
//       toast.error("Could not fetch expense");
//       return null;
//     }
//   };

//     const fetchAllExpenses = async () => {
//     try {
//         setExpenses(true);
//       const res = await fetch(`http://localhost:8080/api/expenses`, {
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to fetch expenses");

//       const data = await res.json();
//       setExpenses(data);
//       setLoading(false);
//     } catch (err) {
//       console.error("fetchExpenses error:", err);
//       toast.error("Could not fetch expenses");
//     }
//      finally {
//       setLoading(false);
//     }
//   };
//    const editExpense = async (expenseId, updatedData) => {
//     try {
//       const res = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(updatedData),
//       });

//       if (!res.ok) throw new Error("Failed to update expense");

//       const updatedExpense = await res.json();
//       setExpenses((prev) =>
//         prev.map((e) => (e._id === expenseId ? updatedExpense : e))
//       );
//       toast.success("Expense updated!");
//     } catch (err) {
//       console.error("editExpense error:", err);
//       toast.error("Could not update expense");
//     }
//   };

//   return (
//     <ExpenseContext.Provider
//     value={{expenses,setExpenses,fetchAllExpenses,deleteExpense,addExpense,getExpenseById,editExpense}}
//     >
//         {children}
//     </ExpenseContext.Provider>
//   )
// }