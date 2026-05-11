import { useState, useRef, useEffect } from "react";

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
    { id: "1", name: "You", role: "Entrepreneur", avatar: "R", isMuted: isMuted, isVideoOff: isVideoOff },
    { id: "2", name: "Sara Khan", role: "Investor", avatar: "S", isMuted: false, isVideoOff: false },
    { id: "3", name: "Ali Hassan", role: "Entrepreneur", avatar: "A", isMuted: true, isVideoOff: false },
  ];

  // Timer for call duration
  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: "You",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>
          <p className="text-sm text-gray-500 mt-1">Connect with investors and entrepreneurs</p>
        </div>
        {callActive && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-600 font-medium text-sm">Live • {formatTime(callDuration)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Video Area */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {/* Video Grid */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden" style={{ minHeight: "400px" }}>
            {!callActive ? (
              // Pre-call screen
              <div className="flex flex-col items-center justify-center h-full py-20">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6">
                  R
                </div>
                <h2 className="text-white text-2xl font-semibold mb-2">Ready to Join?</h2>
                <p className="text-gray-400 text-sm mb-8">Business Review Meeting • 3 participants</p>
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full text-white transition-colors ${isMuted ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"}`}
                  >
                    {isMuted ? "🔇" : "🎤"}
                  </button>
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-full text-white transition-colors ${isVideoOff ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"}`}
                  >
                    {isVideoOff ? "📵" : "📹"}
                  </button>
                </div>
                <button
                  onClick={() => setCallActive(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-10 py-3 rounded-full font-semibold text-lg transition-colors"
                >
                  Join Call
                </button>
              </div>
            ) : (
              // Active call screen
              <div className="relative h-full" style={{ minHeight: "400px" }}>
                {/* Main video (other participant) */}
                <div className="w-full h-full bg-gray-800 flex items-center justify-center" style={{ minHeight: "400px" }}>
                  {/* Simulated video feed */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-blue-700 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4">
                      S
                    </div>
                    <p className="text-white text-xl font-medium">Sara Khan</p>
                    <p className="text-gray-400 text-sm">Investor</p>
                  </div>
                </div>

                {/* Your video (picture-in-picture) */}
                <div className="absolute top-4 right-4 w-36 h-24 bg-gray-700 rounded-xl flex items-center justify-center border-2 border-gray-600">
                  {isVideoOff ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">R</div>
                      <p className="text-white text-xs mt-1">You</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">R</div>
                      <p className="text-white text-xs mt-1">You (Live)</p>
                    </div>
                  )}
                </div>

                {/* Screen share indicator */}
                {isScreenSharing && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    🖥️ Screen Sharing
                  </div>
                )}

                {/* Call Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <div className="flex items-center justify-center gap-4">
                    {/* Mute */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-4 rounded-full text-white transition-all ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"}`}
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? "🔇" : "🎤"}
                    </button>

                    {/* Video */}
                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`p-4 rounded-full text-white transition-all ${isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"}`}
                      title={isVideoOff ? "Turn on video" : "Turn off video"}
                    >
                      {isVideoOff ? "📵" : "📹"}
                    </button>

                    {/* Screen Share */}
                    <button
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={`p-4 rounded-full text-white transition-all ${isScreenSharing ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                      title="Share Screen"
                    >
                      🖥️
                    </button>

                    {/* Participants */}
                    <button
                      onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
                      className={`p-4 rounded-full text-white transition-all ${showParticipants ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"}`}
                      title="Participants"
                    >
                      👥
                    </button>

                    {/* Chat */}
                    <button
                      onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
                      className={`p-4 rounded-full text-white transition-all ${showChat ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"}`}
                      title="Chat"
                    >
                      💬
                    </button>

                    {/* End Call */}
                    <button
                      onClick={() => { setCallActive(false); setIsScreenSharing(false); }}
                      className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all px-8"
                      title="End Call"
                    >
                      📵 End
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Participants strip (when call active) */}
          {callActive && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {participants.map((p) => (
                <div key={p.id} className="flex-shrink-0 bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 min-w-48">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {p.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.role}</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {p.isMuted && <span className="text-xs">🔇</span>}
                    {p.isVideoOff && <span className="text-xs">📵</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel — Participants or Chat */}
        <div className="xl:col-span-1">
          {/* Participants Panel */}
          {showParticipants && callActive && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">👥 Participants ({participants.length})</h3>
              <div className="space-y-3">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {p.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role}</p>
                    </div>
                    <div className="ml-auto text-xs flex gap-1">
                      {p.isMuted && "🔇"}
                      {p.isVideoOff && "📵"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Panel */}
          {showChat && callActive && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col" style={{ height: "400px" }}>
              <h3 className="font-semibold text-gray-900 mb-3">💬 In-Call Chat</h3>
              <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                    <p className="text-xs text-gray-500 mb-1">{msg.sender} • {msg.time}</p>
                    <div className={`px-3 py-2 rounded-xl text-sm max-w-full ${msg.sender === "You" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  ➤
                </button>
              </div>
            </div>
          )}

          {/* Pre-call info */}
          {!callActive && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📋 Meeting Info</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Meeting</p>
                  <p className="text-sm font-medium text-gray-900">Business Review Meeting</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">Participants</p>
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {p.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.role}</p>
                      </div>
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