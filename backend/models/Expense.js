const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref:"Group" }, 
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true },  
  splitType: { type: String, enum: ["equal", "exact", "percentage"], default: "equal" },
  date: { type: Date, default: Date.now },
  splitBetween: [
    {
      memberName: { type: String, required: true },
      share: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
