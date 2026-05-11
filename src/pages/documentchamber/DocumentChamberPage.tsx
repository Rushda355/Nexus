import { useState, useRef } from "react";

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

const statusIcons: Record<DocStatus, string> = {
  Draft: "",
  "In Review": "",
  Signed: "",
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Handle file upload
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

  // Canvas drawing for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPos.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
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

  // Sign document
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

  // Change status
  const handleStatusChange = (id: string, status: DocStatus) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
    );
  };

  // Delete document
  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const filteredDocs =
    filterStatus === "All"
      ? documents
      : documents.filter((d) => d.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage deals, contracts and agreements
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          📤 Upload Document
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

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["Draft", "In Review", "Signed"] as DocStatus[]).map((status) => (
          <div key={status} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <span className="text-2xl">{statusIcons[status]}</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter((d) => d.status === status).length}
              </p>
              <p className="text-sm text-gray-500">{status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* Drag & Drop Upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
            }`}
          >
            <p className="text-3xl mb-2">📁</p>
            <p className="text-sm font-medium text-gray-700">
              Drag & drop files here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports PDF, DOC, DOCX
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(["All", "Draft", "In Review", "Signed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
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
          <div className="space-y-3">
            {filteredDocs.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-400 text-sm">No documents found</p>
              </div>
            )}
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedDoc?.id === doc.id
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-lg">
                      📄
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {doc.type} • {doc.size} • {doc.uploadedAt}
                      </p>
                      {doc.signedBy && (
                        <p className="text-xs text-green-600 mt-0.5">
                          ✅ Signed by: {doc.signedBy}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[doc.status]}`}>
                      {statusIcons[doc.status]} {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Document Actions */}
        <div className="flex flex-col gap-4">
          {selectedDoc ? (
            <>
              {/* Document Preview */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">📄 Document Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-3 min-h-32 flex flex-col items-center justify-center border border-gray-200">
                  <p className="text-4xl mb-2">📄</p>
                  <p className="text-sm font-medium text-gray-700 text-center">{selectedDoc.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedDoc.size}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedDoc.status]}`}>
                      {statusIcons[selectedDoc.status]} {selectedDoc.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Uploaded:</span>
                    <span className="text-gray-900">{selectedDoc.uploadedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="text-gray-900">{selectedDoc.type}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">⚡ Actions</h3>
                <div className="space-y-2">
                  {/* Change Status */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Change Status:</p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Draft", "In Review", "Signed"] as DocStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(selectedDoc.id, s)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
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

                  {/* Sign Button */}
                  {selectedDoc.status !== "Signed" && (
                    <button
                      onClick={() => setShowSignModal(true)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-colors mt-2"
                    >
                       Sign Document
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(selectedDoc.id)}
                    className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                     Delete Document
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-3xl mb-2">👆</p>
              <p className="text-sm text-gray-500">
                Select a document to view details and actions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* E-Signature Modal */}
      {showSignModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
               Sign Document
            </h3>
            <p className="text-sm text-gray-500 mb-4">{selectedDoc.name}</p>

            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Draw Your Signature
                </label>
                <button
                  onClick={clearCanvas}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear
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
                className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-crosshair"
              />
              <p className="text-xs text-gray-400 mt-1">
                Draw your signature above
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSign}
                disabled={!signerName.trim() || !hasSigned}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ✅ Confirm Signature
              </button>
              <button
                onClick={() => { setShowSignModal(false); clearCanvas(); setSignerName(""); }}
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