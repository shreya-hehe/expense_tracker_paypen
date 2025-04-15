import { useState } from "react";
import { signOut } from "firebase/auth";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import "./styles.css";

export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals } = useGetTransactions();
  const { name } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");

  const { balance, income, expenses } = transactionTotals;

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      description,
      transactionAmount: parseFloat(transactionAmount),
      transactionType,
    });
    setDescription("");
    setTransactionAmount("");
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="expense-tracker">
      {/* Header with sign out and title */}
      <div className="header">
        <button className="sign-out-button" onClick={signUserOut}>
          Sign Out
        </button>
        <h1>{name}'s Expense Tracker</h1>
      </div>

      {/* Summary: Balance, Income, Expenses */}
      <div className="summary">
        <div className="balance">
          <h3>Your Balance</h3>
          {balance >= 0 ? (
            <h2>₹{balance}</h2>
          ) : (
            <h2>-₹{balance * -1}</h2>
          )}
        </div>
        <div className="income">
          <h3>Income</h3>
          <p>₹{income}</p>
        </div>
        <div className="expenses">
          <h3>Expenses</h3>
          <p>₹{expenses}</p>
        </div>
      </div>

      {/* Form to add transaction */}
      <form className="add-transaction" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={transactionAmount}
          required
          onChange={(e) => setTransactionAmount(e.target.value)}
        />
        <input
          type="radio"
          id="expense"
          value="expense"
          checked={transactionType === "expense"}
          onChange={(e) => setTransactionType(e.target.value)}
        />
        <label htmlFor="expense">Expense</label>
        <input
          type="radio"
          id="income"
          value="income"
          checked={transactionType === "income"}
          onChange={(e) => setTransactionType(e.target.value)}
        />
        <label htmlFor="income">Income</label>

        <button type="submit">Add Transaction</button>
      </form>

      {/* List of transactions */}
      <div className="transactions">
        <h3>Transactions</h3>
        <ul>
          {transactions.map((transaction, index) => {
            const { description, transactionAmount, transactionType } = transaction;
            return (
              <li key={index}>
                <h4>{description}</h4>
                <p>
                  ₹{transactionAmount} •{" "}
                  <span
                    style={{
                      color: transactionType === "expense" ? "red" : "lightgreen",
                    }}
                  >
                    {transactionType}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
