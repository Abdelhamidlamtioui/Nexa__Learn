"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertTriangle, Users, Calendar, FileText } from "lucide-react"
import { useDocumentationStore } from "@/stores/useDocumentationStore"
import { toast } from "@/components/ui/use-toast"


export function DocumentationWorkflowTools() {
  const [documentStatus, setDocumentStatus] = useState<string>("draft")
  const [isUpdating, setIsUpdating] = useState(false)

   // Get the selected documentation and section from the store
   const { 
    selectedSection, 
    selectedDocumentation,
    getFormattedLastUpdated,
    getLastModifiedByUsername,
    updateDocumentationStatus
  } = useDocumentationStore()
  
  // Add debug logging to check what's happening
  useEffect(() => {
    console.log("Selected documentation:", selectedDocumentation);
    console.log("updateDocumentationStatus function:", !!updateDocumentationStatus);
  }, [selectedDocumentation, updateDocumentationStatus]);
  
  // Effect to update local state when selected documentation changes
  useEffect(() => {
    if (selectedDocumentation?.status) {
      console.log("Setting status from doc:", selectedDocumentation.status.toLowerCase());
      setDocumentStatus(selectedDocumentation.status.toLowerCase());
    }
  }, [selectedDocumentation]);
  
  // Get formatted time and username for the selected section
  const lastUpdatedFormatted = getFormattedLastUpdated(selectedSection)
  const lastModifiedByUsername = getLastModifiedByUsername(selectedSection)
  
  // Add these functions
  const handleSubmitForReview = async () => {
    if (!selectedDocumentation?.id) {
      toast({
        title: "Error",
        description: "No documentation selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      console.log("Submitting for review, doc ID:", selectedDocumentation.id);
      
      // Make sure the status is in correct format for your API
      const result = await updateDocumentationStatus(selectedDocumentation.id, "REVIEW");
      console.log("API response:", result);
      
      // Only update UI state after successful API call
      setDocumentStatus("review");
      
      toast({
        title: "Success",
        description: "Document submitted for review"
      });
    } catch (error) {
      console.error("Error submitting for review:", error);
      toast({
        title: "Error",
        description: "Failed to submit document for review: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleApproveAndPublish = async () => {
    if (!selectedDocumentation?.id) {
      toast({
        title: "Error",
        description: "No documentation selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      console.log("Publishing document, doc ID:", selectedDocumentation.id);
      
      const result = await updateDocumentationStatus(selectedDocumentation.id, "PUBLISHED");
      console.log("API response:", result);
      
      setDocumentStatus("published");
      
      toast({
        title: "Success",
        description: "Document published successfully"
      });
    } catch (error) {
      console.error("Error publishing document:", error);
      toast({
        title: "Error",
        description: "Failed to publish document: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUnpublish = async () => {
    if (!selectedDocumentation?.id) {
      toast({
        title: "Error",
        description: "No documentation selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      console.log("Unpublishing document, doc ID:", selectedDocumentation.id);
      
      const result = await updateDocumentationStatus(selectedDocumentation.id, "DRAFT");
      console.log("API response:", result);
      
      setDocumentStatus("draft");
      
      toast({
        title: "Success",
        description: "Document unpublished and returned to draft"
      });
    } catch (error) {
      console.error("Error unpublishing document:", error);
      toast({
        title: "Error",
        description: "Failed to unpublish document: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRequestChanges = async () => {
    if (!selectedDocumentation?.id) {
      toast({
        title: "Error",
        description: "No documentation selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      console.log("Requesting changes, doc ID:", selectedDocumentation.id);
      
      const result = await updateDocumentationStatus(selectedDocumentation.id, "DRAFT");
      console.log("API response:", result);
      
      setDocumentStatus("draft");
      
      toast({
        title: "Success",
        description: "Changes requested - document returned to draft"
      });
    } catch (error) {
      console.error("Error requesting changes:", error);
      toast({
        title: "Error",
        description: "Failed to request changes: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
        <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-indigo-400" />
            Publication Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Current Status</h3>
            <div className="flex items-center gap-3">
              <StatusBadge status={documentStatus} />
              <div className="text-sm text-indigo-300">Last updated {lastUpdatedFormatted} by {lastModifiedByUsername}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Workflow Progress</h3>
            <div className="relative pt-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-900/50">
                <div
                  className={`h-1 bg-indigo-500 transition-all duration-300 ${
                    documentStatus === "draft" ? "w-1/3" : documentStatus === "review" ? "w-2/3" : "w-full"
                  }`}
                ></div>
              </div>

              <div className="flex justify-between">
                <WorkflowStep
                  label="Draft"
                  isActive={documentStatus === "draft"}
                  isCompleted={documentStatus === "review" || documentStatus === "published"}
                  onClick={() => setDocumentStatus("draft")}
                />
                <WorkflowStep
                  label="Review"
                  isActive={documentStatus === "review"}
                  isCompleted={documentStatus === "published"}
                  onClick={() => setDocumentStatus("review")}
                />
                <WorkflowStep
                  label="Published"
                  isActive={documentStatus === "published"}
                  isCompleted={false}
                  onClick={() => setDocumentStatus("published")}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {documentStatus === "draft" && (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  console.log("Submit for Review clicked");
                  handleSubmitForReview();
                }}
                disabled={isUpdating}
              >
                {isUpdating ? "Submitting..." : "Submit for Review"}
              </Button>
            )}

            {documentStatus === "review" && (
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    console.log("Approve & Publish clicked");
                    handleApproveAndPublish();
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Publishing..." : "Approve & Publish"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-indigo-900/30 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50"
                  onClick={() => {
                    console.log("Request Changes clicked");
                    handleRequestChanges();
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Requesting Changes..." : "Request Changes"}
                </Button>
              </div>
            )}

            {documentStatus === "published" && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-indigo-900/30 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50"
                  onClick={() => {
                    console.log("Unpublish clicked");
                    handleUnpublish();
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Unpublishing..." : "Unpublish"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
        <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-400" />
            Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Active Collaborators</h3>
              <Button
                variant="outline"
                size="sm"
                className="h-7 bg-indigo-900/30 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50"
              >
                Invite
              </Button>
            </div>

            <div className="space-y-2">
              <CollaboratorItem name="Alex Morgan" role="Owner" status="active" lastActive="2 minutes ago" />
              <CollaboratorItem name="Jamie Chen" role="Editor" status="active" lastActive="5 minutes ago" />
              <CollaboratorItem name="Taylor Kim" role="Reviewer" status="offline" lastActive="2 hours ago" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
        <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-400" />
            Publication Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Scheduled Publication</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-900/50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-medium">March 15, 2023 at 9:00 AM</div>
                <div className="text-xs text-indigo-300">Scheduled by Alex Morgan</div>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Change Schedule</Button>
            <Button
              variant="outline"
              className="w-full bg-indigo-900/30 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50"
            >
              Publish Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
        <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-400" />
            Quality Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-3">
            <QualityItem label="Completeness" score={85} />
            <QualityItem label="Clarity" score={92} />
            <QualityItem label="Accuracy" score={88} />
            <QualityItem label="SEO Optimization" score={78} />
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Overall Quality Score</h4>
            <div className="flex items-center gap-3">
              <Progress value={86} className="h-2 flex-1" />
              <span className="text-sm font-medium">86/100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }) {
  const getStatusDetails = (status) => {
    switch (status) {
      case "draft":
        return {
          label: "Draft",
          icon: <Clock size={14} />,
          className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
        }
      case "review":
        return {
          label: "In Review",
          icon: <AlertTriangle size={14} />,
          className: "bg-blue-500/20 text-blue-300 border-blue-500/50",
        }
      case "published":
        return {
          label: "Published",
          icon: <CheckCircle size={14} />,
          className: "bg-green-500/20 text-green-300 border-green-500/50",
        }
      default:
        return {
          label: "Draft",
          icon: <Clock size={14} />,
          className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
        }
    }
  }

  const details = getStatusDetails(status)

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${details.className}`}>
      {details.icon}
      {details.label}
    </Badge>
  )
}

function WorkflowStep({ label, isActive, isCompleted, onClick }) {
  return (
    <div className="flex flex-col items-center">
      <button
        className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 transition-colors ${
          isActive
            ? "bg-indigo-600 text-white"
            : isCompleted
              ? "bg-green-600 text-white"
              : "bg-indigo-900/50 text-indigo-400"
        }`}
        onClick={onClick}
      >
        {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs">{label.charAt(0)}</span>}
      </button>
      <span className={`text-xs ${isActive ? "text-white font-medium" : "text-indigo-300"}`}>{label}</span>
    </div>
  )
}

function CollaboratorItem({ name, role, status, lastActive }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-indigo-500/50"}`}></div>
        <span className="text-sm">{name}</span>
        <span className="text-xs text-indigo-400">({role})</span>
      </div>
      <span className="text-xs text-indigo-300">{lastActive}</span>
    </div>
  )
}

function QualityItem({ label, score }) {
  const getScoreColor = (score) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{score}/100</span>
      </div>
      <div className="h-1.5 bg-indigo-900/50 rounded-full">
        <div className={`h-1.5 ${getScoreColor(score)} rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  )
}

