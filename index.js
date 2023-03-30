const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const emailRoute = require("./routes/email");
import connectDB from './config/connectdb.js';
const DATABASE_URL = process.env.DATABASE_URL;


dotenv.config();

app.use(cors()); // <---- use cors middleware

connectDB(DATABASE_URL);


// Middle warevs
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));



app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

//app.use("/api/email", emailRoute);


app.get('/', (req, res) => {
    res.send('welcome to homepage')
})


const server = app.listen(process.env.PORT || 8800, () => {
    const port = server.address().port;
    console.log(`console.log('backend sever is running!'); ${port}`);
});