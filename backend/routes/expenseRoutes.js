const express = require("express");
const { addExpense, getExpenses ,deleteExpense,editExpense,getExpenseById} =require("../controllers/expenseControllers");

const router = express.Router();

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/:id",getExpenseById);
router.delete("/:id",deleteExpense);
router.put('/:id',editExpense);

module.exports = router;




