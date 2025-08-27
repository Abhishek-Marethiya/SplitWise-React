import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { GroupProvider } from './context/GroupContext.jsx'
import { ExpenseProvider } from './context/ExpenseContext.jsx'


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ExpenseProvider>
    <GroupProvider>
      
  <BrowserRouter>
  <App />
  </BrowserRouter>
 
  </GroupProvider>
   </ExpenseProvider>
  </AuthProvider>
)


