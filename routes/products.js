const router = require("express").Router();
const Product = require("../models/Product");
const bycrpt = require("bcrypt");
const { verifyToken, verifyTokenAuthorization, verifyTokenandAdmin } = require("./verifyToken");


// create product
router.post('/', verifyTokenandAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch(error){
        res.status(500).json(error);
    }
});


// update product
router.put('/:id', verifyTokenandAdmin, async (req, res) => {    
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json(updateProduct);
    } catch(error){
        res.status(500).json(error);
    }
});
// delete product
router.delete('/:id', verifyTokenandAdmin, async (req, res) => {    
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('Product deleted successfully!');
    } catch(error){
        res.status(500).json(error);
    }
})

// get products
router.get('/', async (req, res) => {   
    const qNew = req.query.new;
    const qCategory = req.query.category; 
    const qFeature = req.query.feature; 
    try {
        let products;
        if(qNew) {
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if(qCategory) {
            products = await Product.find({
            categories:{
                $in: [qCategory]
            }});
        }  else if(qFeature) {
            products = await Product.find({
                feature:{
                    $in: [qFeature]
            }});
        }
        else {
            products = await Product.find()
        }
       
        res.status(200).json(products);
    } catch(error){
        res.status(500).json(error);
    }
});

// get a product
router.get('/find/:id', async (req, res) => {    
    try {
        const product = await Product.findOne({_id: req.params.id});
        res.status(200).json(product);
    } catch(error){
        res.status(500).json(error);
    }
})


module.exports = router; 