const router = require("express").Router();
const Category = require("../models/Category");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyTokenAuthorization, verifyTokenandAdmin } = require("./verifyToken");


router.get('/', (req, res) => {
    res.send('welcome to category homepage')
})

// Create Category

router.post('/', verifyTokenandAdmin, async (req, res) => {
      try {
        const category = new Category({
             name: req.body.category
        })
        const newCat = await category.save();
        res.status(200).json(newCat);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Create Category

router.get('/all', verifyTokenandAdmin, async (req, res) => {
    try {       
      const categories = await Category.find();
      res.status(200).json(categories);
  } catch (error) {
      res.status(500).json(error);
  }
})


// delete Category

router.delete('/:id', verifyTokenandAdmin, async (req, res) => {
    try {       
      const categories = await Category.findByIdAndDelete({_id: req.params.id});
      res.status(200).json('Categoery deleted successfully!');
  } catch (error) {
      res.status(500).json(error);
  }
})

module.exports = router; 