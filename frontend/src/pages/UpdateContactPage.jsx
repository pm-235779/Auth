import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

const UpdateContactPage = () => {
  const { id } = useParams(); // Get contact ID from route
  const navigate = useNavigate();
  const [contact, setContact] = useState({ name: '', phone: '' });

  // Fetch contact details
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`${API_URL}/contacts/${id}`); // API to fetch contact details
        setContact(response.data);
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };

    fetchContact();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/contacts/${id}`, contact); // API to update contact
      navigate('/contacts'); // Redirect to contacts page after update
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
        Update Contact
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
        >
          <label className="block text-gray-300 font-semibold">Name:</label>
          <input
            type="text"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg bg-gray-700 text-white"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
        >
          <label className="block text-gray-300 font-semibold">Phone:</label>
          <input
            type="text"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg bg-gray-700 text-white"
            required
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Save Changes
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UpdateContactPage;
