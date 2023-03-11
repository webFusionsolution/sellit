const router = require("express").Router();
const User = require("../models/User");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get('/', (req, res) => {
    res.send('welcome to auth homepage')
})

// Register

router.post('/register', async (req, res) => {
     // generate new password
    const salt = await bycrpt.genSalt(10);
    const hashPassword = await bycrpt.hash(req.body.password, salt);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword
    });
    try {
       
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})


// // Login 
router.post('/login', async(req, res) =>{
    try{
        const user = await User.findOne({username: req.body.username});
        if(!user) res.status(404).json('user not found');
   
        const validPassword = await bycrpt.compare(req.body.password, user.password);
        if(!validPassword) res.status(400).json("password incorrect");
        const {password, updatedAt, createdAt,  ...rest} = user._doc;

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SECRET, {expiresIn: "3d"})

        res.status(200).json({...rest, accessToken});

    }catch(error){
        res.status(500).json(error);
    }

});

// router.get('/login/:email', async(req, res) =>{
//     try{
//         const user = await User.findOne({email: req.params['email']});
//         console.log(req.params['email'])
//         if(!user) res.status(404).json('user not found');

//     }catch(error){
//         //res.status(500).json(error);
//     }

// });

module.exports = router; 