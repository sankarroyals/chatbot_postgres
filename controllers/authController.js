
const {authSchema} = require('../helpers/validations')
const pool = require('../models/database')
const bcrypt = require('bcrypt')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helpers')

exports.register = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        // validating email and password
        const validating_email_password = await authSchema.validateAsync(req.body);

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const passwordHashing = await bcrypt.hash(validating_email_password.password, salt)

        // Checking user already exist or not
        const userDoesExist = await pool.query('select * from accounts where email = $1', [validating_email_password.email])
        if(userDoesExist.rows.length>0){
            return res.status(404).json({message: 'Email Already Exist'})
        }

        // Inserting new user
        const newUser = await pool.query('insert into accounts (email, password) values($1, $2) RETURNING *', [validating_email_password.email, passwordHashing])
        // console.log(newUser.rows[0])
        const accessToken = await signAccessToken({email: newUser.rows[0]?.email, user_id: newUser.rows[0]?.user_id}, `${newUser.rows[0]?.user_id}`)
        const refreshToken = await signRefreshToken({email: newUser.rows[0]?.email, user_id: newUser.rows[0]?.user_id}, `${newUser.rows[0]?.user_id}`)

        return res.send({accessToken: accessToken, refreshToken: refreshToken})
    } catch (err) {
        if(err.isJoi==true) err.status=422
        next(err);
    }
  };

  exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        // validating email and password
        const validating_email_password = await authSchema.validateAsync(req.body);
        

        // Checking user already exist or not
        const userDoesExist = await pool.query('select * from accounts where email = $1', [validating_email_password.email])
        if(userDoesExist.rows.length==0){
            return res.status(404).json({message: 'User not found'})
        } 

        // comparing password
        if(!await bcrypt.compare(validating_email_password.password, userDoesExist.rows[0]?.password) ){
            return res.status(404).json({message: 'Email/password is wrong'})
        } else {
            const accessToken = await signAccessToken({email: userDoesExist.rows[0]?.email, user_id: userDoesExist.rows[0]?.user_id}, `${userDoesExist.rows[0]?.user_id}`)
            const refreshToken = await signRefreshToken({email: userDoesExist.rows[0]?.email, user_id: userDoesExist.rows[0]?.user_id}, `${userDoesExist.rows[0]?.user_id}`)

            return res.send({accessToken: accessToken, refreshToken: refreshToken})
        }
    
    } catch (err) {
        if(err.isJoi==true) err.status=422
        next(err);
    }
  };


  exports.refreshToken = async (req, res, next) => {
    try {
      const {refreshToken} = req.body;
      if(!refreshToken){
        return res.status(400).json({message: 'Bad request'})
     }
     const {user_id, email} = await verifyRefreshToken(refreshToken);
     const accessToken = await signAccessToken({email: email, user_id: user_id}, `${user_id}`)
     const refreshtoken = await signRefreshToken({email: email, user_id: user_id}, `${user_id}`)

     return res.send({accessToken: accessToken, refreshToken: refreshtoken})

    } catch (err) {
        if(err.isJoi==true) err.status=422
        next(err);
    }
  };

  