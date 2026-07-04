import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from "../context/AuthContext";
import { Send, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import api from "../api/axios";

const ChatWindow = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const newSocket = io('http://localhost:5001', {
            auth: { token }
        });

        socketRef.current = newSocket;

        const fetchChatHistory = async () => {
            try {
                const res = await api.get(`/chat/${matchId}`);
                setMessages(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch chat history:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChatHistory();

        newSocket.emit('join_room', matchId);

        // Listen for new messages from server
        newSocket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [matchId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;

        const messageData = {
            matchId: matchId,
            senderId: user.id,
            text: newMessage,
            createdAt: new Date().toISOString()
        };

        // Emit to server. We do NOT update state here to avoid duplicates.
        socketRef.current.emit('send_message', messageData);
        setNewMessage('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-indigo-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="font-medium tracking-wide">Securing connection...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-6 px-4 sm:px-6 flex justify-center">
            <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
                
                <div className="bg-slate-900/80 border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                Secure Chat 
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === user.id || msg.sender === user.id;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-lg ${
                                    isMe 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-slate-800 border border-white/5 text-slate-200 rounded-bl-none'
                                }`}>
                                    <p className="text-sm md:text-base leading-relaxed break-words">{msg.text}</p>
                                    <p className={`text-[10px] mt-2 font-medium ${isMe ? 'text-indigo-200 text-right' : 'text-slate-400 text-left'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-slate-900/80 border-t border-white/10 backdrop-blur-md">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-full pl-6 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full"
                        >
                            <Send className="h-5 w-5 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;

