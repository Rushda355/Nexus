import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Meeting {
  id: string;
  title: string;
  start: string;
  end: string;
  status: "confirmed" | "pending" | "declined";
  color?: string;
}

interface MeetingRequest {
  id: string;
  from: string;
  title: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "declined";
}

const initialMeetings: Meeting[] = [
  {
    id: "1",
    title: "Investor Call - Ahmed Capital",
    start: new Date().toISOString().split("T")[0] + "T10:00:00",
    end: new Date().toISOString().split("T")[0] + "T11:00:00",
    status: "confirmed",
    color: "#2563eb",
  },
  {
    id: "2",
    title: "Pitch Meeting - TechVentures",
    start: new Date().toISOString().split("T")[0] + "T14:00:00",
    end: new Date().toISOString().split("T")[0] + "T15:00:00",
    status: "confirmed",
    color: "#16a34a",
  },
];

const initialRequests: MeetingRequest[] = [
  {
    id: "r1",
    from: "Sara Khan (Investor)",
    title: "Business Review Meeting",
    date: "2026-05-12",
    time: "11:00 AM",
    status: "pending",
  },
  {
    id: "r2",
    from: "Ali Hassan (Entrepreneur)",
    title: "Partnership Discussion",
    date: "2026-05-13",
    time: "3:00 PM",
    status: "pending",
  },
];

export default function CalendarPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [requests, setRequests] = useState<MeetingRequest[]>(initialRequests);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: "", start: "", end: "" });

  const handleDateClick = (arg: { dateStr: string }) => {
    setNewMeeting({ title: "", start: arg.dateStr + "T09:00", end: arg.dateStr + "T10:00" });
    setShowAddModal(true);
  };

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.start) return;
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      start: newMeeting.start,
      end: newMeeting.end,
      status: "confirmed",
      color: "#2563eb",
    };
    setMeetings([...meetings, meeting]);
    setShowAddModal(false);
  };

  const handleAccept = (id: string) => {
    const req = requests.find((r) => r.id === id);
    if (req) {
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: req.title + " (with " + req.from + ")",
        start: req.date + "T09:00:00",
        end: req.date + "T10:00:00",
        status: "confirmed",
        color: "#16a34a",
      };
      setMeetings([...meetings, meeting]);
    }
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)));
  };

  const handleDecline = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "declined" } : r)));
  };

  const calendarEvents = meetings.map((m) => ({
    id: m.id,
    title: m.title,
    start: m.start,
    end: m.end,
    backgroundColor: m.color,
    borderColor: m.color,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-5 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Meeting Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your availability and meetings</p>
        </div>
        <button
          onClick={() => { setNewMeeting({ title: "", start: "", end: "" }); setShowAddModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Availability Slot
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-5 md:gap-6">
        {/* Calendar - Full width on mobile, takes 2/3 on desktop */}
        <div className="xl:flex-[2] bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 overflow-x-auto">
          <div className="min-w-[300px]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              dateClick={handleDateClick}
              editable={true}
              selectable={true}
              height="auto"
              contentHeight="auto"
              aspectRatio={1.35}
              titleFormat={{ year: 'numeric', month: 'short' }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day'
              }}
              /* Mobile responsive view settings */
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'short' },
                  columnHeaderFormat: { weekday: 'short' },
                },
                timeGridWeek: {
                  titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
                  columnHeaderFormat: { weekday: 'short' },
                },
                timeGridDay: {
                  titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
                }
              }}
            />
          </div>
        </div>

        {/* Right Panel - Full width on mobile, takes 1/3 on desktop */}
        <div className="xl:flex-1 flex flex-col gap-5">
          {/* Meeting Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              Meeting Requests
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {requests.filter((r) => r.status === "pending").length} pending
              </span>
            </h2>
            <div className="space-y-3 max-h-[320px] overflow-y-auto">
              {requests.map((req) => (
                <div key={req.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{req.title}</p>
                  <p className="text-xs text-gray-500 mt-1">From: {req.from}</p>
                  <p className="text-xs text-gray-500">{req.date} at {req.time}</p>
                  {req.status === "pending" ? (
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => handleAccept(req.id)} 
                        className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm py-2 rounded-lg font-medium transition-colors"
                      >
                        ✓ Accept
                      </button>
                      <button 
                        onClick={() => handleDecline(req.id)} 
                        className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm py-2 rounded-lg font-medium transition-colors"
                      >
                        ✗ Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-medium ${req.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {req.status === "accepted" ? "Accepted" : "Declined"}
                    </span>
                  )}
                </div>
              ))}
              {requests.filter(r => r.status === "pending").length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No pending requests
                </div>
              )}
            </div>
          </div>

          {/* Confirmed Meetings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Confirmed Meetings</h2>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {meetings.filter((m) => m.status === "confirmed").map((m) => (
                <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: m.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{m.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 break-words">
                      {new Date(m.start).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(m.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {meetings.filter(m => m.status === "confirmed").length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No confirmed meetings
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Meeting Modal - Mobile optimized */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md sm:mx-4 animate-in slide-in-from-bottom sm:slide-in-from-top duration-200">
            <div className="p-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Add Availability Slot</h3>
              <p className="text-xs text-gray-500 mt-0.5">Set a time when you're available</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Meeting Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Available for investor calls" 
                  value={newMeeting.title} 
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })} 
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <input 
                  type="datetime-local" 
                  value={newMeeting.start} 
                  onChange={(e) => setNewMeeting({ ...newMeeting, start: e.target.value })} 
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <input 
                  type="datetime-local" 
                  value={newMeeting.end} 
                  onChange={(e) => setNewMeeting({ ...newMeeting, end: e.target.value })} 
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button 
                onClick={handleAddMeeting} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Add to Calendar
              </button>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="flex-1 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
            {/* Safe area spacer for mobile notch */}
            <div className="h-1 sm:h-0" />
          </div>
        </div>
      )}

      <style>{`
        /* FullCalendar mobile optimizations */
        @media (max-width: 768px) {
          .fc .fc-toolbar {
            flex-direction: column;
            gap: 12px;
            align-items: stretch !important;
          }
          .fc .fc-toolbar-title {
            font-size: 1.2rem !important;
            padding: 4px 0;
            text-align: center;
          }
          .fc .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }
          .fc .fc-button-group {
            gap: 4px;
          }
          .fc .fc-button {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
          .fc .fc-daygrid-day-number {
            font-size: 12px !important;
            padding: 4px !important;
          }
          .fc .fc-daygrid-day-top {
            justify-content: center;
          }
          .fc .fc-daygrid-day-events {
            min-height: 20px;
          }
          .fc .fc-daygrid-event {
            font-size: 9px !important;
            padding: 2px 3px !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .fc .fc-col-header-cell-cushion {
            font-size: 11px !important;
            padding: 6px 2px !important;
          }
          .fc .fc-timegrid-slot-label {
            font-size: 10px !important;
          }
          .fc .fc-timegrid-event {
            font-size: 10px !important;
          }
        }

        /* Animation for modal */
        @keyframes slide-in-from-bottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slide-in-from-top {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-in {
          animation: slide-in-from-bottom 0.2s ease-out;
        }
        @media (min-width: 640px) {
          .animate-in {
            animation: slide-in-from-top 0.2s ease-out;
          }
        }
      `}</style>
    </div>
  );
}