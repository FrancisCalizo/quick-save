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
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// @route     PUT api/expenses/:id
// @desc      Update expense
// @access    Private
router.put('/:id', (req, res) => {
  res.send('Update expense');
});

// @route     DELETE api/expenses/:id
// @desc      Delete expense
// @access    Private
router.delete('/:id', (req, res) => {
  res.send('Delete expense');
});

module.exports = router;
