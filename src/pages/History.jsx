import React, { useState, useEffect } from "react";
import { User } from "../entities/User";
import { Consultation } from "../entities/Consultation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Calendar,
  Search,
  FileText,
  Clock,
  Brain,
  Home,
  Pill,
  AlertTriangle,
  Filter,
  TrendingUp
} from "lucide-react";

export default function History() {
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    checkUser();
    loadConsultations();
  }, []);

  useEffect(() => {
    const filterConsultations = () => {
      if (!searchTerm.trim()) {
        setFilteredConsultations(consultations);
      } else {
        const filtered = consultations.filter(consultation =>
          consultation.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.likely_condition?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredConsultations(filtered);
      }
    };

    filterConsultations();
  }, [consultations, searchTerm]);

  const checkUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      window.location.href = "/";
    }
  };

  const loadConsultations = async () => {
    setIsLoading(true);
    try {
      const data = await Consultation.list("-consultation_date");
      setConsultations(data);
    } catch (error) {
      console.error("Error loading consultations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConditionIcon = (condition) => {
    if (condition?.toLowerCase().includes('cold') || condition?.toLowerCase().includes('flu')) {
      return <Brain className="w-4 h-4 text-blue-600" />;
    }
    if (condition?.toLowerCase().includes('headache')) {
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
    return <FileText className="w-4 h-4 text-gray-600" />;
  };

  const getConditionColor = (condition) => {
    if (condition?.toLowerCase().includes('severe') || condition?.toLowerCase().includes('urgent')) {
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300";
    }
    if (condition?.toLowerCase().includes('mild') || condition?.toLowerCase().includes('common')) {
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300";
    }
    return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300";
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Consultation History
            </h1>
            <p className="text-gray-600 mt-2">
              Review your past health consultations and advice
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Consultations</p>
                  <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {consultations.filter(c =>
                      new Date(c.consultation_date).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Most Recent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {consultations.length > 0 ?
                      formatDate(consultations[0]?.consultation_date) :
                      "-"
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Health Trend</p>
                  <p className="text-2xl font-bold text-emerald-600">Good</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultations List */}
        <Card className="bg-white border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-900">
                All Consultations ({filteredConsultations.length})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Sorted by date (newest first)
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConsultations.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No consultations found
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search terms" : "Start your first consultation from the dashboard"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConsultations.map((consultation) => (
                  <div key={consultation.id} className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                          {getConditionIcon(consultation.likely_condition)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {consultation.likely_condition || "General Consultation"}
                            </h3>
                            <Badge className={`text-xs border ${getConditionColor(consultation.likely_condition)}`}>
                              {consultation.likely_condition?.includes('Common') ? 'Routine' :
                               consultation.likely_condition?.includes('Severe') ? 'Important' : 'Moderate'}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {consultation.symptoms}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(consultation.consultation_date)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(consultation.consultation_date)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setSelectedConsultation(consultation)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">
                              Consultation Details
                            </DialogTitle>
                          </DialogHeader>

                          {selectedConsultation && (
                            <div className="space-y-6">
                              {/* Basic Info */}
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Date & Time</h4>
                                  <p className="text-gray-600">
                                    {formatDateTime(selectedConsultation.consultation_date)}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Condition</h4>
                                  <Badge className={`${getConditionColor(selectedConsultation.likely_condition)} border`}>
                                    {selectedConsultation.likely_condition}
                                  </Badge>
                                </div>
                              </div>

                              {/* Symptoms */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Reported Symptoms
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                                  <p className="text-gray-700">{selectedConsultation.symptoms}</p>
                                </div>
                              </div>

                              {/* Advice Grid */}
                              <div className="grid md:grid-cols-2 gap-4">
                                <Card className="bg-green-50 border-green-200">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center text-green-700">
                                      <Home className="w-5 h-5 mr-2" />
                                      Home Remedies
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-700 text-sm">
                                      {selectedConsultation.home_remedies}
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card className="bg-yellow-50 border-yellow-200">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center text-yellow-700">
                                      <Pill className="w-5 h-5 mr-2" />
                                      OTC Suggestions
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-700 text-sm">
                                      {selectedConsultation.otc_suggestions}
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card className="bg-red-50 border-red-200 md:col-span-2">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center text-red-700">
                                      <AlertTriangle className="w-5 h-5 mr-2" />
                                      Red Flags - See Doctor If:
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-700 text-sm">
                                      {selectedConsultation.red_flags}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}