import React, { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import "./App.css";

function App() {
  const [salary, setSalary] = useState(0); // Initialize salary to 0
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("salary"); // Track the current page

  // Load data from localStorage when app starts
  useEffect(() => {
    const storedSalary = localStorage.getItem("salary");
    const storedExpenses = localStorage.getItem("expenses");
    const storedPage = localStorage.getItem("currentPage");

    if (storedSalary) setSalary(parseFloat(storedSalary));
    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses).map((expense) => ({
        ...expense,
        date: new Date(expense.date), // Convert date string back to Date object
      }));
      setExpenses(parsedExpenses);
    }
    if (storedPage) setCurrentPage(storedPage);
  }, []);

  // Save salary to localStorage
  const handleSalarySubmit = (event) => {
    event.preventDefault();
    const inputSalary = parseFloat(event.target.salary.value);

    const updatedSalary = salary + inputSalary; // Add new salary to the existing one
    setSalary(updatedSalary); // Update the state
    localStorage.setItem("salary", updatedSalary); // Save to localStorage

    setCurrentPage("expenses"); // Navigate to the expense page
    localStorage.setItem("currentPage", "expenses"); // Persist the current page
  };

  // Save updated expenses to localStorage
  const saveExpensesToLocalStorage = (updatedExpenses) => {
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
  };

  // Add expense handler
  const addExpenseHandler = (expense) => {
    const updatedExpenses = [expense, ...expenses];
    saveExpensesToLocalStorage(updatedExpenses);
  };

  // Delete expense handler
  const deleteExpenseHandler = (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    saveExpensesToLocalStorage(updatedExpenses);
  };

  // Update expense handler
  const updateExpenseHandler = (updatedExpense) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    saveExpensesToLocalStorage(updatedExpenses);
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate remaining balance
  const balance = salary - totalExpenses;

  // Search expense handler
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Change page and persist it
  const navigateToPage = (page) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page);
  };

  // Filtered expenses based on search term
  const filteredExpenses = expenses.filter((expense) =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render salary input page
  const renderSalaryPage = () => (
    <form onSubmit={handleSalarySubmit}>
      <h3>Enter Your Salary</h3>
      <input
        type="number"
        name="salary"
        placeholder="Enter your salary"
        required
        className="salary-input"
      />
      <button type="submit">Add Salary</button>
    </form>
  );

  // Render expenses page
  const renderExpensesPage = () => (
    <>
      <h2>Total Salary: ${salary.toFixed(2)}</h2>
      <h2>Balance: ${balance.toFixed(2)}</h2>
      <ExpenseForm onAddExpense={addExpenseHandler} />
      <input
        type="text"
        placeholder="Search expenses by title..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <ExpenseList
        expenses={filteredExpenses}
        onDeleteExpense={deleteExpenseHandler}
        onUpdateExpense={updateExpenseHandler}
      />
      <button onClick={() => navigateToPage("salary")}>Update Salary</button>
    </>
  );

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      {currentPage === "salary" && renderSalaryPage()}
      {currentPage === "expenses" && renderExpensesPage()}
    </div>
  );
}

export default App;