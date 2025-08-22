export default function ExpenseItem({ title, amount, paidBy }) {
  return (
    <div className="expense-item">
      <h3>{title}</h3>
      <p>₹{amount}</p>
      <small>Paid by {paidBy}</small>
    </div>
  );
}
