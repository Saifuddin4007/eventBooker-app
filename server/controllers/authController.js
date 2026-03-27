const User= require('../models/User');
const OTP= require('../models/OTP');
const bcrypt= require('bcryptjs');
const { sendOTPEmail } = require('../utils/email');
const jwt= require('jsonwebtoken');

//!token generation

const generateToken= (id, role)=>{
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn:'7d'});
}



//!Register User
exports.registerUser = async (req,res) =>{

    try{
        const {name, email, password}= req.body;

        const userExist= await User.findOne({email});
        if(userExist){
            return res.status(400).json({Error: 'User already exists'});

        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password, salt);

        const user= await User.create({name, email, password: hashedPassword, role:'user', isVerified: false});
        
        res.status(201).json({message:"User registered Successfully"});

        const otp= Math.floor(100000+Math.random()*900000).toString();
        console.log(`OTP for ${email}: ${otp}`);

        await OTP.create({email, otp, action:'account_verification'});
        await sendOTPEmail(email, otp, 'account_verification');

        res.status(201).json({message:"You are registered successfully. Please check your mail for OTP verification", email:user.email});

        



    }catch(err){
        res.status(400).json({error: err.message});
    }
}









//!Login
exports.loginUser= async (req,res)=>{
    try{
        const {email, password}= req.body;

        let user= await User.findOne({email});

        if(!user){
            return res.status(400).json({error:"Invalid Credentials, Sign up first"});
        }

        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"});

        }


        if(!user.isVerified && user.role==='user'){
            const otp= Math.floor(100000+ Math.random()*900000).toString();
            await OTP.deleteMany({email, action:'account_verification'});
            await OTP.create({email, otp, action:'account_verification'});

            await sendOTPEmail(email, otp, 'account_verification');
            return res.status(400).json({
                error:"Account was not verified, a new OTP is sent to you gmail account"
            });
        }


        res.status(200).json({
            message:'Login Successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        })
    }catch(err){
        res.status(400).json({error: err.message});
    }

}


//!verify OTP
exports.verifyOTP= async(req,res)=>{
    const {email, otp}= req.body;
    const otpRecord= await OTP.findOne({email, otp, action:"account_verification"});

    if(!otpRecord){
        return res.status(400).json({error:"Invalid OTP"});
    }

    const user= await User.findOneAndUpdate({email}, {isVerified:true});
    await OTP.deleteMany({email, action:"account_verification"});
    res.status(200).json({
        message:"Account verified successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.ṛole)

    });
}