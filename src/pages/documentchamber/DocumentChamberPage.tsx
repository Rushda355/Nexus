import { useState, useRef } from "react";
import {
  Upload, FileText, FolderOpen, Trash2, PenLine,
  CheckCircle, Clock, FileEdit, X, ChevronDown, Menu
} from "lucide-react";

type DocStatus = "Draft" | "In Review" | "Signed";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: DocStatus;
  uploadedAt: string;
  signedBy?: string;
}

const initialDocuments: Document[] = [
  {
    id: "1",
    name: "Investment_Agreement_2026.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "In Review",
    uploadedAt: "2026-05-08",
  },
  {
    id: "2",
    name: "Term_Sheet_SeriesA.pdf",
    type: "PDF",
    size: "1.1 MB",
    status: "Signed",
    uploadedAt: "2026-05-05",
    signedBy: "Sara Khan & John Smith",
  },
  {
    id: "3",
    name: "NDA_Contract.pdf",
    type: "PDF",
    size: "0.8 MB",
    status: "Draft",
    uploadedAt: "2026-05-10",
  },
];

const statusColors: Record<DocStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  "In Review": "bg-yellow-100 text-yellow-700",
  Signed: "bg-green-100 text-green-700",
};

const statusIcons: Record<DocStatus, React.ReactNode> = {
  Draft: <FileEdit size={12} />,
  "In Review": <Clock size={12} />,
  Signed: <CheckCircle size={12} />,
};

export default function DocumentChamberPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [filterStatus, setFilterStatus] = useState<DocStatus | "All">("All");
  const [dragOver, setDragOver] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.endsWith(".pdf") ? "PDF" : "DOC",
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        status: "Draft",
        uploadedAt: new Date().toISOString().split("T")[0],
      };
      setDocuments((prev) => [newDoc, ...prev]);
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPos.current) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1e40af";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = { x, y };
    setHasSigned(true);
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSign = () => {
    if (!selectedDoc || !signerName.trim() || !hasSigned) return;
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDoc.id
          ? { ...doc, status: "Signed", signedBy: signerName }
          : doc
      )
    );
    setShowSignModal(false);
    setSelectedDoc(null);
    setSignerName("");
    setHasSigned(false);
    clearCanvas();
  };

  const handleStatusChange = (id: string, status: DocStatus) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
    );
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const filteredDocs =
    filterStatus === "All"
      ? documents
      : documents.filter((d) => d.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-5 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderOpen size={18} className="text-white md:w-5 md:h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Document Chamber</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">Manage deals, contracts and agreements</p>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <Upload size={16} /> Upload Document
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {/* Stats Row - Responsive */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
        {([
          { status: "Draft" as DocStatus, icon: <FileEdit size={18} className="text-gray-600 md:w-5 md:h-5" />, bg: "bg-gray-100" },
          { status: "In Review" as DocStatus, icon: <Clock size={18} className="text-yellow-600 md:w-5 md:h-5" />, bg: "bg-yellow-100" },
          { status: "Signed" as DocStatus, icon: <CheckCircle size={18} className="text-green-600 md:w-5 md:h-5" />, bg: "bg-green-100" },
        ]).map(({ status, icon, bg }) => (
          <div key={status} className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className={`w-8 h-8 md:w-10 md:h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {documents.filter((d) => d.status === status).length}
              </p>
              <p className="text-xs md:text-sm text-gray-500">{status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-5 md:gap-6">
        {/* Document List - Full width on mobile */}
        <div className="lg:flex-[2] flex flex-col gap-4">
          {/* Drag & Drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
            className={`border-2 border-dashed rounded-xl p-4 md:p-6 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
            }`}
          >
            <div className="flex justify-center mb-2">
              <Upload size={24} className={dragOver ? "text-blue-500" : "text-gray-400 md:w-7 md:h-7"} />
            </div>
            <p className="text-sm font-medium text-gray-700">Drag & drop files here</p>
            <p className="text-xs text-gray-500 mt-1">Supports PDF, DOC, DOCX</p>
          </div>

          {/* Filter Tabs - Scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["All", "Draft", "In Review", "Signed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  filterStatus === s
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Documents */}
          <div className="space-y-3 max-h-[500px] md:max-h-[600px] overflow-y-auto">
            {filteredDocs.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <FileText size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No documents found</p>
              </div>
            )}
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc);
                  setMobileMenuOpen(false);
                }}
                className={`bg-white rounded-xl border p-3 md:p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedDoc?.id === doc.id ? "border-blue-500 shadow-md" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-red-500 md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size} • {doc.uploadedAt}</p>
                      {doc.signedBy && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
                          <p className="text-xs text-green-600 truncate">Signed by: {doc.signedBy}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusColors[doc.status]}`}>
                    {statusIcons[doc.status]} <span className="hidden sm:inline">{doc.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Sticky on desktop, slide-in on mobile */}
        <div className="lg:flex-1">
          {/* Mobile: Show/Hide button */}
          <div className="lg:hidden mb-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-lg text-sm font-medium text-gray-700"
            >
              <Menu size={16} />
              {mobileMenuOpen ? "Hide" : "Show"} Document Details
            </button>
          </div>

          {/* Panel Content */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden lg:block'} transition-all`}>
            {selectedDoc ? (
              <div className="flex flex-col gap-4">
                {/* Document Preview */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" /> Document Preview
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-3 min-h-32 flex flex-col items-center justify-center border border-gray-200">
                    <FileText size={36} className="text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-700 text-center break-words">{selectedDoc.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedDoc.size}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-500">Status:</span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedDoc.status]}`}>
                        {statusIcons[selectedDoc.status]} {selectedDoc.status}
                      </span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-500">Uploaded:</span>
                      <span className="text-gray-900">{selectedDoc.uploadedAt}</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-900">{selectedDoc.type}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ChevronDown size={16} className="text-blue-600" /> Actions
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Change Status:</p>
                      <div className="flex gap-2 flex-wrap">
                        {(["Draft", "In Review", "Signed"] as DocStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(selectedDoc.id, s)}
                            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                              selectedDoc.status === s
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {statusIcons[s]} {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedDoc.status !== "Signed" && (
                      <button
                        onClick={() => setShowSignModal(true)}
                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 md:py-2 rounded-lg text-sm font-medium transition-colors mt-2"
                      >
                        <PenLine size={15} /> Sign Document
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(selectedDoc.id)}
                      className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 py-2.5 md:py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 size={15} /> Delete Document
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <FolderOpen size={36} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Select a document to view details and actions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* E-Signature Modal - Mobile optimized */}
      {showSignModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md mx-0 sm:mx-4 animate-in slide-in-from-bottom sm:slide-in-from-top duration-200">
            <div className="p-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <PenLine size={18} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Sign Document</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{selectedDoc.name}</p>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Your Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Draw Your Signature</label>
                  <button onClick={clearCanvas} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600">
                    <X size={12} /> Clear
                  </button>
                </div>
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={120}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                />
                <p className="text-xs text-gray-400 mt-2">Draw your signature above (works with touch)</p>
              </div>
            </div>

            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={handleSign}
                disabled={!signerName.trim() || !hasSigned}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle size={15} /> Confirm
              </button>
              <button
                onClick={() => { setShowSignModal(false); clearCanvas(); setSignerName(""); }}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
            <div className="h-1 sm:h-0" />
          </div>
        </div>
      )}

      <style>{`
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}