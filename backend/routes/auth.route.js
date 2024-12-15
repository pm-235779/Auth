import express from 'express';
import { signup, login, logout, verifyEmail , forgotPassword , resetPassword,checkAuth} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/VerifyToken.js';
import { 
    addContact,
    getContacts,
    updateContact,  
    deleteContact
} from '../controllers/contact.controller.js';
const router = express.Router();

router.get('/check-Auth', verifyToken, checkAuth);

router.post('/signup', signup);

router.post('/verify-email', verifyEmail);

router.post('/login', login);

router.post('/logout', logout);

router.post('/reset-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.post('/contacts', verifyToken, addContact);           // Add a new contact

router.get('/contacts', verifyToken, getContacts);           // Get all contacts

router.put('/contacts/:id', verifyToken, updateContact);     // Update a contact

router.delete('/contacts/:id', verifyToken, deleteContact);  // Delete a contact

export default router;
