const mongoose = require("mongoose");

const owesSchema = new mongoose.Schema({
  to: { type: String, required: true }, // name of user owed to
  amount: { type: Number, required: true },
  expenseId: { type: mongoose.Schema.Types.ObjectId, ref: "Expense" },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
});

const owedBySchema = new mongoose.Schema({
  from: { type: String, required: true }, // name of user who owes
  amount: { type: Number, required: true },
  expenseId: { type: mongoose.Schema.Types.ObjectId, ref: "Expense" },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
     owes: [
    { to: String, amount: Number }
  ],
  owedBy: [
    { from: String, amount: Number }
  ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
