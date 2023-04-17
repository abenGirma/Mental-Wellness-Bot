const express = require('express')
//const {Database} = require('../db/IDatabase')
const router = express.Router()
const User = require('../models/userModel')


router.get('/', async (req, res) => {
  //return res.send(Object.values(users));
   try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:userId', async (req, res) => {
  try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post('/', async (req,res) => {
  console.log(req.body);
  try {
        const user = await User.create(req.body)
        res.status(200).json(user);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// update a user
router.put('/:userId', async(req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findByIdAndUpdate(userId, req.body);
        // we cannot find any user in database
        if(!user){
            return res.status(404).json({message: `cannot find any user with ID ${userId}`})
        }
        const updatedUser = await User.findById(userId);
        res.status(200).json(updatedUser);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// delete a user

router.delete('/:userId', async(req, res) =>{
    try {
        const {userId} = req.params;
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).json({message: `cannot find any user with ID ${userId}`})
        }
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = router