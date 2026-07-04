import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Home,
  MessageSquare,
  Bed,
  
  Loader2,
  Calendar
} from "lucide-react";
import { io } from "socket.io-client";
import api from "../../api/axios";

const TenantDashboard = () => {
  const navigate = useNavigate();
const imagePool = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
  "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?w=900&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80",
];

  // ---------------- STATES ----------------
  const [listings, setListings] = useState([]);
  const [myMatches, setMyMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discovery");
  const [searchTerm, setSearchTerm] = useState("");

  // profile setup
  const [needsSetup, setNeedsSetup] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileData, setProfileData] = useState({
    preferredLocation: "",
    budget: "",
    moveInDate: "",
  });

  // ---------------- FETCH MATCHES ----------------
  const fetchMyMatches = useCallback(async () => {
    try {
      const response = await api.get("/matches/my-matches");
      setMyMatches(response.data.data || []);
    } catch (err) {
      console.log("Failed to fetch matches", err);
    }
  }, []);

  // ---------------- FETCH AI LISTINGS ----------------
  const fetchAIListings = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/matches");

      setListings(response.data.data || []);
      setNeedsSetup(false);
    } catch (err) {
      if (err.response?.status === 400) {
        setNeedsSetup(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------- SOCKET CONNECTION ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const socket = io("http://localhost:5001", {
      auth: { token },
    });

    socket.on("request_accepted", () => {
      fetchMyMatches();
    });

    return () => socket.disconnect();
  }, [fetchMyMatches]);

  // ---------------- INITIAL DATA ----------------
 useEffect(() => {
  const loadData = async () => {
    try {
      await fetchAIListings();
      await fetchMyMatches();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  loadData();
}, [fetchAIListings, fetchMyMatches]);

  // ---------------- SEARCH FILTER ----------------
const filteredListings = useMemo(() => {
  return listings.filter((room) =>
    room.listing?.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [listings, searchTerm]);

  // ---------------- PROFILE SUBMIT ----------------
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);

      // 🔥 FIX: Mapping frontend state to match backend schema perfectly
      const payload = {
        preferredLocation: profileData.preferredLocation,
        budgetRange: Number(profileData.budget), // Backend needs 'budgetRange'
        moveInDate: profileData.moveInDate
      };

      await api.put("/users/profile", payload);

      setNeedsSetup(false);
      fetchAIListings();
    } catch (err) {
      console.log(err);
      alert("Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };
    // ---------------- EXPRESS INTEREST ----------------
  const handleExpressInterest = async (listingId) => {
    try {
      await api.post("/matches/interest", {
        listingId,
      });

      alert("Interest sent successfully!");
    } catch (err) {
      console.log(err);
      alert("Unable to send interest.");
    }
  };

  // ---------------- PROFILE SETUP SCREEN ----------------
  if (needsSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 shadow-2xl">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white">
              Complete Your Profile
            </h1>

            <p className="text-slate-400 mt-3">
              Tell us your preferences and our AI will recommend the best
              properties for you.
            </p>
          </div>

          <form
            onSubmit={handleProfileSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Preferred Location
              </label>

              <input
                type="text"
                placeholder="Delhi, Noida, Gurgaon..."
                value={profileData.preferredLocation}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    preferredLocation: e.target.value,
                  })
                }
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-slate-950
                  border border-slate-800
                  text-white
                  outline-none
                  focus:border-indigo-500
                "
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Monthly Budget
              </label>

              <input
                type="number"
                placeholder="15000"
                value={profileData.budget}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    budget: e.target.value,
                  })
                }
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-slate-950
                  border border-slate-800
                  text-white
                  outline-none
                  focus:border-indigo-500
                "
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Move In Date
              </label>

              <input
                type="date"
                value={profileData.moveInDate}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    moveInDate: e.target.value,
                  })
                }
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-slate-950
                  border border-slate-800
                  text-slate-300
                  outline-none
                  focus:border-indigo-500
                "
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="
                w-full
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-indigo-500
                to-purple-600
                font-bold
                text-white
                hover:scale-[1.02]
                transition-all
                disabled:opacity-60
                flex
                items-center
                justify-center
                gap-3
              "
            >
              {savingProfile ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={20}
                  />
                  Saving...
                </>
              ) : (
                "Start Exploring"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------- MAIN DASHBOARD ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Discover Rooms
            </h1>

            <p className="text-slate-400 mt-3">
              Personalized recommendations powered by AI.
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type="text"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                bg-slate-900
                border border-slate-800
                py-4
                pl-12
                pr-4
                outline-none
                focus:border-indigo-500
              "
            />
          </div>
        </div>

                {/* Tabs */}
        <div className="inline-flex bg-slate-900 p-2 rounded-2xl mb-10">
          <button
            onClick={() => setActiveTab("discovery")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "discovery"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                : "text-slate-400"
            }`}
          >
            Discovery
          </button>

          <button
            onClick={() => setActiveTab("chats")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "chats"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                : "text-slate-400"
            }`}
          >
            My Matches
          </button>
        </div>

        {activeTab === "discovery" ? (
          <>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-96
                      rounded-3xl
                      bg-slate-900
                      animate-pulse
                    "
                  />
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-24">
                <Home
                  size={80}
                  className="mx-auto text-slate-700 mb-6"
                />

                <h2 className="text-3xl font-bold mb-3">
                  No Rooms Found
                </h2>

                <p className="text-slate-400">
                  Try changing your search or preferences.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredListings.map((room, index) => (
                  <div
                    key={room._id}
                    className="
                      group
                      overflow-hidden
                      rounded-[32px]
                      bg-white/5
                      backdrop-blur-xl
                      border border-white/10
                      hover:border-indigo-500/50
                      transition-all
                      duration-500
                      hover:-translate-y-2
                    "
                  >
                    <div className="relative h-64 overflow-hidden">
                    <img
  src={imagePool[index % imagePool.length]}
  alt="Property"
  className="w-full h-full object-cover"
/>

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      <div className="absolute top-5 right-5">
                        <div className="bg-indigo-500/20 backdrop-blur-lg px-4 py-2 rounded-full border border-indigo-500/30 text-sm">
                          {room.listing.roomType || "Private"}
                        </div>
                      </div>

                      <div className="absolute bottom-5 left-5">
                        <h2 className="text-3xl font-black">
                          ₹
                          {room.listing.rent.toLocaleString()}
                        </h2>

                        <p className="flex items-center gap-2 text-slate-300 mt-1">
                          <MapPin size={16} />
                          {room.listing.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between mb-6 text-slate-400 text-sm">
                        <span className="flex items-center gap-2">
                          <Bed size={16} />
                          {room.listing.furnishingStatus ||
                            "Furnished"}
                        </span>

                     <div className="flex justify-between mb-6 text-slate-400 text-sm">
  <span className="flex items-center gap-2 capitalize">
    <Bed size={16} />
    {room.listing.furnishingStatus || "Furnished"}
  </span>


  <span className="flex items-center gap-2">
    <Calendar size={16} />
    {room.listing.availableFrom 
      ? new Date(room.listing.availableFrom).toLocaleDateString('en-IN') 
      : "Ready to move"}
  </span>
</div>



                      </div>

                      <button
                        onClick={() =>
                          handleExpressInterest(
                            room.listing._id
                          )
                        }
                        className="
                          w-full
                          py-4
                          rounded-2xl
                          bg-gradient-to-r
                          from-indigo-500
                          to-purple-600
                          font-bold
                          hover:scale-[1.03]
                          transition-all
                          shadow-lg
                          shadow-indigo-500/20
                        "
                      >
                        Send Interest
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-5">
            {myMatches.length === 0 ? (
              <div className="text-center py-24">
                <MessageSquare
                  size={80}
                  className="mx-auto text-slate-700 mb-5"
                />

                <h2 className="text-3xl font-bold mb-3">
                  No Matches Yet
                </h2>

                <p className="text-slate-400">
                  Send interests to property owners and wait
                  for approval.
                </p>
              </div>
            ) : (
              myMatches.map((match) => (
                <div
                  key={match._id}
                  className="
                    bg-slate-900/70
                    backdrop-blur-lg
                    rounded-3xl
                    border border-white/10
                    p-6
                    flex
                    justify-between
                    items-center
                    hover:border-indigo-500/50
                    transition-all
                  "
                >
                  <div className="flex items-center gap-5">
                    <div
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-indigo-500/20
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Home className="text-indigo-400" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold">
                        {match.listing.location}
                      </h3>

                      <p
                        className={`mt-1 ${
                          match.status === "accepted"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {match.status.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {match.status === "accepted" && (
                    <button
                      onClick={() =>
                        navigate(`/chat/${match._id}`)
                      }
                      className="
                        px-6
                        py-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-emerald-500
                        to-green-600
                        font-bold
                        flex
                        items-center
                        gap-2
                        hover:scale-105
                        transition-all
                      "
                    >
                      <MessageSquare size={18} />
                      Chat
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;