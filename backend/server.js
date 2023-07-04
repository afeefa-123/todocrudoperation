const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors=require('cors')

const app = express();

// Parse JSON bodies
app.use(bodyParser.json());

app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/todo_app",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("mongodb connected");

}).catch((e)=>{
    console.log(e);
})

// Create a todo schema and model
const todoSchema = new mongoose.Schema({
  title: String,
  description:String
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { title,description  } = req.body;
    const todo = new Todo({ title, description });
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description} = req.body;
    const todo = await Todo.findByIdAndUpdate(id, { title,description }, { new: true });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndRemove(id);
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
