
const Group =require('../models/Group')

 exports.createGroup = async (req, res) => {
  try {
    const { name, participants } = req.body;
    console.log(participants);
        const group = new Group({
          name,
          participants,
        });
        
        console.log(group);
        
        await group.save();

    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addMemberToGroup=async (req,res)=>{
   try {
    const { name } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.participants.includes(name)) {
      return res.status(400).json({ error: "User already in group" });
    }

    group.participants.push(name);
    await group.save();

    res.json({ message: "Member added successfully", group });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
 exports.getGroups = async (req, res) => {
  const groups = await Group.find().populate("participants", "name email");
  res.json(groups);
};
exports.getGroupById=async(req,res)=>{
  try {
       const {id}=req.params;
       const group=await Group.findById(id);

       if(!group) {
             return res.status(404).json({ message: "Group not found" });
       }

       res.json(group);
  } catch (error) {
    
  }
}
exports.deleteGroup= async(req,res)=>{
  try {
    const {id}=req.params;
    console.log(id);
    
    const deletedGroup = await Group.findByIdAndDelete(id);
  console.log(deletedGroup);
  
    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ message: "Group deleted successfully", deletedGroup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }

}
