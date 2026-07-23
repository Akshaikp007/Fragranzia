import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FiUser, FiLock, FiEyeOff, FiEye } from 'react-icons/fi';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { BASE_URL } from '../../axios';
import logbg1 from '../../assets/logbg1.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (auth?.accessToken) {
      if (auth.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [auth, navigate]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError('');
        setLoading(true);
        const res = await axios.post(`${BASE_URL}/api/auth/google`, {
          access_token: tokenResponse.access_token,
          token: tokenResponse.access_token,
        });

        const { token, user } = res.data;

        localStorage.setItem('accessToken', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('name', user.name);
        localStorage.setItem('userId', user._id);

        setAuth({
          accessToken: token,
          role: user.role,
          name: user.name,
          id: user._id,
        });

        const targetPath = user.role === 'admin' 
          ? '/admin/dashboard' 
          : (from !== '/' ? from : '/home');
        navigate(targetPath, { replace: true });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Google Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Login failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      
      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('name', user.name);
      localStorage.setItem('userId', user._id);

      // Update Auth State Context
      setAuth({
        accessToken: token,
        role: user.role,
        name: user.name,
        id: user._id
      });

      // Redirect to target route
      const targetPath = user.role === 'admin' 
        ? '/admin/dashboard' 
        : (from !== '/' ? from : '/home');
      navigate(targetPath, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="hidden lg:flex w-[80%] p-10 items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-[700px] aspect-square relative overflow-hidden rounded-tl-[200px] rounded-br-[200px] shadow-sm">
          <img
            src={logbg1}
            alt="perfume"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-10">
            <h1 className="text-[44px] lg:text-5xl leading-tight font-bold mb-4 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[15px] lg:text-base font-medium leading-relaxed max-w-sm">
              Glad to see you again! Access your account to explore more
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[50%] flex items-center justify-center p-8">
        <div className="w-full max-w-[440px]">
          {/* Social Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="flex-1 flex items-center justify-center gap-3 border border-[#0d3b4a] py-2.5 rounded-lg text-[15px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FcGoogle size={20} /> Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-3 border border-[#0d3b4a] py-2.5 rounded-lg text-[15px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <FaFacebook size={20} className="text-[#1877F2]" /> Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-400" />
            <span className="px-5 text-sm text-gray-600 font-medium whitespace-nowrap">Or sign In with email</span>
            <hr className="flex-1 border-gray-400" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                <FiUser size={18} />
              </div>
              <input
                type="email"
                placeholder="Enter your E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#dce0e0] rounded-lg py-3.5 pl-12 pr-4 text-[15px] font-medium outline-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#0d3b4a] transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                <FiLock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#dce0e0] rounded-lg py-3.5 pl-12 pr-12 text-[15px] font-medium outline-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#0d3b4a] transition-all"
                required
              />
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1 pb-1">
              <a href="#" className="text-sm font-medium text-[#043343] hover:text-[#032530] underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#043343] hover:bg-[#032530] text-white py-3.5 rounded-lg text-[15px] font-semibold transition-colors mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>

            <p className="text-center text-[15px] font-medium text-gray-800 pt-3">
              Don’t have an account?{" "}
              <Link to="/signup" className="underline text-[#043343] font-semibold hover:text-[#032530]">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
