
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup]=useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
   
  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/groups", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });      
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      console.log(data);
      
      setGroups(data);
      console.log("Groups:",groups);
      
    } catch (err) {
      console.error("fetchGroups error:", err);
      toast.error("Could not load groups");
    } finally {
      setLoading(false);
    }
  };

// in GroupContext
const getGroupById = async (groupId) => {
  try {
    const res = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch groups");
    const data = await res.json();
    setCurrentGroup(data);
    return data;   
  } catch (err) {
    console.error("fetchGroups error:", err);
    toast.error("Could not load groups");
  }
};

  // Create new group
  const createGroup = async (name, participants) => {
    try {
      const res = await fetch("http://localhost:8080/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, participants }),
      });
      if (!res.ok) throw new Error("Failed to create group");

      const newGroup = await res.json();
      setGroups((prev) => [...prev, newGroup]);
      toast.success("Group created successfully!");
    } catch (err) {
      console.error("createGroup error:", err);
      toast.error("Could not create group");
    }
  };

  // Delete group
  const deleteGroup = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete group");

      const result = await res.json();
      console.log("Group deletion result:", result);

      setGroups((prev) => prev.filter((g) => g._id !== id));
      toast.success(`Group deleted successfully! (${result.deletedExpensesCount || 0} expenses also removed)`);
      
      // Trigger a refresh of expenses to recalculate overall balance
      // This will be handled by the ExpenseContext if it's listening
      return true;
    } catch (err) {
      console.error("deleteGroup error:", err);
      toast.error("Could not delete group");
      return false;
    }
  };
  
  const addMemberToGroup=async(id,name)=>{
     try {

        const ress = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name })
      });

       if (ress.ok) {
        toast.success("Member added successfully!");
      }

     } catch (error) {
      console.error("addMemberToGroup error:", error);
      toast.error("Could not load group");
     }
  }

  const removeMemberFromGroup = async (groupId, memberName) => {
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${groupId}/member`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ memberName }),
      });
      
      if (!res.ok) throw new Error("Failed to remove member");
      
      toast.success("Member removed successfully!");
      return true;
    } catch (error) {
      console.error("removeMemberFromGroup error:", error);
      toast.error("Could not remove member");
      return false;
    }
  };

  const updateMemberName = async (groupId, oldName, newName) => {
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${groupId}/member`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ oldName, newName }),
      });
      
      if (!res.ok) throw new Error("Failed to update member name");
      
      toast.success("Member name updated successfully!");
      return true;
    } catch (error) {
      console.error("updateMemberName error:", error);
      toast.error("Could not update member name");
      return false;
    }
  };
  // Fetch summary (owes/owedBy like in JS code)
  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        setSummary({});
        return;
      }
      const user = await res.json();

      const netMap = {};
      (user.owes || []).forEach((o) => {
        netMap[o.to] = (netMap[o.to] || 0) - Number(o.amount);
      });
      (user.owedBy || []).forEach((o) => {
        netMap[o.from] = (netMap[o.from] || 0) + Number(o.amount);
      });

      setSummary(netMap);
    } catch (err) {
      console.error("fetchSummary error:", err);
      setSummary({});
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchSummary();
  }, []);

  return (
    <GroupContext.Provider
      value={{ groups, loading, fetchGroups, createGroup, deleteGroup, summary,addMemberToGroup ,getGroupById,currentGroup,setCurrentGroup,removeMemberFromGroup,updateMemberName}}
    >
      {children}
    </GroupContext.Provider>
  );
};

