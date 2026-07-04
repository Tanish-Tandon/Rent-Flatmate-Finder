import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Banknote, Calendar, PlusCircle, CheckCircle, Inbox, MessageCircle, Check, X, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    
    // 🔥 FIX: 100% Working Unsplash Direct URLs with proper formatting for beautiful placeholders
    const imgPool = [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492165-38c674167e41?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592595896551-363297a7384a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'
    ];
    
    // States
    const [activeTab, setActiveTab] = useState('listings'); 
    const [myListings, setMyListings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        location: '', rent: '', availableFrom: '', roomType: 'private', furnishingStatus: 'furnished', imageUrl: ''
    });

    const today = new Date().toISOString().split("T")[0];

    const fetchMyListings = useCallback(async () => {
        try {
            const res = await api.get('/listings/my-listings');
            setMyListings(res.data.data || []);
        } catch (error) {
            console.error("Failed to load listings:", error.message);
        }
    }, []);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await api.get('/matches/owner-requests');
            setRequests(res.data.data || []);
        } catch (error) {
            console.error("Failed to load requests:", error.message);
        }
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([fetchMyListings(), fetchRequests()]);
            } catch  {
                console.error("Failed to load dashboard data");
            }
        };
        loadInitialData();
    }, [fetchMyListings, fetchRequests]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

   const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/listings/create', formData);
            alert("✨ Room listed successfully!");
            
            // FORM RESET
            setFormData({ location: '', rent: '', availableFrom: '', roomType: 'private', furnishingStatus: 'furnished', imageUrl: '' });
            
            // REFRESH LISTINGS
            fetchMyListings(); 
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error creating listing");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsFilled = async (id) => {
        if (!window.confirm("Mark this room as filled? It will be hidden from new tenants.")) return;
        try {
            await api.patch(`/listings/${id}/fill`);
            fetchMyListings(); 
        } catch (error) {
            alert(`Error updating status: ${error.message}`);
        }
    };

    const handleRequestAction = async (matchId, status) => {
        try {
            await api.patch(`/matches/${matchId}/status`, { status });
            fetchRequests(); 
            alert(`Request ${status} successfully.`);
        } catch (error) {
            alert(`Action failed: ${error.message}`);
        }
    };




const maxDateObj = new Date();
maxDateObj.setFullYear(maxDateObj.getFullYear() + 2);
const maxDate = maxDateObj.toISOString().split('T')[0];



    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-white font-sans">
            {/* ✨ Premium Ambient Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e508_1px,transparent_1px),linear-gradient(to_bottom,#4f46e508_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px]"></div>

            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-10">
                
                {/* --- LEFT COLUMN: BEAUTIFUL FORM --- */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
                        
                        {/* Glow effect inside form */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <PlusCircle className="text-emerald-400 h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight">List a Room</h2>
                        </div>
                        
                        <form onSubmit={handleCreateSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 text-white border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600" placeholder="e.g. Indiranagar, Bangalore" />
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Monthly Rent (₹)</label>
                                <div className="relative group">
                                    <Banknote className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input type="number" name="rent" value={formData.rent} onChange={handleChange} required min="500" step="100" className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 text-white border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600" placeholder="15000" />
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Available From</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} required min={today} max={maxDate} className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 text-slate-300 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Image URL (Optional)</label>
                                <div className="relative group">
                                    <ImageIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 text-white border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600" placeholder="Paste image link here..." />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Type</label>
                                    <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-950/80 text-white border border-white/5 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none">
                                        <option value="private">Private</option>
                                        <option value="shared">Shared</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Furnishing</label>
                                    <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-950/80 text-white border border-white/5 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none">
                                        <option value="furnished">Furnished</option>
                                        <option value="unfurnished">Unfurnished</option>
                                    </select>
                                </div>
                            </div>
                            
                            <button type="submit" disabled={loading} className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1 flex justify-center items-center gap-2">
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Sparkles className="h-5 w-5" /> Publish Property</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: TABS & CARDS --- */}
                <div className="xl:col-span-2 space-y-8">
                    
                    {/* Modern Tabs */}
                    <div className="flex gap-4 p-1.5 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 w-max">
                        <button 
                            onClick={() => setActiveTab('listings')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'listings' ? 'bg-emerald-500/20 text-emerald-400 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Home size={18} /> My Properties
                        </button>
                        <button 
                            onClick={() => setActiveTab('requests')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 relative ${activeTab === 'requests' ? 'bg-indigo-500/20 text-indigo-400 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Inbox size={18} /> Tenant Requests
                            {requests.filter(r => r.status === 'pending').length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] text-white shadow-lg shadow-red-500/50 border border-slate-900 animate-bounce">
                                    {requests.filter(r => r.status === 'pending').length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === 'listings' ? (
                        myListings.length === 0 ? (
                            <div className="bg-slate-900/30 border border-white/5 p-16 rounded-[2rem] text-center text-slate-400 flex flex-col items-center">
                                <Home className="h-16 w-16 text-slate-700 mb-4" />
                                <p className="text-lg">Your portfolio is empty. List your first property!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {myListings.map((room, idx) => (
                                    <div key={room._id} className="group bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
                                        
                                        {/* Beautiful Image Section */}
                                       <div className="relative h-56 overflow-hidden bg-slate-800">
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80"></div>
                                            <img 
                                                src={room.imageUrl && room.imageUrl.startsWith('http') ? room.imageUrl : imgPool[idx % imgPool.length]} 
                                                alt="Property" 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.src = imgPool[idx % imgPool.length]; // Agar image link broken hai toh backup use karo
                                                }}
                                            />
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl backdrop-blur-md border ${room.isFilled ? 'bg-red-500/80 border-red-400/50 text-white' : 'bg-emerald-500/80 border-emerald-400/50 text-white'}`}>
                                                    {room.isFilled ? 'Filled' : 'Active'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-7 flex-1 flex flex-col relative z-20 -mt-6 bg-slate-900/90 backdrop-blur-2xl rounded-t-[2rem] border-t border-white/5">
                                            <h3 className="text-3xl font-extrabold mb-1 tracking-tight">₹{room.rent.toLocaleString()}<span className="text-base font-medium text-slate-500">/mo</span></h3>
                                            
                                            <div className="flex items-center gap-2 text-slate-300 mb-6 font-medium bg-slate-950/50 w-max px-3 py-1.5 rounded-lg border border-white/5 mt-2">
                                                <MapPin size={16} className="text-emerald-400"/> {room.location}
                                            </div>

                                            <div className="flex gap-2 mb-8">
                                                <span className="px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg capitalize">{room.roomType} Room</span>
                                                <span className="px-3 py-1 text-xs font-semibold text-slate-300 bg-slate-800 border border-white/5 rounded-lg capitalize">{room.furnishingStatus}</span>
                                            </div>

                                            <div className="mt-auto">
                                                {!room.isFilled ? (
                                                    <button onClick={() => handleMarkAsFilled(room._id)} className="w-full py-3.5 bg-slate-800 hover:bg-emerald-600 rounded-xl text-sm font-bold transition-colors duration-300 border border-white/5 group-hover:border-emerald-500/30 flex justify-center items-center gap-2">
                                                        <CheckCircle size={18} className="text-emerald-400 group-hover:text-white transition-colors" /> Mark as Filled
                                                    </button>
                                                ) : (
                                                    <div className="w-full py-3.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold border border-red-500/20 text-center">
                                                        Property Filled & Hidden
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        requests.length === 0 ? (
                            <div className="bg-slate-900/30 border border-white/5 p-16 rounded-[2rem] text-center text-slate-400 flex flex-col items-center">
                                <Inbox className="h-16 w-16 text-slate-700 mb-4" />
                                <p className="text-lg">No tenant requests right now.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.map(req => (
                                    <div key={req._id} className="p-6 rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-6">
                                        <div className="w-full sm:w-auto flex-1">
                                            <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                                <MapPin className="text-indigo-400 h-5 w-5" /> {req.listingId?.location} 
                                            </h4>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg shadow-indigo-500/25">
                                                    AI Score: {req.compatibilityScore}%
                                                </span>
                                            </div>
                                            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 relative">
                                                <Sparkles className="absolute top-4 right-4 h-4 w-4 text-slate-600" />
                                                <p className="text-sm text-slate-300 leading-relaxed pr-8">"{req.compatibilityExplanation}"</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleRequestAction(req._id, 'accepted')} className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5">
                                                        <Check size={18} /> Accept
                                                    </button>
                                                    <button onClick={() => handleRequestAction(req._id, 'declined')} className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-red-500/20 text-red-400 hover:text-red-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-white/5 hover:border-red-500/30">
                                                        <X size={18} /> Decline
                                                    </button>
                                                </>
                                            )}
                                            {req.status === 'accepted' && (
                                                <button onClick={() => navigate(`/chat/${req._id}`)} className="w-full px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5">
                                                    <MessageCircle size={18} /> Open Secure Chat
                                                </button>
                                            )}
                                            {req.status === 'declined' && (
                                                <span className="px-8 py-3 bg-slate-900 border border-white/5 text-slate-500 rounded-xl text-sm font-bold">Request Declined</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;