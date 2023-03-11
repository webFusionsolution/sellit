const router = require("express").Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const bycrpt = require("bcrypt");
const { verifyToken, verifyTokenAuthorization, verifyTokenandAdmin } = require("./verifyToken");


// create cart
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const cart = await newCart.save();
        res.status(200).json(cart);
    } catch(error){
        res.status(500).json(error);
    }
});


// update cart
router.put('/:id', verifyTokenAuthorization, async (req, res) => {    
    try {
        const updateCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json(updateCart);
    } catch(error){
        res.status(500).json(error);
    }
});

// delete cart
router.delete('/:id', verifyTokenAuthorization, async (req, res) => {    
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json('Cart deleted successfully!');
    } catch(error){
        res.status(500).json(error);
    }
});


// get cart
router.get('/find/:userId', verifyTokenAuthorization, async (req, res) => {       
    try {
       const cart = await Cart.findOne({userId: req.params.userId});       
        res.status(200).json(cart);
    } catch(error){
        res.status(500).json(error);
    }
});

// get all cart
router.get('/', verifyTokenandAdmin, async (req, res) => {       
    try {
        const carts = await Cart.find();       
        res.status(200).json(carts);
    } catch(error){
        res.status(500).json(error);
    }
});

module.exports = router; 