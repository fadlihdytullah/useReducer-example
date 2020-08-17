import React from "react";
import "./styles.css";

const initialExpenseTracker = [
  {
    id: 1,
    title: "Breakfast"
  },
  {
    id: 2,
    title: "Lunch"
  }
];

function getAsyncExpenses() {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ data: { expenses: initialExpenseTracker } });
    }, 2000)
  );
}

const expenseTrackerReducer = (state, action) => {
  if (action.type === "SET_EXPENSES") {
    return action.payload;
  } else if (action.type === "ADD_EXPENSE") {
    return [...state, { id: new Date().toTimeString(), title: action.payload }];
  } else if (action.type === "REMOVE_EXPENSE") {
    return state.filter((expense) => action.payload.id !== expense.id);
  } else {
    throw new Error();
  }
};

export default function App() {
  const [expenses, dispatchExpenses] = React.useReducer(
    expenseTrackerReducer,
    []
  );

  React.useEffect(() => {
    getAsyncExpenses().then((result) => {
      dispatchExpenses({ type: "SET_EXPENSES", payload: result.data.expenses });
    });
  }, []);

  const handleSubmit = (title) => {
    dispatchExpenses({ type: "ADD_EXPENSE", payload: title });
  };

  const handleRemove = (item) => {
    dispatchExpenses({ type: "REMOVE_EXPENSE", payload: item });
  };

  return (
    <div className="App">
      <h1>Learn How to useReducer</h1>
      <p>Yet another Advance State Management in React</p>
      <br />

      <AddForm onSubmit={handleSubmit} />
      <ExpenseList expenses={expenses} onRemoveItem={handleRemove} />
    </div>
  );
}

function AddForm({ onSubmit }) {
  const [title, setTitle] = React.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(title);
    setTitle("");
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="expense">Expense Description:</label>
      <input id="expense" type="text" value={title} onChange={handleChange} />
    </form>
  );
}

function ExpenseList({ expenses, onRemoveItem }) {
  return (
    <>
      {expenses.map((item) => (
        <ExpenseItem key={item.id} item={item} onRemove={onRemoveItem} />
      ))}
    </>
  );
}

function ExpenseItem({ item, onRemove }) {
  return (
    <li>
      {item.title} <button onClick={onRemove.bind(null, item)}>x</button>
    </li>
  );
}
