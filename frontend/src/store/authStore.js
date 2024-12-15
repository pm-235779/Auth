import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	contacts: [], 
	

	signup: async (email, password, name,phone) => {
		set({ isLoading: true, error: null });
	
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name , phone});
	
			// Log the response for debugging
			console.log("API response:", response);
	
			// Ensure response structure matches expected format
			const user = response.data?.user;
			if (!user) {
				throw new Error("Invalid response structure: user data is missing.");
			}
	
			set({ user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			console.error("Signup error:", error.response);
	
			set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			console.log("Sending forgot password request for:", email);
			const response = await axios.post(`${API_URL}/reset-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Error sending reset password email";
			set({
				isLoading: false,
				error: errorMessage,
			});
			console.error("Forgot password error:", error); // Optional: Log full error for debugging
			throw error;
		}
	},
	

	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
			console.log("Token received:", token);
            console.log("Password received:", password);

		} catch (error) {

			console.log("yoooooooo")
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

  
	// Fetch contacts
	fetchContacts: async (id) => {
	  set({ isLoadingContacts: true, errorContacts: null });
	  try {
		const response = await axios.get(`${API_URL}/contacts`);
		set({ contacts: response.data.contacts, isLoadingContacts: false });
		console.log("API Response:", response.data);
		console.log("Contacts:", response.data.contacts);
		console.log("diuigfnucw");
	  } catch (error) {
		set({
		  errorContacts: error.response?.data?.message || "Error fetching contacts",
		  isLoadingContacts: false,
		});
		console.error("Error fetching contacts:", error);
	  }
	},
  
	// Delete a contact
	deleteContact: async (contactId) => {
	  set({ isLoadingContacts: true, errorContacts: null });
	  try {
		await axios.delete(`${API_URL}/${contactId}`);
		set((state) => ({
		  contacts: state.contacts.filter(contact => contact.id !== contactId),
		  isLoadingContacts: false,
		}));
	  } catch (error) {
		set({
		  errorContacts: error.response?.data?.message || "Error deleting contact",
		  isLoadingContacts: false,
		});
		console.error("Error deleting contact:", error);
	  }
	},
  
	// Update a contact
	updateContact: async (contactId, updatedContactData) => {
	  set({ isLoadingContacts: true, errorContacts: null });
	  try {
		const response = await axios.put(`${API_URL}/${contactId}`, updatedContactData);
		set((state) => ({
		  contacts: state.contacts.map(contact =>
			contact.id === contactId ? response.data : contact
		  ),
		  isLoadingContacts: false,
		}));
	  } catch (error) {
		set({
		  errorContacts: error.response?.data?.message || "Error updating contact",
		  isLoadingContacts: false,
		});
		console.error("Error updating contact:", error);
	  }
	},

}));
