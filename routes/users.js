const router = require("express").Router();
const User = require("../models/User");
const Contact = require("../models/Contact");
const bycrpt = require("bcrypt");
const { verifyToken, verifyTokenAuthorization, verifyTokenandAdmin } = require("./verifyToken");


// update user
router.put('/:id', verifyTokenAuthorization, async (req, res) => {
    if(req.body.password) {
        const salt = await bycrpt.genSalt(10);
        const hashPassword = await bycrpt.hash(req.body.password, salt);
        req.body.password = hashPassword;
    }

    try {
     const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
     },{new: true});
     const {password, updatedAt, createdAt, ...rest} = updatedUser._doc;
     res.status(200).json(rest);
    } catch(err) {
        res.status(500).json(err);
    }
})

//delete user
router.delete('/:id', verifyTokenAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted successfully!");
    }catch(err){
        res.status(500).json(err);
    }
});

//get a user
router.get('/find/:id', verifyTokenandAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...rest} = user._doc;
        res.status(200).json(rest);
    }catch(err){
        res.status(500).json(err);
    }
});

//get all user
router.get('/', verifyTokenandAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({_id : -1 }).limit(1) : 
        await User.find(); 
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

//get user status
router.get('/stats', verifyTokenandAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear - 1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month", 
                    total: { $sum : 1 }
                }
            }
        ]);
        res.status(200).json(data);
       
    } catch(err){
        res.status(500).json(err);
    }
});


router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        const {password, _id, username, isAdmin, createdAt, updatedAt, __v, ...rest} = user._doc;
        if (user) res.status(200).json(rest);
        if (!user) res.status(404).json('user not found');

    } catch (error) {
        res.status(500).json(error);
    }

});

router.post('/contact', async (req, res) => {
    try {
        const newContact = new Contact({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message
        });
        // save new contact
        const contact = await newContact.save();
        res.status(200).json(contact);    

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router; 