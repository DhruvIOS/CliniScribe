import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Consultation } from "@/entities/Consultation";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Mic,
  Play,
  Volume2,
  Download,
  Share,
  CheckCircle,
  Clock,
  Brain,
  Home,
  Pill,
  AlertTriangle
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [currentAdvice, setCurrentAdvice] = useState(null);
  const [consultationDate, setConsultationDate] = useState(null);
  const [error, setError] = useState(null);
  const [recentConsultations, setRecentConsultations] = useState([]);

  useEffect(() => {
    checkUser();
    loadRecentConsultations();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      window.location.href = "/";
    }
  };

  const loadRecentConsultations = async () => {
    try {
      const consultations = await Consultation.list("-consultation_date", 5);
      setRecentConsultations(consultations);
    } catch (error) {
      console.error("Error loading consultations:", error);
    }
  };

  const handleSymptomsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setSymptoms(value);
      setCharacterCount(value.length);
    }
  };

  const handleGenerateAdvice = async () => {
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setConsultationDate(new Date().toISOString());

    try {
      const response = await InvokeLLM({
        prompt: `You are an AI health assistant. Analyze these symptoms and provide structured medical advice: "${symptoms}"

        Please provide:
        1. Most likely condition (with confidence level)
        2. Home remedies and self-care suggestions
        3. Over-the-counter medication recommendations
        4. Red flag symptoms that require immediate medical attention

        Be helpful but always remind users to consult healthcare professionals for proper diagnosis.`,
        response_json_schema: {
          type: "object",
          properties: {
            likely_condition: {
              type: "string",
              description: "The most probable condition based on symptoms"
            },
            confidence_level: {
              type: "string",
              description: "Confidence percentage (e.g., '85% confidence')"
            },
            home_remedies: {
              type: "string",
              description: "Recommended home remedies and self-care"
            },
            otc_suggestions: {
              type: "string",
              description: "Over-the-counter medication suggestions"
            },
            red_flags: {
              type: "string",
              description: "Warning signs that require immediate medical attention"
            }
          }
        }
      });

      setCurrentAdvice(response);

      // Save consultation to database
      await Consultation.create({
        symptoms,
        transcript: symptoms,
        likely_condition: response.likely_condition,
        home_remedies: response.home_remedies,
        otc_suggestions: response.otc_suggestions,
        red_flags: response.red_flags,
        consultation_date: new Date().toISOString()
      });

      loadRecentConsultations();

    } catch (error) {
      console.error("Error generating advice:", error);
      setError("Failed to analyze symptoms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    setSymptoms("");
    setCharacterCount(0);
    setCurrentAdvice(null);
    setConsultationDate(null);
    setError(null);
  };

  const userName = user?.full_name?.split(' ')[0] || 'Game';
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Welcome back, {userName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Describe your symptoms and get intelligent health guidance
              </p>
            </div>

            {(symptoms || currentAdvice) && (
              <Button
                variant="outline"
                onClick={clearSession}
                className="hover:bg-gray-100"
              >
                New Consultation
              </Button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2">
            {/* Symptom Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Describe Your Symptoms</h2>
                  <p className="text-gray-600">Be as detailed as possible for better analysis</p>
                </div>
              </div>

              <div className="mb-6">
                <Textarea
                  value={symptoms}
                  onChange={handleSymptomsChange}
                  placeholder="For example: I have fever and headache for 2 days. The fever started yesterday evening around 6 PM and reached 101°F. I also have a mild sore throat and feel very tired..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">{characterCount}/500 characters</span>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleGenerateAdvice}
                disabled={!symptoms.trim() || isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isLoading ? "Generating..." : "Generate Advice"}</span>
              </Button>
            </div>

            {/* AI Health Analysis Results */}
            {(currentAdvice || isLoading) && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">AI Health Analysis</h2>
                  {currentAdvice && (
                    <div className="text-sm text-gray-500">Generated {currentTime}</div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Likely Condition */}
                  <Card className="bg-blue-50 border border-blue-200 rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-blue-900">Likely Condition</CardTitle>
                          {currentAdvice?.confidence_level && (
                            <div className="flex items-center mt-1">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm text-blue-700">{currentAdvice.confidence_level}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="animate-pulse">
                          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                        </div>
                      ) : (
                        <>
                          <h4 className="text-xl font-bold text-gray-900 mb-4">
                            {currentAdvice?.likely_condition}
                          </h4>
                          <div className="bg-blue-100 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                              This assessment is based on the symptoms you provided. Always consult a healthcare professional for proper diagnosis.
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Home Remedies */}
                  <Card className="bg-green-50 border border-green-200 rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                          <Home className="w-4 h-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-green-900">Home Remedies</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="animate-pulse">
                          <div className="h-4 bg-green-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-green-200 rounded w-5/6 mb-2"></div>
                          <div className="h-4 bg-green-200 rounded w-3/4"></div>
                        </div>
                      ) : (
                        <p className="text-gray-800">{currentAdvice?.home_remedies}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* OTC Suggestions */}
                  <Card className="bg-yellow-50 border border-yellow-200 rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                          <Pill className="w-4 h-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-yellow-900">OTC Suggestions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="animate-pulse">
                          <div className="h-4 bg-yellow-200 rounded w-4/5 mb-2"></div>
                          <div className="h-4 bg-yellow-200 rounded w-3/5"></div>
                        </div>
                      ) : (
                        <p className="text-gray-800">{currentAdvice?.otc_suggestions}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Red Flags */}
                  <Card className="bg-red-50 border border-red-200 rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-red-900">Red Flags - See Doctor If:</CardTitle>
                          <span className="inline-block px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full mt-1">
                            Important
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="animate-pulse">
                          <div className="h-4 bg-red-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-red-200 rounded w-4/5 mb-2"></div>
                          <div className="h-4 bg-red-200 rounded w-3/4"></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-800 mb-4">{currentAdvice?.red_flags}</p>
                          <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <p className="text-sm text-red-800 font-medium">
                                Seek immediate medical attention if any of these symptoms occur.
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Healthcare Facilities */}
                {currentAdvice && (
                  <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <CardTitle className="text-gray-900">Nearby Healthcare Facilities</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 rounded-xl p-8 text-center mb-6">
                        <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map Integration</h4>
                        <p className="text-gray-600">Find nearby clinics, pharmacies, and emergency facilities based on your location</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">City General Hospital</h4>
                              <p className="text-sm text-gray-600">Emergency & General Care</p>
                            </div>
                            <span className="text-sm text-blue-600 font-medium">0.8 km</span>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">MedPlus Pharmacy</h4>
                              <p className="text-sm text-gray-600">24/7 Pharmacy</p>
                            </div>
                            <span className="text-sm text-blue-600 font-medium">0.3 km</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Personalized Health Video */}
                {currentAdvice && (
                  <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Play className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-gray-900">Personalized Health Video</CardTitle>
                            <p className="text-sm text-gray-600">AI-generated guidance for your condition</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          HD Quality
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl aspect-video flex items-center justify-center mb-4 relative">
                        <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                          <Play className="w-6 h-6 text-gray-700 ml-1" />
                        </button>

                        <div className="absolute bottom-4 left-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">AI Health Video Ready</h4>
                          <p className="text-sm text-gray-600">
                            Personalized video explanation about your condition and treatment options
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-1 bg-gray-200 h-1 rounded">
                          <div className="bg-gray-400 h-1 rounded" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">0:00 / 2:05</span>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Share className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Generated by AI</p>
                            <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                              <p className="text-sm text-green-800">
                                <strong>Preview:</strong> This video will provide personalized visual demonstrations of recommended treatments, exercises, and care instructions based on your specific symptoms and condition.
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Coming Soon</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Duration:</span>
                            <span className="text-sm text-gray-600 ml-2">2:05</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Language:</span>
                            <span className="text-sm text-gray-600 ml-2">English</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Health Dashboard */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Health Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">Consultations</span>
                  </div>
                  <span className="font-semibold text-gray-900">{recentConsultations.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">This Month</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {recentConsultations.filter(c =>
                      new Date(c.consultation_date).getMonth() === new Date().getMonth()
                    ).length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Health Score</span>
                  </div>
                  <span className="font-semibold text-green-600">Good</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Consultations */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Recent Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                {recentConsultations.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No consultations yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentConsultations.slice(0, 3).map((consultation, index) => (
                      <div key={consultation.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
                          {consultation.likely_condition || "General Consultation"}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(consultation.consultation_date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}