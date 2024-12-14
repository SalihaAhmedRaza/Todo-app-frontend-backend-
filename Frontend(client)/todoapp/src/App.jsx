import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [input, setInput] = useState('');
  const [todo, setTodod] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [todoToDelete, setTodoToDelete] = useState(null);

  // Fetch todos from the backend 
  useEffect(() => {
    async function getData() {
      const response = await axios('http://localhost:3000/todo');
      setTodod(response.data.todos);
    }

    getData();
  }, []);

  // Add a new todo
  const addTodo = async (event) => {
    event.preventDefault();
    if (!input) return;

    const response = await axios.post('http://localhost:3000/todo', {
      title: input,
    });

    setTodod([...todo, response.data.todo]);
    setInput('');
  };

  // Delete a todo
  const deleteTodo = async () => {
    try {
      await axios.delete(`http://localhost:3000/todo/${Number(todoToDelete.id)}`);
      setTodod(todo.filter((item) => item.id !== todoToDelete.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting todo:', error.response ? error.response.data : error);
    }
  };

  // Edit a todo
  const editTodo = async () => {
    if (!todoToEdit.title) return;
    try {
      const response = await axios.put(
        `http://localhost:3000/todo/${Number(todoToEdit.id)}`,
        {
          title: todoToEdit.title,
        }
      );

      setTodod(
        todo.map((item) =>
          item.id === todoToEdit.id ? { ...item, title: todoToEdit.title } : item
        )
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating todo:', error.response ? error.response.data : error);
    }
  };

  return (
    <div className="container ml-[500px]">
      <h1 className="text-3xl font-bold  ml-20 mt-5 text-blue-500  mb-4">Todo App</h1>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mt-20 flex mb-4 space-x-2">
        <input
          type="text"
          className="items-center  p-2 border border-gray-300 rounded w-72"
          placeholder="Enter your todo" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Add Todo
        </button>
      </form>

      {/* Todo List */}
      <ul className="space-y-2">
        {todo.length === 0 ? (
          <li className="text-center text-gray-500">No todos yet!</li>
        ) : (
          todo.map((item) => (
            <li key={item.id} className="w-72  text-center flex justify-between items-center p-2 border border-gray-300 rounded">
              <span>{item.title}</span>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setTodoToEdit(item);
                    setEditDialogOpen(true);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setTodoToDelete(item);
                    setDeleteDialogOpen(true);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              
            </li>
          ))
        )}
      </ul>

      {/* Edit Todo Modal */}
      {editDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-2xl mb-4">Edit Todo</h2>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded w-full mb-4"
              value={todoToEdit?.title}
              onChange={(e) =>
                setTodoToEdit({ ...todoToEdit, title: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditDialogOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={editTodo}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Todo Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Are you sure you want to delete this todo?</h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteTodo}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
