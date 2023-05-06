const router = require("express").Router();
const Brand = require("../models/Brand");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyTokenAuthorization, verifyTokenandAdmin } = require("./verifyToken");


router.get('/', (req, res) => {
    res.send('welcome to brand homepage')
})

// Create Brand

router.post('/', verifyTokenandAdmin, async (req, res) => {
      try {
        const newBrand = new Brand({
             name: req.body.name
        })
        const newsBrand = await newBrand.save();
        res.status(200).json(newsBrand);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Get All Brand

router.get('/all', verifyTokenandAdmin, async (req, res) => {
    try {       
      const brands = await Brand.find();
      res.status(200).json(brands);
  } catch (error) {
      res.status(500).json(error);
  }
})


// delete Brand

router.delete('/:id', verifyTokenandAdmin, async (req, res) => {
    try {       
      const brands = await Brand.findByIdAndDelete({_id: req.params.id});
      res.status(200).json('brand deleted successfully!');
  } catch (error) {
      res.status(500).json(error);
  }
})

module.exports = router; 