import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  AlertTriangle,
  Home,
  Pill,
  MapPin,
  Play,
  ArrowRight,
  Clock,
  Brain,
  CheckCircle
} from "lucide-react";

export default function Demo() {
  const transcript = "I have fever and headache for 2 days. The fever started yesterday evening around 6 PM and reached 101°F. I also have a mild sore throat and feel very tired. I've been drinking lots of water but haven't taken any medication yet.";

  const adviceCards = [
    {
      type: "condition",
      title: "Likely Condition",
      content: "Viral infection (e.g., flu or common cold)",
      confidence: "80% confidence",
      color: "blue",
      icon: Brain
    },
    {
      type: "home",
      title: "Home Remedies",
      content: "Stay well-hydrated, rest as much as possible, and use a cool compress on your forehead to alleviate headache. Herbal teas (like ginger or chamomile) may also help.",
      color: "green",
      icon: Home
    },
    {
      type: "otc",
      title: "OTC Suggestions",
      content: "Consider taking acetaminophen (Tylenol) or ibuprofen (Advil) to reduce fever and relieve headache.",
      color: "yellow",
      icon: Pill
    },
    {
      type: "warning",
      title: "Red Flags - See Doctor If:",
      content: "If the fever is higher than 103°F (39.4°C), persists longer than three days, develops a rash, or if you experience severe headache, stiff neck, confusion, or difficulty breathing, seek immediate medical attention.",
      color: "red",
      icon: AlertTriangle
    }
  ];

  const getCardStyles = (color: string) => {
    const styles = {
      blue: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
      green: "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800",
      yellow: "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800",
      red: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
    };
    return styles[color] || styles.blue;
  };

  const getIconStyles = (color: string) => {
    const styles = {
      blue: "text-blue-600 dark:text-blue-400",
      green: "text-green-600 dark:text-green-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
      red: "text-red-600 dark:text-red-400"
    };
    return styles[color] || styles.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-teal-100 dark:bg-teal-900/30 rounded-full text-teal-800 dark:text-teal-200 text-sm font-medium mb-6">
            <Play className="w-4 h-4 mr-2" />
            Interactive Demo
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Experience <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Cliniscribe</span> in Action
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            See how our AI analyzes symptoms and provides intelligent health recommendations. This is a demonstration with sample data.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transcript Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Patient Input</CardTitle>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      2 minutes ago
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-teal-500">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{transcript}"
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Analysis Status</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Complete
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Processing Time</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">1.2 seconds</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Key Symptoms Detected</span>
                    <div className="flex space-x-1">
                      <Badge variant="secondary" className="text-xs">Fever</Badge>
                      <Badge variant="secondary" className="text-xs">Headache</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advice Cards */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Health Analysis</h2>
              <p className="text-gray-600 dark:text-gray-300">Generated 4:59:20 PM</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {adviceCards.map((card, index) => (
                <Card key={index} className={`${getCardStyles(card.color)} border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-2xl`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        card.color === 'blue' ? 'bg-blue-600' :
                        card.color === 'green' ? 'bg-green-600' :
                        card.color === 'yellow' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        <card.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`text-lg ${getIconStyles(card.color)}`}>
                          {card.title}
                        </CardTitle>
                        {card.confidence && (
                          <div className="flex items-center mt-1">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                            <p className={`text-xs ${getIconStyles(card.color)} opacity-75`}>
                              {card.confidence}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {card.content}
                    </p>
                    {card.type === "warning" && (
                      <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-800 font-medium">
                            Seek immediate medical attention if any of these symptoms occur.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Features Preview */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Map Preview */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-teal-600" />
                <CardTitle className="text-gray-900 dark:text-white">Nearby Healthcare Facilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-teal-500 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Interactive Map Integration</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find nearby clinics & pharmacies</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">City General Hospital</span>
                  <span className="text-xs text-teal-600 dark:text-teal-400">0.8 km</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">MedPlus Pharmacy</span>
                  <span className="text-xs text-teal-600 dark:text-teal-400">0.3 km</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Preview */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Play className="w-6 h-6 text-blue-600" />
                  <CardTitle className="text-gray-900 dark:text-white">Personalized Health Video</CardTitle>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">HD Quality</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl h-48 flex items-center justify-center relative overflow-hidden">
                <div className="text-center z-10">
                  <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Play className="w-8 h-8 text-blue-600 ml-1" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">AI Health Video Ready</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Personalized video explanation about your condition and treatment options</p>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 h-1 rounded">
                  <div className="bg-gray-400 h-1 rounded" style={{ width: '0%' }}></div>
                </div>
                <span className="text-sm text-gray-500">0:00 / 2:05</span>
              </div>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Preview:</strong> This video will provide personalized visual demonstrations of recommended treatments, exercises, and care instructions based on your specific symptoms and condition.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 shadow-xl">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready for Real Health Insights?
              </h3>
              <p className="text-teal-100 mb-6 text-lg">
                This was just a preview. Sign up to get personalized AI health analysis for your actual symptoms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Landing")}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 bg-white text-teal-600 hover:bg-gray-100">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to={createPageUrl("Landing")}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-600">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}