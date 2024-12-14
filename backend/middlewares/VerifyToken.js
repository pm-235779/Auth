import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
   if (!token) {
       return res.status(401).json({sucess: false, message: "Unauthorized"});    
   }
   try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       if (!decoded) {
           return res.status(401).json({sucess: false, message: "Unauthorized"});    
       }
       req.userId = decoded.userId;
       next();
   } catch (error) {
       return res.status(401).json({sucess: false, message: "Unauthorized"});    
   }
}   