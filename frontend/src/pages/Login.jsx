import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  CircleCheck,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const endpoint = '/auth/user/login';

      const { data } = await api.post(endpoint, {
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', 'user');
      localStorage.setItem('name', data.name);

      navigate('/jobs');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8fc] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-blue-50/70 blur-3xl" />
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          relative
          z-10
          w-full
          max-w-[1110px]
          min-h-[680px]
          bg-white
          rounded-[42px]
          overflow-hidden
          shadow-[0_25px_70px_rgba(30,80,130,0.15)]
          grid
          grid-cols-1
          lg:grid-cols-2
        "
      >

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div
          className="
            relative
            overflow-hidden
            px-10
            py-12
            sm:px-14
            lg:px-[68px]
            bg-gradient-to-br
            from-[#08649b]
            via-[#116fae]
            to-[#3479dc]
            text-white
            flex
            flex-col
            justify-between
          "
        >

          {/* Decorative circles */}
          <div className="absolute -top-24 -right-20 w-[280px] h-[280px] rounded-full bg-white/5" />

          <div className="absolute top-20 -right-32 w-[350px] h-[350px] rounded-full bg-white/5" />

          <div className="absolute -bottom-40 -left-32 w-[400px] h-[400px] rounded-full bg-blue-900/10" />

          <div className="relative z-10">

            {/* Sparkle Icon */}
            <div
              className="
                w-[72px]
                h-[72px]
                rounded-[18px]
                border
                border-cyan-300/30
                bg-white/10
                flex
                items-center
                justify-center
                mb-14
              "
            >
              <Sparkles className="w-9 h-9 text-cyan-300" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
              Welcome Back to
              <span className="block text-[#08c2df] mt-2">
                Centennial
              </span>

              <span className="block text-[#08c2df] mt-1">
                Careers
              </span>
            </h1>

            {/* Description */}
            <p className="mt-9 max-w-[430px] text-lg sm:text-xl font-semibold leading-8 text-white/90">
              Sign in to access your applications, manage your profile,
              and connect with global opportunities.
            </p>

            {/* Benefits */}
            <div className="mt-12 space-y-6">

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <CircleCheck className="w-7 h-7 text-cyan-300" />
                </div>

                <span className="text-lg font-bold">
                  Stay updated on application status
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <CircleCheck className="w-7 h-7 text-cyan-300" />
                </div>

                <span className="text-lg font-bold">
                  Personalized job recommendations
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <CircleCheck className="w-7 h-7 text-cyan-300" />
                </div>

                <span className="text-lg font-bold">
                  One-click applying to new roles
                </span>
              </div>

            </div>

          </div>

          {/* Powered By */}
          <div className="relative z-10 mt-12 pt-6 border-t border-white/20">

            <p className="text-xs font-black tracking-[0.3em] text-white/60">
              POWERED BY
            </p>

            <p className="mt-2 text-lg font-black">
              Centennial
              <span className="text-cyan-300">
                Infotech
              </span>
            </p>

          </div>

        </div>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div
          className="
            bg-white
            px-8
            py-12
            sm:px-14
            lg:px-[68px]
            flex
            items-center
          "
        >

          <div className="w-full max-w-[490px] mx-auto">

            {/* Heading */}
            <div className="mb-10">

              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111a31]">
                Candidate Sign In
              </h2>

              <p className="mt-3 text-lg font-semibold text-[#687994]">
                Access your personal career dashboard
              </p>

            </div>


            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  mb-6
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  px-4
                  py-3
                  text-red-600
                "
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />

                <span className="text-sm font-bold">
                  {error}
                </span>
              </motion.div>
            )}


            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-7"
            >

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="
                    block
                    mb-3
                    text-xs
                    font-black
                    tracking-wider
                    text-[#8da0bb]
                  "
                >
                  EMAIL ADDRESS
                </label>

                <div className="relative">

                  <Mail
                    className="
                      absolute
                      left-5
                      top-1/2
                      -translate-y-1/2
                      w-5
                      h-5
                      text-[#91a5c0]
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="jane@example.com"
                    className="
                      w-full
                      h-[64px]
                      rounded-[17px]
                      border
                      border-[#e2e9f1]
                      bg-[#fbfcfe]
                      pl-14
                      pr-5
                      text-base
                      font-semibold
                      text-slate-800
                      outline-none
                      placeholder:text-[#a0aec0]
                      focus:border-[#1174b5]
                      focus:bg-white
                      transition-all
                    "
                  />

                </div>

              </div>


              {/* Password */}
              <div>

                <div className="flex items-center justify-between mb-3">

                  <label
                    htmlFor="password"
                    className="
                      text-xs
                      font-black
                      tracking-wider
                      text-[#8da0bb]
                    "
                  >
                    PASSWORD
                  </label>

                  <button
                    type="button"
                    className="
                      text-xs
                      font-black
                      text-[#0871ad]
                      hover:text-[#005b91]
                      transition-colors
                    "
                  >
                    FORGOT PASSWORD?
                  </button>

                </div>

                <div className="relative">

                  <Lock
                    className="
                      absolute
                      left-5
                      top-1/2
                      -translate-y-1/2
                      w-5
                      h-5
                      text-[#91a5c0]
                    "
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="
                      w-full
                      h-[64px]
                      rounded-[17px]
                      border
                      border-[#e2e9f1]
                      bg-[#fbfcfe]
                      pl-14
                      pr-14
                      text-base
                      font-semibold
                      text-slate-800
                      outline-none
                      placeholder:text-[#a0aec0]
                      focus:border-[#1174b5]
                      focus:bg-white
                      transition-all
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-[#91a5c0]
                      hover:text-[#0871ad]
                      transition-colors
                    "
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>

              </div>


              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-[68px]
                  rounded-[17px]
                  bg-[#1174b5]
                  hover:bg-[#0d679f]
                  text-white
                  font-black
                  text-lg
                  flex
                  items-center
                  justify-center
                  gap-3
                  shadow-[0_12px_25px_rgba(17,116,181,0.25)]
                  hover:shadow-[0_15px_30px_rgba(17,116,181,0.32)]
                  transition-all
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                "
              >

                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Sign In Now</span>

                    <ArrowRight className="w-5 h-5" />
                  </>
                )}

              </button>

            </form>


            {/* Create Account */}
            <div className="mt-11 text-center">

              <p className="text-lg font-semibold text-[#687994]">

                New to Centennial?

                {' '}

                <Link
                  to="/signup"
                  className="
                    font-black
                    text-[#0871ad]
                    underline
                    underline-offset-4
                    decoration-2
                    hover:text-[#005b91]
                    transition-colors
                  "
                >
                  Create Account
                </Link>

              </p>

            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
};

export default Login;