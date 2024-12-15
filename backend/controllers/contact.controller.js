import express from 'express';
import {User} from '../models/user.model.js';

import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';


// export const addContact = async (req, res) => {
//     const { name, phone} = req.body

//     try {
//         if(!name || !phone) {
//             return res.status(400).json({message: "All fields are required"});
//         }   
//         const contactAlreadyExists = await User.findOne({ phone });
//         if (contactAlreadyExists) {
//             return res.status(400).json({sucess: false, message: "Contact already exists"});
//         }

//         user.contacts.push({ name, phone });
//         await user.save();

//         res.status(201).json({ sucess: true, message: "Contact added successfully", contacts: user.contacts });
        
//     } catch (error) {
//         res.status(500).json({ sucess: false, message: error.message });
//     }

//     }

export const addContact = async (req, res) => {
    const { name, phone } = req.body;

    try {
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Retrieve the authenticated user from the database
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the contact already exists for this user
        const contactAlreadyExists = user.contacts.some(contact => contact.phone === phone);
        if (contactAlreadyExists) {
            return res.status(400).json({ success: false, message: "Contact already exists" });
        }

        // Add the new contact to the user's contacts array
        user.contacts.push({ name, phone });
        await user.save();

        res.status(201).json({ success: true, message: "Contact added successfully", contacts: user.contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding contact", error: error.message });
    }
};


export const getContacts = async (req, res) => {
    try {
        // Retrieve the authenticated user from the database
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return the contacts
        res.status(200).json({ success: true, contacts: user.contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving contacts", error: error.message });
    }
};


export const updateContact = async (req, res) => {
    const { id } = req.params;  // Get contact ID from URL params
    const { name, phone } = req.body;  // Get name and phone from request body

    if(!name || !phone) {
        return res.status(400).json({success: false, message: "All fields are required"});
    }
    try {
        // Retrieve the authenticated user from the database
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the contact to update
        const contact = user.contacts.id(id); // Find contact by ID
        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        // Update the contact details
        contact.name = name || contact.name;
        contact.phone = phone || contact.phone;

        // Save the updated user document
        await user.save();

        res.status(200).json({ success: true, message: "Contact updated successfully", contacts: user.contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating contact", error: error.message });
    }
};


// export const deleteContact = async (req, res) => {
//     const { id } = req.params;  // Get contact ID from URL params

//     try {
//         // Retrieve the authenticated user from the database
//         const user = await User.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Find the contact to delete
//         const contact = user.contacts.id(id); // Find contact by ID
//         if (!contact) {
//             return res.status(404).json({ success: false, message: "Contact not found" });
//         }

//         // Remove the contact from the contacts array
//         contact.remove();

//         // Save the updated user document
//         await user.save();

//         res.status(200).json({ success: true, message: "Contact deleted successfully", contacts: user.contacts });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Error deleting contact", error: error.message });
//     }
// };



export const deleteContact = async (req, res) => {
    const { id } = req.params;  // Extract contact ID from the URL params

    try {
        const user = await User.findById(req.userId);  // Assuming `req.userId` contains the authenticated user's ID
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const contactIndex = user.contacts.findIndex(contact => contact._id.toString() === id);  // Find the contact by its unique _id field
        if (contactIndex === -1) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        user.contacts.splice(contactIndex, 1);  // Remove the contact at the found index

        await user.save();

        res.status(200).json({ success: true, message: "Contact deleted successfully", contacts: user.contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting contact", error: error.message });
    }
};
