
// import
const serverless = require('serverless-http');
const express = require('express')
const cors = require('cors');
const app = express()
const db = require("./dynamodb")


// initializing
app.use(cors());
app.use(express.json())
const USERS_TABLE = process.env.USERS_TABLE;


/**
 * get the user by uuid
 * @param {uuid}
 * @method POST
 * @return {Object}
**/
app.post('/user/signin', (req, res) => {
  try {
    // payload
    const params = {
      TableName: USERS_TABLE,
      Key: { email: req.body.email },
    }
    // find the user
    db.get(params, (error, result) => {
      if (error) {
        console.log(error, 'error')
        res.status(400).json({
          message: 'Somthing went wrong.',
          success: true,
        });
      }
      if (result && req?.body?.email === result?.Item?.email && req?.body?.password === result?.Item?.password) {
        const { password, ...rest } = result.Item
        res.status(200).json({
          message: 'Successfully signed in.',
          success: true,
          data: {
            user_agent: {
              ...rest,
              auth: true,
              token: 'd41d8cd98f00b204e9800998ecf8427e32f11ddf1556sdfs8xddd'
            }
          }
        })
      } else {
        res.status(404).json({
          message: 'Invalid credentials.',
          success: false
        });
      }
    });
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
 * create new user
 * @param {uuid, name}
 * @method POST
 * @return {Object}
**/
app.post('/user/signup', (req, res) => {
  try {
    // payload
    const params = {
      TableName: USERS_TABLE,
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
        const { password, ...rest } = req.body
        res.status(201).json({
          message: 'Successfully signed up.',
          success: true,
          data: {
            user_agent: {
              ...rest,
              auth: true,
              token: 'd41d8cd98f00b204e9800998ecf8427e32f11ddf1556sdfs8xddd'
            }
          }
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


module.exports.handler = serverless(app);