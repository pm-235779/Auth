import express from 'express';
import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../mailtrap/emails.js';
import { sendWelcomeEmail } from '../mailtrap/emails.js';
import { sendResetPasswordEmail } from '../mailtrap/emails.js';
import { sendResetPasswordSuccessEmail } from '../mailtrap/emails.js';
// import { API_URL } from '../../frontend/src/store/authStore.js';

// import { generateVerificationCode } from '../utils/generateVerificationcode.js';

export const signup =  async (req, res) => {
    // res.send("Signup route"); 
   const {name, email, password, phone} = req.body;
   try {
    if(!name || !email || !password || !phone) {
        return res.status(400).json({message: "All fields are required"});
   }
   
   const userAlreadyExists = await User.findOne({ 
    $or: [{ email }, { phone }] 
  });
  
  if (userAlreadyExists) {
    return res.status(400).json({sucess: false, message: "User already exists"});
  }

  const hashedPassword = await bcrypt.hash(password,10);

  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
  });


await user.save();
 
generateTokenAndSetCookie(res, user._id);

await sendVerificationEmail(user.email, verificationToken);


res.status(201).json({
    sucess: true,
     message: "User created successfully",
     user:{
        ...user._doc,
        password: undefined
     }
    });

}
   catch(err) {
    res.status(500).json({sucess: false, message: err.message});
   }



}

export const verifyEmail =  async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({verificationToken: code});
        if(!user) {
            return res.status(400).json({sucess: false, message: "Invalid verification token"});
        }

        if(user.verificationTokenExpiresAt < Date.now()) {
            return res.status(400).json({sucess: false, message: "Verification token has expired"});    

        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();   
        await sendWelcomeEmail(user.email,user.name); 
        res.status(200).json({sucess: true, message: "Email verified successfully", 
            user:{
                ...user._doc,
                password: undefined
             } });
    }
    catch(err) {
        res.status(500).json({sucess: false, message: err.message});        

    }
}

export const login =  async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({sucess: false, message: "All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user) { 
            return res.status(400).json({sucess: false, message: "Invalid credentials"});
        }
        // if(!user.isVerified) {
        //     return res.status(400).json({sucess: false, message: "Email not verified"});
        // }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({sucess: false, message: "Invalid credentials"});
        }        
        generateTokenAndSetCookie(res, user._id);
        user.lastlogin = Date.now();
        await user.save();
        res.status(200).json({sucess: true, message: "Logged in successfully",
        user: {
            ...user._doc,
            password: undefined
        }
        });
        if(!user.isVerified) {
            await sendVerificationEmail(user.email, user.verificationToken);
        }
    }
    catch(err) {
        res.status(500).json({sucess: false, message: err.message});
    }
}

export const logout =  async (req, res) => {
   res.clearCookie('token');
   res.status(200).json({sucess: true, message: "Logged out successfully"});
}

export const forgotPassword =  async (req, res) => {
    const {email} = req.body;
    if (!email) {
        return res.status(400).json({sucess: false, message: "Email is required"});
    }
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({sucess: false, message: "User not found"});
        }
        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpire = Date.now() + 60 * 60 * 1000;

        user.resetPasswordExpiresAt = resetPasswordExpire;
        user.resetPasswordToken = resetPasswordToken;
        await user.save();
        await sendResetPasswordEmail(user.email, ` http://localhost:5173/reset-password/${resetPasswordToken}`);
        res.status(200).json({sucess: true, message: "Reset password token sent successfully"});
    }
    catch(err) {
        res.status(500).json({sucess: false, message: err.message});
    }
}

export const resetPassword =  async (req, res) => {
    
    const {token} = req.params;
    console.log(token);

    const {password} = req.body;
    
    try {

        
        const user = await User.findOne({ resetPasswordToken:token});
        if(!user) {
            return res.status(400).json({sucess: false, message: "Invalid reset password token"});
        }
        if(user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({sucess: false, message: "Reset password token has expired"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        await  sendResetPasswordSuccessEmail(user.email);
        res.status(200).json({sucess: true, message: "Password reset successfully"});
    }    
    catch(err) {
        res.status(500).json({sucess: false, message: err.message});
    }
}  

export const checkAuth =  async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(400).json({sucess: false, message: "User not found"});
        }
        res.status(200).json({sucess: true,user});
        }
    
    catch(err) {
        res.status(500).json({sucess: false, message: err.message});
    }
}