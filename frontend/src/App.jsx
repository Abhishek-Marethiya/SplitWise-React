import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import { AuthContext } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
// import Home from "./pages/Group";
// import AddMembers from "./pages/AddMembers"
import "./App.css";
import { useContext } from "react";
import Loader from "./components/Loader";
// import CreateGroup from "./pages/CreateGroup";
// import AddMember from "./pages/AddMember";
// import AddExpense from "./pages/AddExpense";
// import GroupDetails from "./pages/GroupDetails";
// import ExpenseDetails from "./pages/ExpenseDetails";

function App() {
  const { isLogin, loading ,currentUser,logout} = useContext(AuthContext);
console.log(isLogin);
  if (loading) {
     return (
      <Loader/>
     ) // or a spinner
  }
console.log(currentUser);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {isLogin && <Header username={currentUser} onLogout={logout} />} 
      <Routes>
        <Route path="/" element={<AuthPage/>}/>
        {/* <Route path="/" element={ isLogin ? <Home /> : <AuthPage />} />
        <Route path="/create-group" element={<CreateGroup/>}/>
        <Route path="/add-member" elemenent={<AddMember/>}/>
        <Route path="/add-expense" element={<AddExpense/>}/>
        <Route path="/group/:id" element={<GroupDetails />} />
        <Route path="/expense/:expenseId" element={<ExpenseDetails />} /> */}

      </Routes>
    </>
  );
}

export default App;
