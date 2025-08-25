
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup]=useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
   
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

  const getGroupById=async(groupId)=>{
        try {
      const res = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });      
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      console.log("data",data);
      
      setCurrentGroup(data);
      console.log("Group:",data);
      
    } catch (err) {
      console.error("fetchGroups error:", err);
      toast.error("Could not load groups");
    }
  }
  // Create new group
  const createGroup = async (name, members) => {
    try {
      const res = await fetch("http://localhost:8080/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, members }),
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

      setGroups((prev) => prev.filter((g) => g._id !== id));
      toast.success("Group deleted");
    } catch (err) {
      console.error("deleteGroup error:", err);
      toast.error("Could not delete group");
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
      console.error("addMemberToGroup error:", err);
      toast.error("Could not load group");
     }
  }
  // Fetch summary (owes/owedBy like in JS code)
  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users/me", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return;
      const user = await res.json();

      const netMap = {};
      user.owes?.forEach((o) => {
        netMap[o.to] = (netMap[o.to] || 0) - Number(o.amount);
      });
      user.owedBy?.forEach((o) => {
        netMap[o.from] = (netMap[o.from] || 0) + Number(o.amount);
      });

      setSummary(netMap);
    } catch (err) {
      console.error("fetchSummary error:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchSummary();
  }, []);

  return (
    <GroupContext.Provider
      value={{ groups, loading, fetchGroups, createGroup, deleteGroup, summary,addMemberToGroup ,getGroupById,currentGroup,setCurrentGroup}}
    >
      {children}
    </GroupContext.Provider>
  );
};

