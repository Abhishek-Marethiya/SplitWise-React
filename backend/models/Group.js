const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    participants: [{ type: String, required: true }], // store participant names
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
