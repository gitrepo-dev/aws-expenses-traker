
// import
const serverless = require('serverless-http');
const express = require('express')
const cors = require('cors');
const app = express()
const db = require("./dynamodb")


// initializing
app.use(cors());
app.use(express.json())
const EXPENSES_TABLE = process.env.EXPENSES_TABLE;


/**
 * get all expenses
 * @param {''}
 * @method GET
 * @return {data[Object]}
**/
app.get('/get/expenses', (req, res) => {
  try {
    // payload
    const params = { 
      TableName: EXPENSES_TABLE
    }
    // get all expenses
    db.scan(params, (error, result) => {
      if (error) {
        res.status(400).json({
          message: 'Something went wrong.',
          success: false,
        });
      }
      if (result?.Items?.length > 0) {
        res.status(200).json({
          message: 'Successfully fetched expenses.',
          success: true,
          data: result?.Items
        })
      } else {
        res.status(200).json({
          message: 'Not found.',
          success: true,
        })
      }
    })
  } catch (e) {
    res.status(500).json({
      message: `Server error 500`,
      success: false,
      error: e.message,
      stack: e.stack
    });
  }
})


/**
 * add expenses
 * @param {uuid, name, ex_type, amount}
 * @method POST
 * @return {Object}
**/
app.post('/add/expenses', (req, res) => {
  try {
    // payload
    const params = {
      TableName: EXPENSES_TABLE,
      Item: req.body
    }
    // create new user
    db.put(params, (error) => {
      if (error) {
        res.status(400).json({
          message: 'Something went wrong.',
          success: false,
        });
      }
      if (Object.values(req.body).length === 4) {
        res.status(201).json({
          message: 'Successfully added expenses.',
          success: true
        })
      } else {
        res.status(400).json({
          message: 'All fields are required.',
          success: false,
        })
      }
    })
  } catch (e) {
    res.status(500).json({
      message: `Server error 500`,
      success: false,
      error: e.message,
      stack: e.stack
    });
  }
})


/**
 * get indivisual expenses
 * @param {uuid}
 * @method GET
 * @return {data[Object]}
**/
app.get('/get/expenses/:uuid', (req, res) => {
  try {
    // payload
    const params = {
      TableName: EXPENSES_TABLE,
      Key: { uuid: req.params.uuid }
    }
    // create new user
    db.get(params, (error, result) => {
      if (error) {
        res.status(400).json({
          message: 'Something went wrong.',
          success: false,
        });
      }
      if (result?.Item) {
        res.status(200).json({
          message: 'Successfully fetched expenses.',
          success: true,
          data: [result?.Item]
        })
      } else {
        res.status(200).json({
          message: 'Not found.',
          success: true,
        })
      }
    })
  } catch (e) {
    res.status(500).json({
      message: `Server error 500`,
      success: false,
      error: e.message,
      stack: e.stack
    });
  }
})


/**
 * delete indivisual expenses
 * @param {uuid}
 * @method DELETE
 * @return {data[Object]}
**/
app.delete('/delete/expenses/:uuid', (req, res) => {
  try {
    // payload
    const params = {
      TableName: EXPENSES_TABLE,
      Key: { uuid: req.params.uuid }
    }
    // create new user
    db.delete(params, (error) => {
      if (error) {
        res.status(400).json({
          message: "Couldn't delete something went wrong.",
          success: false,
        });
      } else {
        res.status(200).json({
          message: 'Successfully deleted expenses.',
          success: true,
        })
      }
    })
  } catch (e) {
    res.status(500).json({
      message: `Server error 500`,
      success: false,
      error: e.message,
      stack: e.stack
    });
  }
})

module.exports.handler = serverless(app);