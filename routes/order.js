const router = require("express").Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const bycrpt = require("bcrypt");
const { verifyToken, verifyTokenAuthorization, verifyTokenandAdmin } = require("./verifyToken");


// create order
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const order = await newOrder.save();
        res.status(200).json(order);
    } catch(error){
        res.status(500).json(error);
    }
});


// update order
router.put('/:id', verifyTokenandAdmin, async (req, res) => {    
    try {
        const updateOrder = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json(updateOrder);
    } catch(error){
        res.status(500).json(error);
    }
});

// delete order
router.delete('/:id', verifyTokenandAdmin, async (req, res) => {    
    try {
        const order = await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('Order deleted successfully!');
    } catch(error){
        res.status(500).json(error);
    }
});


// get user order
router.get('/find/:userId', verifyTokenAuthorization, async (req, res) => {       
    try {
       const orders = await Order.find({ userId: req.params.userId });       
        res.status(200).json(orders);
    } catch(error){
        res.status(500).json(error);
    }
});

// get all cart
router.get('/', verifyTokenandAdmin, async (req, res) => {       
    try {
        const orders = await Order.find();       
        res.status(200).json(orders);
    } catch(error){
        res.status(500).json(error);
    }
});

// get monthly income

router.get('/income', verifyTokenandAdmin, async (req, res) => {  
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1))     
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1))  
    try {
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte: previousMonth}}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount"
                },
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales"}
                }
            }
        ]);       
        res.status(200).json(income);
    } catch(error){
        res.status(500).json(error);
    }
});

module.exports = router; 