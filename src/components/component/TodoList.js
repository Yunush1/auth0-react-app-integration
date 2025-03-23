import React, { useState } from "react";
import usePermissions from "../../hooks/usePermission";

const ToDoList = () => {
    const { hasPermission } = usePermissions();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    //  Add a new task (only if user has "add" permission)
    const addTask = () => {
        if (!hasPermission("add")) {
            alert("❌ You do not have permission to add tasks.");
            return;
        }
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask("");
    };

    //  Update a task (only if user has "update" permission)
    const updateTask = (id, newText) => {
        if (!hasPermission("update")) {
            alert("❌ You do not have permission to update tasks.");
            return;
        }
        setTasks(tasks.map(task => (task.id === id ? { ...task, text: newText } : task)));
    };

    //  Delete a task (only if user has "write" permission)
    const deleteTask = (id) => {
        if (!hasPermission("write")) {
            alert("❌ You do not have permission to delete tasks.");
            return;
        }
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="todo-container">
            <h2>📝 To-Do List</h2>

            {/*  Add Task Section (Only if user has "add" permission) */}
            {hasPermission("add") && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button onClick={addTask}>➕ Add Task</button>
                </div>
            )}

            {/*  List Tasks (Only if user has "read" permission) */}
            {hasPermission("read:read_user") ? (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <span>{task.text}</span>
                            
                            {/*  Update Button (Only if user has "update" permission) */}
                            {hasPermission("update") && (
                                <button onClick={() => updateTask(task.id, prompt("Edit task:", task.text))}>
                                    ✏️ Edit
                                </button>
                            )}

                            {/*  Delete Button (Only if user has "write" permission) */}
                            {hasPermission("write") && (
                                <button onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>❌ You do not have permission to view tasks.</p>
            )}
        </div>
    );
};

export default ToDoList;
