import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const successMessage = location.state?.message;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            login(response.data.user, response.data.token);
            
            if (response.data.user.role === 'owner') {
                navigate('/owner-dashboard');
            } else if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/tenant-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* --- CRAZY BACKGROUND START --- */}
            {/* High-Tech AI Blueprint Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* Breathing Glowing Orbs (Login gets slightly different colors) */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/40 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-800/50 rounded-full mix-blend-screen filter blur-[150px]"></div>
            {/* --- CRAZY BACKGROUND END --- */}

            {/* Ultra-Premium Frosted Glass Card */}
            <div className="max-w-md w-full space-y-8 bg-slate-900/40 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-sm text-emerald-200/60">Securely login to your dashboard.</p>
                </div>

                {successMessage && (
                    <div className="bg-emerald-500/10 border border-emerald-500/50 p-4 rounded-xl">
                        <p className="text-sm text-emerald-400 font-medium text-center">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl">
                        <p className="text-sm text-red-400 font-medium text-center">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-sm"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full pl-12 pr-12 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-sm"
                                placeholder="Password"
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] disabled:opacity-50 border border-emerald-400/30"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-400">
                        New to the platform?{' '}
                        <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;