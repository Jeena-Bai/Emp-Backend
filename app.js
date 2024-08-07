
const express = require('express');
const mongoose = require('mongoose');

const app = new express();
app.use(express.json());

// Task1: initiate app and run server at 3000 : At the end

const path=require('path');
app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));

// Task2: create mongoDB connection

const mongoDB_URL='mongodb+srv://jeenabai2015:jeena21@cluster0.zsm7g.mongodb.net/EMP_BCK?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoDB_URL)
    .then(() => {
        console.log('DB is connected');
    })
    .catch(() => {
        console.log('Error in connection');
    })

//schema
const employeeSchema = new mongoose.Schema({
  name: String,
  location: String,
  position: String,
  salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        //console.log(req.body);
        const employees = await Employee.find({});
        res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'})
    }
});

//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee == null) {
            return res.status(404).json({ message: "Employee not found"} );
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(404).json({ error:"Internal server error" });
    }
});


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const employeedata = {
            name: req.body.name,
            location: req.body.location,
            position: req.body.position,
            salary: req.body.salary,
        }
        var employee= new Employee(employeedata)
        await employee.save();
        res.status(201).json(employeedata);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'})
    }
});

//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee == null) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.deleteOne({ _id: req.params.id });
        res.status(200).json({message: "Employee deleted successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'})
    }
});

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async (req, res) => {
    const { _id, ...updateData } = req.body;
    console.log(req.body);
    try {
        const employeedata = await Employee.findByIdAndUpdate(_id , updateData, { new: true });
        console.log(employeedata); // Log the updated employee data received from the server
        res.status(200).json(employeedata);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'})
    }
});


// server on port 3000
PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is listening on PORT ${PORT}`)
})

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});