import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle, X, ChevronRight, ChevronLeft, HelpCircle, Wallet } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';

const tourSteps = [
  {
    title: "Welcome to Business Nexus!",
    content: "Let us give you a quick tour of the platform to help you get started.",
    position: "center" as const,
  },
  {
    title: "Your Stats Overview",
    content: "Here you can see your key stats — pending requests, total connections, upcoming meetings, profile views and wallet balance.",
    position: "top" as const,
  },
  {
    title: "Collaboration Requests",
    content: "This section shows collaboration requests from investors who are interested in your startup. Accept or reject them here.",
    position: "top" as const,
  },
  {
    title: "Recommended Investors",
    content: "These are investors recommended based on your startup profile. Connect with them to grow your business!",
    position: "top" as const,
  },
  {
    title: "Find More Investors",
    content: "Click the 'Find Investors' button to browse all available investors and send collaboration requests.",
    position: "top" as const,
  },
];

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const walletBalance = 47000;

  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
    const tourSeen = localStorage.getItem('nexus-tour-seen');
    if (!tourSeen) {
      setTimeout(() => setShowTour(true), 800);
    }
  }, [user]);

  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  const handleNextStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
      localStorage.setItem('nexus-tour-seen', 'true');
    }
  };

  const handlePrevStep = () => {
    if (tourStep > 0) setTourStep(tourStep - 1);
  };

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem('nexus-tour-seen', 'true');
  };

  const handleStartTour = () => {
    setTourStep(0);
    setShowTour(true);
  };

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Tour Overlay */}
      {showTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 relative">
            <div className="flex gap-1 mb-4">
              {tourSteps.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= tourStep ? "bg-blue-600" : "bg-gray-200"}`} />
              ))}
            </div>
            <p className="text-xs text-blue-600 font-semibold mb-1">Step {tourStep + 1} of {tourSteps.length}</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{tourSteps[tourStep].title}</h3>
            <p className="text-sm text-gray-600 mb-6">{tourSteps[tourStep].content}</p>
            <div className="flex items-center justify-between">
              <button onClick={handleCloseTour} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Skip tour</button>
              <div className="flex gap-2">
                {tourStep > 0 && (
                  <button onClick={handlePrevStep} className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                <button onClick={handleNextStep} className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  {tourStep === tourSteps.length - 1 ? "Finish" : "Next"}
                  {tourStep < tourSteps.length - 1 && <ChevronRight size={16} />}
                </button>
              </div>
            </div>
            <button onClick={handleCloseTour} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartTour}
            className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            <HelpCircle size={15} /> Take a Tour
          </button>
          <Link to="/investors">
            <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-xl font-semibold text-primary-900">{pendingRequests.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">2</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Profile Views</p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Wallet Balance Card — same style as other cards */}
        <Card className="bg-blue-50 border border-blue-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Wallet size={20} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Wallet Balance</p>
                <h3 className="text-xl font-semibold text-blue-900">
                  ${walletBalance.toLocaleString()}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    When investors are interested in your startup, their requests will appear here
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recommended investors */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>
            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  showActions={false}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};