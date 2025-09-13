import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImSpinner8 } from "react-icons/im";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/user/login",
        {
          email,
          password,
        }
      );

      // Assuming successful login if response status is 200
      if (res.status === 200) {
        // Save user's email in localStorage as a placeholder for logged-in state
        console.log(res);
        localStorage.setItem("userId", res.data.user._id);
        console.log("Login successful. ID saved:", res.data.user._id);
        setLoading(false);
        // Redirect to the women's products page
        navigate("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error(
        "Error during login:",
        err.response?.data?.message || err.message
      );
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md text-lg text-center font-semibold hover:bg-gray-800 transition"
          >
            {loading ? (
              <ImSpinner8 className="animate-spin place-self-center" />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
