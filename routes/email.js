const router = require("express").Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

router.get('/', (req, res) => {
    res.send('welcome to email homepage')
})

router.post('/forgetPassword', async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) res.status(404).json('user not found');

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          
        const mailOptions = {
            from: process.env.EMAIL_EXT,
            to: user.email,
            subject: 'Fusion Web - Find your password below',
            text: `Your account password is ${user.password}`,
            html: `<b>Hello, <strong>${user.username}</strong>, Your password is:\n<b>${user.password }</b></p>`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              res.status(400).json(error)
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).json(info.response)
            }
          });

       
    }catch(error){
        //res.status(500).json(error);
    }
});


module.exports = router; 