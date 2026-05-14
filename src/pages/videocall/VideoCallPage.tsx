import { useState, useRef, useEffect } from "react";
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  Users, MessageSquare, PhoneOff, Send, Phone
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

export default function VideoCallPage() {
  const [callActive, setCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "Sara Khan", text: "Looking forward to this meeting!", time: "2:00 PM" },
    { id: 2, sender: "You", text: "Me too! Let's discuss the investment.", time: "2:01 PM" },
  ]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const participants: Participant[] = [
    { id: "1", name: "You", role: "Entrepreneur", avatar: "R", isMuted, isVideoOff },
    { id: "2", name: "Sara Khan", role: "Investor", avatar: "S", isMuted: false, isVideoOff: false },
    { id: "3", name: "Ali Hassan", role: "Entrepreneur", avatar: "A", isMuted: true, isVideoOff: false },
  ];

  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "You", text: message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Video Call</h1>
          <p className="text-sm text-gray-500 mt-1">Connect with investors and entrepreneurs</p>
        </div>
        {callActive && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-600 font-medium text-xs md:text-sm">Live • {formatTime(callDuration)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Main Video Area */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-2xl overflow-hidden" style={{ minHeight: "300px" }}>
            {!callActive ? (
              <div className="flex flex-col items-center justify-center h-full py-12 md:py-20">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold mb-4 md:mb-6">R</div>
                <h2 className="text-white text-xl md:text-2xl font-semibold mb-2">Ready to Join?</h2>
                <p className="text-gray-400 text-sm mb-6 md:mb-8 text-center px-4">Business Review Meeting • 3 participants</p>
                <div className="flex gap-4 mb-6 md:mb-8">
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-3 md:p-4 rounded-full text-white transition-colors ${isMuted ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"}`}>
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 md:p-4 rounded-full text-white transition-colors ${isVideoOff ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"}`}>
                    {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                  </button>
                </div>
                <button onClick={() => setCallActive(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 md:px-10 py-2.5 md:py-3 rounded-full font-semibold text-base md:text-lg transition-colors">
                  <Phone size={18} /> Join Call
                </button>
              </div>
            ) : (
              <div className="relative" style={{ minHeight: "300px" }}>
                <div className="w-full bg-gray-800 flex items-center justify-center" style={{ minHeight: "300px" }}>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 md:w-32 md:h-32 bg-blue-700 rounded-full flex items-center justify-center text-white text-3xl md:text-5xl font-bold mb-3 md:mb-4">S</div>
                    <p className="text-white text-lg md:text-xl font-medium">Sara Khan</p>
                    <p className="text-gray-400 text-sm">Investor</p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 w-24 h-16 md:w-36 md:h-24 bg-gray-700 rounded-xl flex items-center justify-center border-2 border-gray-600">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 md:w-10 md:h-10 ${isVideoOff ? "bg-blue-600" : "bg-green-600"} rounded-full flex items-center justify-center text-white font-bold text-sm`}>R</div>
                    <p className="text-white text-xs mt-1">{isVideoOff ? "You" : "You (Live)"}</p>
                  </div>
                </div>

                {isScreenSharing && (
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Monitor size={10} /> Screen Sharing
                  </div>
                )}

                {/* Call Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 md:p-6">
                  <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                    <button onClick={() => setIsMuted(!isMuted)} className={`p-3 md:p-4 rounded-full text-white transition-all ${isMuted ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"}`}>
                      {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 md:p-4 rounded-full text-white transition-all ${isVideoOff ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"}`}>
                      {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                    </button>
                    <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-3 md:p-4 rounded-full text-white transition-all ${isScreenSharing ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"}`}>
                      {isScreenSharing ? <MonitorOff size={18} /> : <Monitor size={18} />}
                    </button>
                    <button onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }} className={`p-3 md:p-4 rounded-full text-white transition-all ${showParticipants ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"}`}>
                      <Users size={18} />
                    </button>
                    <button onClick={() => { setShowChat(!showChat); setShowParticipants(false); }} className={`p-3 md:p-4 rounded-full text-white transition-all ${showChat ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"}`}>
                      <MessageSquare size={18} />
                    </button>
                    <button onClick={() => { setCallActive(false); setIsScreenSharing(false); }} className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-3 md:py-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all font-medium text-sm">
                      <PhoneOff size={18} /> End
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {callActive && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {participants.map((p) => (
                <div key={p.id} className="flex-shrink-0 bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 min-w-40 md:min-w-48">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{p.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.role}</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {p.isMuted && <MicOff size={12} className="text-red-400" />}
                    {p.isVideoOff && <VideoOff size={12} className="text-red-400" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="xl:col-span-1">
          {showParticipants && callActive && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                <Users size={16} className="text-blue-600" /> Participants ({participants.length})
              </h3>
              <div className="space-y-3">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{p.avatar}</div>
                    <div><p className="text-sm font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-500">{p.role}</p></div>
                    <div className="ml-auto flex gap-1">
                      {p.isMuted && <MicOff size={12} className="text-red-400" />}
                      {p.isVideoOff && <VideoOff size={12} className="text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showChat && callActive && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col" style={{ height: "350px" }}>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <MessageSquare size={16} className="text-blue-600" /> In-Call Chat
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                    <p className="text-xs text-gray-500 mb-1">{msg.sender} • {msg.time}</p>
                    <div className={`px-3 py-2 rounded-xl text-sm max-w-full ${msg.sender === "You" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}>{msg.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Type a message..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"><Send size={16} /></button>
              </div>
            </div>
          )}

          {!callActive && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                <Users size={16} className="text-blue-600" /> Meeting Info
              </h3>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs text-gray-500">Meeting</p><p className="text-sm font-medium text-gray-900">Business Review Meeting</p></div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">Participants</p>
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 md:w-7 md:h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{p.avatar}</div>
                      <div><p className="text-xs font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-500">{p.role}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}