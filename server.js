require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies

// In-memory data
let todos = [
    { id: 1, task: 'Learn Node.js', completed: false },
    { id: 2, task: 'Build CRUD API', completed: false }
];

// GET All - Read
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

// GET Active Todos
app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(t => !t.completed);
    res.json(activeTodos);
});

// GET Single Todo
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({
            message: 'Request not found'
        });
    }

    res.json(todo);
});

// POST New - Create
app.post('/todos', (req, res) => {
    // Validate the task
    if (!req.body.task || !req.body.task.trim()) {
        return res.status(400).json({
            message: 'Field required'
        });
    }

    // Create a new todo
    const newTodo = {
        id: todos.length
            ? Math.max(...todos.map(t => t.id)) + 1
            : 1,
        ...req.body
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);
});

// PATCH Update - Partial
app.patch('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    Object.assign(todo, req.body);

    res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;

    todos = todos.filter(t => t.id !== id);

    if (todos.length === initialLength) {
        return res.status(404).json({
            error: 'Not found'
        });
    }

    res.status(204).send();
});

// GET Completed Todos
app.get('/todos/completed', (req, res) => {
    const completed = todos.filter(t => t.completed);
    res.json(completed);
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: 'Internal server error'
    });
});

// Start the server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});