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

	// signup: async (email, password, name) => {
	// 	set({ isLoading: true, error: null });
	// 	try {
	// 		const response = await axios.post(`${API_URL}/signup`, { email, password, name });
	// 		set({ user: response.data.user, isAuthenticated: true, isLoading: false });
	// 	} catch (error) {
	// 		set({ error: error.response.data.message || "Error signing up", isLoading: false });
	// 		throw error;
	// 	}
	// },

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
	// forgotPassword: async (email) => {
	// 	set({ isLoading: true, error: null });
	// 	try {
	// 		const response = await axios.post(`${API_URL}/forgot-password`, { email });
	// 		set({ message: response.data.message, isLoading: false });
	// 	} catch (error) {
	// 		set({
	// 			isLoading: false,
	// 			error: error.response.data.message || "Error sending reset password email",
	// 		});
	// 		throw error;
	// 	}
	// },

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
}));