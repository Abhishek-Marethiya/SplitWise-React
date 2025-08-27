import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import { AuthContext } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Group";
import "./App.css";
import { useContext } from "react";
import Loader from "./components/Loader";
import CreateGroup from "./pages/CreateGroup";
import AddMember from "./pages/AddMember";
import AddExpense from "./pages/AddExpense";
import GroupDetails from "./pages/GroupDetails";
import ExpenseDetails from "./pages/ExpenseDetails";
import EditExpense from "./pages/EditExpense";

function App() {
  const { isLogin, loading ,currentUser,logout} = useContext(AuthContext);
  if (loading) {
     return (
      <Loader/>
     )
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {isLogin && currentUser && <Header username={currentUser} onLogout={logout} />}
      <Routes>
        <Route path="/" element={ isLogin ? <Home/> : <AuthPage/>}/>
        <Route path="/create-group" element={<CreateGroup/>}/>
        <Route path="/add-member" element={<AddMember/>}/>
        <Route path="/add-expense/:groupId" element={<AddExpense/>}/>
        <Route path="/edit-expense/:groupId/:expenseId" element={<EditExpense/>}/>
        <Route path="/group/:groupId" element={<GroupDetails/>}/>
        <Route path="/expense/:expenseId" element={<ExpenseDetails/>}/>
      </Routes>
    </>
  );
}

export default App;
