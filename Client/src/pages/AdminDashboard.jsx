import  { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0, activeListings: 0 });
    const [users, setUsers] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [statsRes, usersRes, listingsRes] = await Promise.all([
        axios.get("/api/admin/stats", config),
        axios.get("/api/admin/users", config),
        axios.get("/api/admin/listings", config),
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setListings(listingsRes.data.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  
    useEffect(() => {
        // Defer fetchData to avoid synchronous setState within effect which can
        // trigger cascading renders. Use a timeout to run after the current
        // render cycle.
        const t = setTimeout(() => {
            fetchData();
        }, 0);

        return () => clearTimeout(t);
    }, []);




    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/${type}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData(); // Refresh list after delete
        } catch {
            alert(`Failed to delete ${type}`);
        }
    };

    if (loading) return <div className="text-center pt-20 text-indigo-400">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pt-24">
            <h1 className="text-3xl font-bold mb-8 text-white">Platform Admin Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-slate-400">Total Users</h3>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-slate-400">Total Listings</h3>
                    <p className="text-3xl font-bold text-white">{stats.totalListings}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-slate-400">Active Listings</h3>
                    <p className="text-3xl font-bold text-green-400">{stats.activeListings}</p>
                </div>
            </div>

            {/* Users Table */}
            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800 text-slate-400">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b border-slate-800">
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4 uppercase text-xs font-bold text-indigo-400">{user.role}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleDelete('users', user._id)} className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Listings Table */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Manage Listings</h2>
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800 text-slate-400">
                            <tr>
                                <th className="p-4">Location</th>
                                <th className="p-4">Rent</th>
                                <th className="p-4">Owner</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listings.map(listing => (
                                <tr key={listing._id} className="border-b border-slate-800">
                                    <td className="p-4">{listing.location}</td>
                                    <td className="p-4">₹{listing.rent}</td>
                                    <td className="p-4">{listing.owner?.name || 'N/A'}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleDelete('listings', listing._id)} className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;