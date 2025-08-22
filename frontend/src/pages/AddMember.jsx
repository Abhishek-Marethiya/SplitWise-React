// import React, { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { GroupContext } from "../context/GroupContext";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import toast from "react-hot-toast";

// const AddMember = () => {
//   const { currentUser, allUsers, isLogin, logout, createUser } =
//     useContext(AuthContext);
//   const { addMemberToGroup } = useContext(GroupContext);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const groupId = searchParams.get("groupId");
//   console.log(groupId);
  
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   // Redirect if not logged in

//     if (!isLogin) navigate("/login");
 

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check duplicate email/name
//     const userExists = allUsers.some(
//       (u) => u.email.toLowerCase() === email.toLowerCase()
//     );
//     const userNameExists = allUsers.some(
//       (u) => u.name.toLowerCase() === name.toLowerCase()
//     );

//     if (userExists) {
//       toast.error("A user with this email already exists!");
//       return;
//     }
//     if (userNameExists) {
//       toast.error("A user with this name already exists!");
//       return;
//     }

//     try {
//       // Create new user with default password
//       const newUser = await createUser({
//         name,
//         email,
//         password: "Default@123",
//       });

//       if (groupId) {
//         await addMemberToGroup(groupId, newUser.name);
//         toast.success("Member added successfully!");
//         navigate(`/group/${groupId}`);
//       } else {
//         toast.success("Member added successfully!");
//         navigate("/create-group");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       {/* Form card */}
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-center text-black-600 tracking-[.1em]">
//           Add New Member
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name input */}
//           <div className="space-y-2">
//             <label htmlFor="name" className="block text-sm font-medium">
//               Name
//             </label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               placeholder="Enter full name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
//             />
//           </div>

//           {/* Email input */}
//           <div className="space-y-2">
//             <label htmlFor="email" className="block text-sm font-medium">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-3 py-2 border border-input bg-background rounded-md input-focus transition-smooth"
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full btn-primary text-white py-2 px-4 rounded-md font-medium transition-smooth"
//           >
//             Add Member
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMember;
