const Expense=require('../models/Expense');

exports.addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, groupId, splitBetween } = req.body;
    console.log(groupId);
    
    const expense = await Expense.create({groupId, description, amount, paidBy, splitBetween });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find()
    .populate("groupId", "name");
  res.json(expenses);
};

exports.getExpenseById=async(req,res)=>{
  try {
        const {id}=req.params;
        const expense=await Expense.findById(id)
            .populate("groupId", "name")

        if(!expense) return res.status(404).json({message:"Expense not found"});
        
        res.json(expense);

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

exports.deleteExpense=async(req,res)=>{
  try {
    const {id}=req.params;
    console.log("Attempting to delete expense with ID:", id);
    
    const deletedExpense=await Expense.findByIdAndDelete(id);
    console.log("Delete result:", deletedExpense);

    if (!deletedExpense) {
      console.log("Expense not found with ID:", id);
      return res.status(404).json({ message: "Expense not found" });
    }
    
    console.log("Expense deleted successfully:", deletedExpense._id);
    res.json({ message: "Expense deleted successfully", deletedExpense });

  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

exports.editExpense=async(req,res)=>{
  try {
    console.log("ok");
    
       const { id } = req.params; // get expense id from URL
       console.log(id);
       const updatedData=req.body
       console.log(updatedData);
       
       const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      updatedData
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
