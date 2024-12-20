import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,   
        required: true,
        unique: true
    },
    lastlogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },


    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    contacts: [
        {
        
            name: {
                type: String,
                
            },
            phone: {
                type: String,
                
            },
          
           
        }
    ]

},{timestamps:true});


 export const User = mongoose.model("User", userSchema);
