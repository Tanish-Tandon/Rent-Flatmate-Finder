import { useState, useEffect } from 'react';
import { Users, Home, ShieldCheck, Activity, Loader2 } from 'lucide-react'; 
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // PRO FIX: Defining the async function INSIDE the useEffect.
        // This perfectly satisfies React's strict linting rules and prevents any dependency warnings.
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats({
                    totalUsers: res.data.data.totalUsers || 0,
                    totalListings: res.data.data.totalListings || 0
                });
            } catch (error) {
                console.error("Error loading admin stats:", error.message);
            } finally {
                setLoading(false);
            }
        };

        // Calling the function right after defining it
        fetchStats();
    }, []); // Empty dependency array means it only runs once

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-500">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-10">
                    <ShieldCheck className="text-indigo-500 h-10 w-10" />
                    <h1 className="text-4xl font-extrabold tracking-tight">System Control Center</h1>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Users</p>
                            <h2 className="text-4xl font-bold mt-2">{stats.totalUsers}</h2>
                        </div>
                        <Users className="h-12 w-12 text-indigo-500/50" />
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Listings</p>
                            <h2 className="text-4xl font-bold mt-2">{stats.totalListings}</h2>
                        </div>
                        <Home className="h-12 w-12 text-emerald-500/50" />
                    </div>
                </div>

                {/* Management Section placeholder */}
                <div className="bg-slate-900/30 border border-white/5 p-10 rounded-3xl text-center">
                    <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 italic">Advanced management tools are active. Users and Listings data will populate here.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;