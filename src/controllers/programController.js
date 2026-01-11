const Program = require("../models/program");

// Controller for GET
const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find(); // fetch all
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller for POST
const createProgram = async (req, res) => {
  try {
    const program = new Program(req.body); // make sure your model matches the body
    await program.save();
    res.status(201).json(program);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getPrograms, createProgram };
