import { useState } from "react";

type TransactionType = "Deposit" | "Withdraw" | "Transfer";
type TransactionStatus = "Completed" | "Pending" | "Failed";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  sender: string;
  receiver: string;
  status: TransactionStatus;
  date: string;
  description: string;
}

const initialTransactions: Transaction[] = [
  { id: "t1", type: "Deposit", amount: 50000, sender: "Bank Account", receiver: "My Wallet", status: "Completed", date: "2026-05-10", description: "Initial deposit" },
  { id: "t2", type: "Transfer", amount: 15000, sender: "Sara Khan (Investor)", receiver: "TechStart Inc.", status: "Completed", date: "2026-05-09", description: "Series A funding - Milestone 1" },
  { id: "t3", type: "Transfer", amount: 8000, sender: "My Wallet", receiver: "Ali Hassan", status: "Pending", date: "2026-05-08", description: "Deal funding transfer" },
  { id: "t4", type: "Withdraw", amount: 5000, sender: "My Wallet", receiver: "Bank Account", status: "Completed", date: "2026-05-07", description: "Withdrawal to bank" },
  { id: "t5", type: "Deposit", amount: 25000, sender: "John Smith (Investor)", receiver: "My Wallet", status: "Failed", date: "2026-05-06", description: "Investment funding" },
];

const statusColors: Record<TransactionStatus, string> = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
};

const typeColors: Record<TransactionType, string> = {
  Deposit: "text-green-600",
  Withdraw: "text-red-600",
  Transfer: "text-blue-600",
};

export default function PaymentPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [walletBalance, setWalletBalance] = useState(47000);
  const [activeTab, setActiveTab] = useState<"wallet" | "deposit" | "withdraw" | "transfer" | "fund">("wallet");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receiver, setReceiver] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterType, setFilterType] = useState<TransactionType | "All">("All");

  const handleTransaction = (type: TransactionType) => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    if ((type === "Withdraw" || type === "Transfer") && amt > walletBalance) {
      alert("Insufficient balance!");
      return;
    }
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: amt,
      sender: type === "Deposit" ? "Bank Account" : "My Wallet",
      receiver: type === "Deposit" ? "My Wallet" : receiver || "Recipient",
      status: "Completed",
      date: new Date().toISOString().split("T")[0],
      description: description || `${type} transaction`,
    };
    setTransactions([newTransaction, ...transactions]);
    if (type === "Deposit") setWalletBalance((prev) => prev + amt);
    else setWalletBalance((prev) => prev - amt);
    setSuccessMsg(`${type} of $${amt.toLocaleString()} successful!`);
    setShowSuccess(true);
    setAmount(""); setDescription(""); setReceiver("");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const filteredTransactions = filterType === "All" ? transactions : transactions.filter((t) => t.type === filterType);

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Payment Center</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your wallet, transactions and deal funding</p>
      </div>

      {showSuccess && (
        <div className="fixed top-4 right-4 left-4 md:left-auto bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 font-medium text-sm text-center">
          {successMsg}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 md:p-5 text-white">
          <p className="text-blue-100 text-sm">Wallet Balance</p>
          <p className="text-2xl md:text-3xl font-bold mt-1">${walletBalance.toLocaleString()}</p>
          <p className="text-blue-200 text-xs mt-2">Available to use</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
          <p className="text-gray-500 text-sm">Total Received</p>
          <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">
            ${transactions.filter((t) => t.type === "Deposit" && t.status === "Completed").reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs mt-2">All deposits</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
          <p className="text-gray-500 text-sm">Total Sent</p>
          <p className="text-xl md:text-2xl font-bold text-red-500 mt-1">
            ${transactions.filter((t) => t.type !== "Deposit" && t.status === "Completed").reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs mt-2">Withdrawals & transfers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Action Panel */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1 flex-wrap">
            {(["wallet", "deposit", "withdraw", "transfer", "fund"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-colors capitalize ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {tab === "fund" ? "Fund Deal" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "wallet" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
              <h3 className="font-semibold text-gray-900 mb-4">My Wallet</h3>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 md:p-5 text-white mb-4">
                <p className="text-blue-100 text-xs mb-1">Available Balance</p>
                <p className="text-2xl md:text-3xl font-bold">${walletBalance.toLocaleString()}</p>
                <div className="mt-4 flex justify-between text-xs text-blue-200">
                  <span>Business Nexus Wallet</span>
                  <span>**** 4242</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setActiveTab("deposit")} className="bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium transition-colors">Deposit</button>
                <button onClick={() => setActiveTab("withdraw")} className="bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg text-sm font-medium transition-colors">Withdraw</button>
                <button onClick={() => setActiveTab("transfer")} className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium transition-colors">Transfer</button>
                <button onClick={() => setActiveTab("fund")} className="bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-lg text-sm font-medium transition-colors">Fund Deal</button>
              </div>
            </div>
          )}

          {activeTab === "deposit" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Deposit Funds</h3>
              <div className="space-y-3">
                <div><label className="text-sm font-medium text-gray-700">Amount ($)</label><input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="text-sm font-medium text-gray-700">Description</label><input type="text" placeholder="Optional note" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">Simulated payment via Stripe</div>
                <button onClick={() => handleTransaction("Deposit")} className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">Confirm Deposit</button>
              </div>
            </div>
          )}

          {activeTab === "withdraw" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 text-sm"><p className="text-gray-500 text-xs">Available Balance</p><p className="font-bold text-blue-700">${walletBalance.toLocaleString()}</p></div>
                <div><label className="text-sm font-medium text-gray-700">Amount ($)</label><input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="text-sm font-medium text-gray-700">Description</label><input type="text" placeholder="Optional note" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <button onClick={() => handleTransaction("Withdraw")} className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">Confirm Withdrawal</button>
              </div>
            </div>
          )}

          {activeTab === "transfer" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Transfer Funds</h3>
              <div className="space-y-3">
                <div><label className="text-sm font-medium text-gray-700">Recipient Name</label><input type="text" placeholder="Enter recipient name" value={receiver} onChange={(e) => setReceiver(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="text-sm font-medium text-gray-700">Amount ($)</label><input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="text-sm font-medium text-gray-700">Description</label><input type="text" placeholder="Optional note" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <button onClick={() => handleTransaction("Transfer")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">Confirm Transfer</button>
              </div>
            </div>
          )}

          {activeTab === "fund" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Fund a Deal</h3>
              <p className="text-xs text-gray-500 mb-3">Investor → Entrepreneur funding flow</p>
              <div className="space-y-3">
                <div className="bg-purple-50 rounded-lg p-3"><p className="text-xs text-gray-500">From (Investor)</p><p className="text-sm font-medium text-gray-900">Sara Khan</p></div>
                <div><label className="text-sm font-medium text-gray-700">Entrepreneur / Startup</label><input type="text" placeholder="Enter startup name" value={receiver} onChange={(e) => setReceiver(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                <div><label className="text-sm font-medium text-gray-700">Funding Amount ($)</label><input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                <div><label className="text-sm font-medium text-gray-700">Deal Description</label><input type="text" placeholder="e.g. Series A - Milestone 1" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                <button onClick={() => handleTransaction("Transfer")} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">Fund This Deal</button>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-semibold text-gray-900">Transaction History</h3>
              <div className="flex gap-1 flex-wrap">
                {(["All", "Deposit", "Withdraw", "Transfer"] as const).map((type) => (
                  <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === type ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full min-w-[500px] px-4 md:px-0">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3 pl-4 md:pl-0">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3">Description</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-sm pl-4 md:pl-0"><span className={`font-medium ${typeColors[t.type]}`}>{t.type}</span></td>
                      <td className="py-3 text-sm text-gray-600 max-w-24 truncate">{t.description}</td>
                      <td className="py-3 text-sm font-semibold text-gray-900">${t.amount.toLocaleString()}</td>
                      <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[t.status]}`}>{t.status}</span></td>
                      <td className="py-3 text-xs text-gray-500">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}