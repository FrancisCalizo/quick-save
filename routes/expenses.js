const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Expense = require('../models/Expense');

// @route     GET api/expenses
// @desc      Get all users expenses
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: 1
    });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/expenses
// @desc      Add new expense
// @access    Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, amount, date } = req.body;

    try {
      const newExpense = new Expense({
        name,
        amount,
        date,
        user: req.user.id
      });

      const expense = await newExpense.save();

      res.json(expense);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// @route     PUT api/expenses/:id
// @desc      Update expense
// @access    Private
router.put('/:id', auth, async (req, res) => {
  const { name, amount, date } = req.body;

  // Build Expense Object
  const expenseFields = {};
  if (name) expenseFields.name = name;
  if (amount) expenseFields.amount = amount;
  if (date) expenseFields.date = date;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/expenses/:id
// @desc      Delete expense
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized' });
    }

    await Expense.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Expense Removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
