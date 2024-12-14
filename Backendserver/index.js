// // const express = require('express')
// import express from 'express'
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

import express from "express"
import cors from "cors"

const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

// middleware
// function hello(req, res, next) {
//     // user logged ? data dena : mana krdena
//     console.log("middleware called")
//     next()
// }

// app.get("/", hello, (req, res) => {
//     res.send("<h1>hello world</h1>")
// })


const arr = [];

app.get("/", (req, res) => {
    res.send("<h1>hello world</h1>")
})

// add todo
app.post("/todo", (req, res) => {
    const { title } = req.body

    console.log('request executed')

    if (!title) return res.status(404).json({
        message: "title is required"
    })

    const obj = {
        title,
        id: Date.now()
    }

    arr.push(obj)

    res.json({
        message: "todo added successfully",
        todo: obj
    })

})

// get todo
app.get('/todo', (req, res) => {
    res.json({
        todos: arr
    })
})

// delete request
// app.delete('/todo/:id', (req, res) => {
//     const { id } = req.params;

//     const index = arr.findIndex((item) => item.id === +id);
    
//     if(index === -1) return res.status(404).json({
//         message: 'no todo found'
//     })

//     arr.splice(index , 1);

//     res.json({
//         message: "todo deleted successfully"
//     })

// })
app.delete('/todo/:id', (req, res) => {
    const { id } = req.params;  // ID from the URL (this will be a string)
    const numericId = +id;      // Convert to a number for comparison

    console.log("Delete request for ID:", numericId);
    const index = arr.findIndex((item) => item.id === numericId);

    if (index === -1) {
        return res.status(404).json({ message: 'No todo found with this ID' });
    }

    arr.splice(index, 1);  // Delete the todo from the array
    res.json({ message: 'Todo deleted successfully' });
});

// edit todo
// app.put('/todo/:id' , (req , res)=>{
//     const {title} = req.body;
//     const {id} = req.params;

//     if(!title) return res.status(404).json({
//         message: 'updated title is required'
//     })

//     const index = arr.findIndex((item) => item.id === +id);
    
//     if(index === -1) return res.status(404).json({
//         message: 'no todo found'
//     })

//     arr[index].title = title

//     res.json({
//         message: 'todo updated successfully'
//     })
// })
app.put('/todo/:id', (req, res) => {
    const { id } = req.params;  // ID from the URL (this will be a string)
    const numericId = +id;      // Convert to a number for comparison
    const { title } = req.body; // New title for the todo

    if (!title) {
        return res.status(400).json({ message: 'Title is required for update' });
    }

    console.log("Update request for ID:", numericId, "with title:", title);
    const index = arr.findIndex((item) => item.id === numericId);

    if (index === -1) {
        return res.status(404).json({ message: 'No todo found with this ID' });
    }

    arr[index].title = title;  // Update the title of the todo
    res.json({ message: 'Todo updated successfully' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})