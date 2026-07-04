import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Home, Key, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'tenant'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Simple helper to check password quality
    const getStrengthLabel = (pass) => {
        if (!pass) return "";
        if (pass.length < 6) return "Weak";
        if (pass.length < 10) return "Medium";
        return "Strong";
    };

    const getStrengthColor = (pass) => {
        if (!pass) return "";
        if (pass.length < 6) return "text-red-400";
        if (pass.length < 10) return "text-amber-400";
        return "text-emerald-400";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        
      
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address (e.g., name@example.com)');
            return; 
        }
     

        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/40 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            <div className="max-w-md w-full space-y-8 bg-slate-900/40 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 transition-all duration-500 hover:shadow-[0_0_50px_rgba(79,70,229,0.15)]">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
                    <p className="mt-2 text-sm text-indigo-200/60">Join the smart way to rent and connect.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl">
                        <p className="text-sm text-red-400 font-medium text-center">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'tenant' })}
                            className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all duration-300 ${
                                formData.role === 'tenant' 
                                ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] backdrop-blur-md' 
                                : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
                            }`}
                        >
                            <Key size={24} className="mb-2" />
                            <span className="font-semibold text-sm">Tenant</span>
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'owner' })}
                            className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all duration-300 ${
                                formData.role === 'owner' 
                                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md' 
                                : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
                            }`}
                        >
                            <Home size={24} className="mb-2" />
                            <span className="font-semibold text-sm">Owner</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-sm"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-sm"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full pl-12 pr-12 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-sm"
                                placeholder="Secure Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {/* Password strength indicator */}
                        {formData.password && (
                            <div className="text-xs mt-2 ml-1 font-medium">
                                Strength: 
                                <span className={getStrengthColor(formData.password) + " ml-1"}>
                                    {getStrengthLabel(formData.password)}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] disabled:opacity-50 border border-indigo-400/30"
                    >
                        {loading ? 'Creating Identity...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-400">
                        Already registered?{' '}
                        <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]">
                            Access your account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;