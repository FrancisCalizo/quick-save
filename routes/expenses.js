const express = require('express');
const router = express.Router();

// @route     GET api/expenses
// @desc      Get all users expenses
// @access    Private
router.get('/', (req, res) => {
  res.send('Get all expenses');
});

// @route     POST api/expenses
// @desc      Add new expense
// @access    Private
router.post('/', (req, res) => {
  res.send('Add new expense');
});

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
