"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    // Check if URL has token (from OAuth redirect)
    const token = searchParams.get("token");
    if (token) {
      Cookies.set("token", token);
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", formData);
      Cookies.set("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 glassmorphism rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">
          Login to NEXUS
        </h2>
        {error && (
          <div className="bg-red-500 bg-opacity-30 border border-red-500 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 bg-transparent border-b-2 border-blue-400 focus:border-blue-300 text-white placeholder-gray-400 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 bg-transparent border-b-2 border-blue-400 focus:border-blue-300 text-white placeholder-gray-400 focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
  <button
    type="button"
    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
    className="w-full flex items-center justify-center p-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
  >
    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" />
    <span className="text-white">Google</span>
  </button>

  <button
    type="button"
    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/github`}
    className="w-full flex items-center justify-center p-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
  >
    <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="h-5 w-5 mr-2 invert" />
    <span className="text-white">GitHub</span>
  </button>
</div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 glow-on-hover font-semibold disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="font-medium text-blue-400 hover:text-blue-300">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
