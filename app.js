const express = require("express");
const fetchingDataRouter = require('./routes/fetchingDataRouter')
const chatBotRoute= require('./routes/chatBotRoute')
const authRouter = require('./routes/authRouter')
const {verifyAccessToken} = require('./helpers/jwt_helpers')

const cors = require("cors");
const morgan = require("morgan");


const app = express();
// MIDDLEWARES
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// ROUTES
app.use("/api/auth",  authRouter);
app.use("/api/data", verifyAccessToken, fetchingDataRouter);
app.use("/api/talk", verifyAccessToken, chatBotRoute);


module.exports = app;