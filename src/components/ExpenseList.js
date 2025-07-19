import React, { useState } from "react";

function ExpenseList({ expenses, onDeleteExpense, onUpdateExpense }) {
  const [editingId, setEditingId] = useState(null);
  const [editedExpense, setEditedExpense] = useState({});

  const startEditHandler = (expense) => {
    setEditingId(expense.id);
    setEditedExpense(expense);
  };

  const saveEditHandler = () => {
    onUpdateExpense(editedExpense);
    setEditingId(null);
    setEditedExpense({});
  };

  const cancelEditHandler = () => {
    setEditingId(null);
    setEditedExpense({});
  };

  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          {editingId === expense.id ? (
            <>
              <input
                type="text"
                value={editedExpense.title}
                onChange={(e) => setEditedExpense({ ...editedExpense, title: e.target.value })}
              />
              <input
                type="number"
                value={editedExpense.amount}
                onChange={(e) => setEditedExpense({ ...editedExpense, amount: +e.target.value })}
              />
              <input
                type="date"
                value={editedExpense.date.toISOString().substr(0, 10)}
                onChange={(e) =>
                  setEditedExpense({ ...editedExpense, date: new Date(e.target.value) })
                }
              />
              <button onClick={saveEditHandler}>Save</button>
              <button onClick={cancelEditHandler}>Cancel</button>
            </>
          ) : (
            <>
              <h4>{expense.title}</h4>
              <p>${expense.amount}</p>
              <p>{expense.date.toDateString()}</p>
              <button onClick={() => startEditHandler(expense)}>Edit</button>
              <button onClick={() => onDeleteExpense(expense.id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
