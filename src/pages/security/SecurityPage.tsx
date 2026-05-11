import { useState } from "react";
import {
  Key, Smartphone, Monitor, Shield, Eye, EyeOff,
  CheckCircle, XCircle, AlertCircle, LogOut, RefreshCw
} from "lucide-react";

type SecurityTab = "password" | "2fa" | "sessions";

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<SecurityTab>("password");

  // Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // 2FA
  const [twoFAStep, setTwoFAStep] = useState<1 | 2 | 3>(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [otpError, setOtpError] = useState(false);

  // Password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: "Very Weak", color: "bg-red-500" };
    if (score === 2) return { score, label: "Weak", color: "bg-orange-500" };
    if (score === 3) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score === 4) return { score, label: "Strong", color: "bg-blue-500" };
    return { score, label: "Very Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(password);

  const handlePasswordSave = () => {
    if (!currentPassword || !password || password !== confirmPassword) return;
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
    setPassword(""); setConfirmPassword(""); setCurrentPassword("");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join("") === "123456") {
      setTwoFAStep(3); setTwoFAEnabled(true); setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  const handleDisable2FA = () => {
    setTwoFAEnabled(false); setTwoFAStep(1); setOtp(["", "", "", "", "", ""]);
  };

  const sessions = [
    { id: "1", device: "Chrome on Windows", location: "Lahore, Pakistan", time: "Active now", current: true },
    { id: "2", device: "Safari on iPhone", location: "Karachi, Pakistan", time: "2 hours ago", current: false },
    { id: "3", device: "Firefox on MacOS", location: "Islamabad, Pakistan", time: "Yesterday", current: false },
  ];

  const tabs = [
    { key: "password" as SecurityTab, label: "Password", icon: Key },
    { key: "2fa" as SecurityTab, label: "Two-Factor Auth", icon: Smartphone },
    { key: "sessions" as SecurityTab, label: "Active Sessions", icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security & Access Control</h1>
          <p className="text-sm text-gray-500">Manage your password, 2FA and active sessions</p>
        </div>
      </div>

      {/* Success Toast */}
      {passwordSaved && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">Password updated successfully</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="max-w-lg">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Key size={18} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength Meter */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i <= strength.score ? strength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Strength:{" "}
                      <span className={`font-semibold ${
                        strength.score <= 1 ? "text-red-500" :
                        strength.score === 2 ? "text-orange-500" :
                        strength.score === 3 ? "text-yellow-600" :
                        strength.score === 4 ? "text-blue-600" : "text-green-600"
                      }`}>
                        {strength.label}
                      </span>
                    </p>
                    <div className="mt-2 space-y-1">
                      {[
                        { check: password.length >= 8, text: "At least 8 characters" },
                        { check: /[A-Z]/.test(password), text: "One uppercase letter" },
                        { check: /[0-9]/.test(password), text: "One number" },
                        { check: /[^A-Za-z0-9]/.test(password), text: "One special character" },
                      ].map((req, i) => (
                        <div key={i} className={`flex items-center gap-1.5 text-xs ${req.check ? "text-green-600" : "text-gray-400"}`}>
                          {req.check
                            ? <CheckCircle size={12} />
                            : <XCircle size={12} />}
                          {req.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {confirmPassword && (
                  <div className={`flex items-center gap-1.5 mt-1 text-xs ${password === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                    {password === confirmPassword
                      ? <><CheckCircle size={12} /> Passwords match</>
                      : <><XCircle size={12} /> Passwords do not match</>}
                  </div>
                )}
              </div>

              <button
                onClick={handlePasswordSave}
                disabled={!currentPassword || !password || password !== confirmPassword || strength.score < 2}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Tab */}
      {activeTab === "2fa" && (
        <div className="max-w-lg">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={18} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">Add an extra layer of security to your account</p>

            {/* Status */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${
              twoFAEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}>
              <div className={`w-2 h-2 rounded-full ${twoFAEnabled ? "bg-green-500" : "bg-gray-400"}`} />
              {twoFAEnabled ? "2FA Enabled" : "2FA Disabled"}
            </div>

            {/* Step 1 */}
            {!twoFAEnabled && twoFAStep === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">How it works</p>
                  <p className="text-blue-700">After enabling, you will enter a 6-digit OTP code every time you log in for extra security.</p>
                </div>
                <button
                  onClick={() => setTwoFAStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Enable Two-Factor Authentication
                </button>
              </div>
            )}

            {/* Step 2 — OTP */}
            {!twoFAEnabled && twoFAStep === 2 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={16} className="text-amber-600" />
                    <p className="font-medium text-amber-800 text-sm">OTP Sent</p>
                  </div>
                  <p className="text-amber-700 text-sm">A 6-digit code has been sent to your registered phone ending in <strong>****1234</strong></p>
                  <p className="text-amber-600 text-xs mt-1">Demo code: <strong>123456</strong></p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-3">Enter OTP Code</label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          otpError ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-blue-500"
                        }`}
                      />
                    ))}
                  </div>
                  {otpError && (
                    <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-red-500">
                      <XCircle size={12} /> Invalid OTP. Use 123456 for demo.
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleVerifyOtp}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Verify OTP
                  </button>
                  <button
                    onClick={() => { setTwoFAStep(1); setOtp(["", "", "", "", "", ""]); setOtpError(false); }}
                    className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Enabled */}
            {twoFAEnabled && twoFAStep === 3 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center">
                  <CheckCircle size={40} className="text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">2FA Successfully Enabled</p>
                  <p className="text-sm text-green-600 mt-1">Your account is now protected with two-factor authentication.</p>
                </div>
                <button
                  onClick={handleDisable2FA}
                  className="w-full border border-red-300 text-red-500 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Disable 2FA
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="max-w-lg">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Monitor size={18} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">Manage devices currently logged into your account</p>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    session.current ? "border-blue-200 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      session.current ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      {session.device.includes("iPhone")
                        ? <Smartphone size={18} className={session.current ? "text-blue-600" : "text-gray-500"} />
                        : <Monitor size={18} className={session.current ? "text-blue-600" : "text-gray-500"} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.device}</p>
                      <p className="text-xs text-gray-500">{session.location}</p>
                      <p className="text-xs text-gray-400">{session.time}</p>
                    </div>
                  </div>
                  {session.current ? (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      Current
                    </span>
                  ) : (
                    <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <LogOut size={12} /> Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 border border-red-300 text-red-500 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <RefreshCw size={14} /> Revoke All Other Sessions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}