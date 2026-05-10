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
  const [selectedDate, setSelectedDate] = useState("");
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    start: "",
    end: "",
  });

  // Handle date click on calendar
  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setNewMeeting({ title: "", start: arg.dateStr + "T09:00", end: arg.dateStr + "T10:00" });
    setShowAddModal(true);
  };

  // Add new meeting/availability slot
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

  // Accept meeting request
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

  // Decline meeting request
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your availability and meetings
          </p>
        </div>
        <button
          onClick={() => { setNewMeeting({ title: "", start: "", end: "" }); setShowAddModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          + Add Availability Slot
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
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
          />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          {/* Meeting Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              📨 Meeting Requests
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {requests.filter((r) => r.status === "pending").length} pending
              </span>
            </h2>

            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                >
                  <p className="text-sm font-medium text-gray-800">{req.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">From: {req.from}</p>
                  <p className="text-xs text-gray-500">
                    📅 {req.date} at {req.time}
                  </p>

                  {req.status === "pending" ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1.5 rounded-md font-medium transition-colors"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => handleDecline(req.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 rounded-md font-medium transition-colors"
                      >
                        ✗ Decline
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`mt-2 inline-block text-xs px-2 py-1 rounded-full font-medium ${
                        req.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status === "accepted" ? "✓ Accepted" : "✗ Declined"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Confirmed Meetings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              ✅ Confirmed Meetings
            </h2>
            <div className="space-y-2">
              {meetings
                .filter((m) => m.status === "confirmed")
                .map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: m.color }}
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-800">{m.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(m.start).toLocaleDateString()} •{" "}
                        {new Date(m.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Availability Slot
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Available for investor calls"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  value={newMeeting.start}
                  onChange={(e) => setNewMeeting({ ...newMeeting, start: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  value={newMeeting.end}
                  onChange={(e) => setNewMeeting({ ...newMeeting, end: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAddMeeting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add to Calendar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}