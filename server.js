require("dotenv").config();
// dependancies
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const morgan = require('morgan');

// app object
const app = express();
// PORT 
// this code is destructing the port value from process.env
const {PORT = 5000, MONGODB_URL} = process.env;

// database connection=============================
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// connection events--
mongoose.connection
.on("open", () => console.log("You are connected to mongodb"))
.on("close", () => console.log("You are disconnected from mongodb"))
.on("error", (error) => console.log(error));
// models=========================================
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People", PeopleSchema);

// middleware===================================
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
// routes===========================================
// test route==============
app.get('/', (req, res) => {
    res.send("hello world");
});
// people index route================================
app.get('/people', async (req, res) => {
    try {
        // send all people
        res.json(await People.find({}));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});
// people delete route=============================
app.delete('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

// update route====================================
app.put("/people/:id", async (req, res) => {
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        res.status(400).json(error);
    }
});
// people create route===============================
app.post("/people", async (req, res) => {
    try {
        // send all people
        res.json(await People.create(req.body));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// listener======================================
app.listen(PORT, () => console.log('Express is listening on port:', PORT));