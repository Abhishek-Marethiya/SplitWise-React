
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
      console.log(group);
      
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
    console.log("Deleting group with ID:", id);
    
    const deletedGroup = await Group.findByIdAndDelete(id);
    console.log("Deleted group:", deletedGroup);
  
    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Delete all expenses associated with this group
    const deletedExpenses = await Expense.deleteMany({ groupId: id });
    console.log(`Deleted ${deletedExpenses.deletedCount} expenses for group ${id}`);

    res.json({ 
      message: "Group deleted successfully", 
      deletedGroup,
      deletedExpensesCount: deletedExpenses.deletedCount 
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

exports.removeMemberFromGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberName } = req.body;
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const memberIndex = group.participants.indexOf(memberName);
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in group" });
    }

    group.participants.splice(memberIndex, 1);
    await group.save();

    // Update expenses to remove the member from splitBetween arrays
    await Expense.updateMany(
      { groupId: id },
      [
        {
          $set: {
            splitBetween: {
              $filter: {
                input: "$splitBetween",
                as: "split",
                cond: { $ne: ["$$split.memberName", memberName] }
              }
            }
          }
        }
      ]
    );

    // Remove expenses where the removed member was the payer
    await Expense.deleteMany({
      groupId: id,
      paidBy: memberName
    });

    res.json({ message: "Member removed successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const Expense = require('../models/Expense');

exports.updateMemberName = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldName, newName } = req.body;
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const memberIndex = group.participants.indexOf(oldName);
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in group" });
    }

    group.participants[memberIndex] = newName;
    await group.save();

    // Update all expenses in this group to reflect the member name change
    await Expense.updateMany(
      { groupId: id },
      [
        {
          $set: {
            paidBy: {
              $cond: {
                if: { $eq: ["$paidBy", oldName] },
                then: newName,
                else: "$paidBy"
              }
            },
            splitBetween: {
              $map: {
                input: "$splitBetween",
                as: "split",
                in: {
                  $cond: {
                    if: { $eq: ["$$split.memberName", oldName] },
                    then: {
                      memberName: newName,
                      share: "$$split.share"
                    },
                    else: "$$split"
                  }
                }
              }
            }
          }
        }
      ]
    );

    res.json({ message: "Member name updated successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
