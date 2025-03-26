"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Link,
  FileText,
  BookOpen,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Check,
  X,
} from "lucide-react"

export function ModerationFeatures() {
  const [activeTab, setActiveTab] = useState("sensitivity")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="bg-indigo-900/20 border-indigo-500/30 text-white overflow-hidden">
          <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 mr-2 text-indigo-400" />
              Content Sensitivity Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 bg-indigo-900/30 rounded-none border-b border-indigo-500/30">
                <TabsTrigger value="sensitivity" className="data-[state=active]:bg-indigo-600">
                  Sensitivity
                </TabsTrigger>
                <TabsTrigger value="terminology" className="data-[state=active]:bg-indigo-600">
                  Terminology
                </TabsTrigger>
                <TabsTrigger value="citations" className="data-[state=active]:bg-indigo-600">
                  Citations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sensitivity" className="m-0 p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Content Sensitivity Score</h3>
                    <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-500/50">
                      Low Risk
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <SensitivityItem label="Inclusive Language" score={95} issues={0} details="No issues detected" />
                    <SensitivityItem label="Cultural Sensitivity" score={100} issues={0} details="No issues detected" />
                    <SensitivityItem
                      label="Bias Detection"
                      score={92}
                      issues={1}
                      details="Consider rephrasing 'master/slave' terminology"
                    />
                    <SensitivityItem
                      label="Accessibility Language"
                      score={98}
                      issues={0}
                      details="No issues detected"
                    />
                    <SensitivityItem label="Political Neutrality" score={100} issues={0} details="No issues detected" />
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Overall Sensitivity Score</h4>
                    <div className="flex items-center gap-3">
                      <Progress value={97} className="h-2 flex-1" />
                      <span className="text-sm font-medium">97/100</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terminology" className="m-0 p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Terminology Consistency</h3>

                  <div className="space-y-3">
                    <TerminologyItem term="user-centric" status="consistent" occurrences={5} suggestion="" />
                    <TerminologyItem
                      term="master/slave"
                      status="flagged"
                      occurrences={1}
                      suggestion="primary/secondary or leader/follower"
                    />
                    <TerminologyItem
                      term="whitelist/blacklist"
                      status="flagged"
                      occurrences={0}
                      suggestion="allowlist/denylist"
                    />
                    <TerminologyItem term="platform guidelines" status="consistent" occurrences={8} suggestion="" />
                    <TerminologyItem term="security" status="consistent" occurrences={6} suggestion="" />
                  </div>

                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Apply Terminology Recommendations
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="citations" className="m-0 p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Citation Verification</h3>

                  <div className="space-y-3">
                    <CitationItem
                      source="Platform Security Guidelines v2.1"
                      status="verified"
                      link="internal://security/guidelines/v2.1"
                      details="Internal document, verified"
                    />
                    <CitationItem
                      source="WCAG 2.1 Accessibility Standards"
                      status="verified"
                      link="https://www.w3.org/TR/WCAG21/"
                      details="External link verified (last checked 2 days ago)"
                    />
                    <CitationItem
                      source="User Experience Research Report"
                      status="unverified"
                      link="internal://research/ux/2023-q2"
                      details="Document not found or access restricted"
                    />
                    <CitationItem
                      source="API Documentation v3"
                      status="verified"
                      link="internal://api/documentation/v3"
                      details="Internal document, verified"
                    />
                  </div>

                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Verify All Citations</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
          <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-indigo-400" />
              Content Categorization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Detected Categories</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-600">Platform Guidelines</Badge>
                <Badge className="bg-indigo-600">Security</Badge>
                <Badge className="bg-indigo-600">User Experience</Badge>
                <Badge className="bg-indigo-600">Accessibility</Badge>
                <Badge className="bg-indigo-600">Best Practices</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Suggested Taxonomies</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm">Documentation &gt; Guidelines &gt; Platform</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm">Security > Principles > Core</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm">User Experience > Accessibility > Standards</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
          <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-indigo-400" />
              Technical Accuracy Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <TechnicalItem
                section="Security Principles"
                status="verified"
                expert="Alex Chen (Security Lead)"
                details="Principles align with current security standards"
              />
              <TechnicalItem
                section="API Authentication"
                status="needs-review"
                expert="Unassigned"
                details="Needs review by API team"
              />
              <TechnicalItem
                section="Accessibility Guidelines"
                status="verified"
                expert="Jamie Rodriguez (UX Lead)"
                details="Verified against WCAG 2.1 standards"
              />
              <TechnicalItem
                section="Performance Metrics"
                status="needs-update"
                expert="Taylor Kim (Performance Engineer)"
                details="Metrics need updating to reflect new benchmarks"
              />
            </div>

            <div className="pt-2">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Request Expert Review</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
          <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
            <CardTitle className="text-lg flex items-center">
              <Link className="h-5 w-5 mr-2 text-indigo-400" />
              Cross-Reference Validation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <CrossReferenceItem
                document="API Authentication Guide"
                status="valid"
                references={3}
                details="All references are up-to-date"
              />
              <CrossReferenceItem
                document="User Permissions Overview"
                status="outdated"
                references={1}
                details="Referenced document has been updated"
              />
              <CrossReferenceItem
                document="Security Best Practices"
                status="valid"
                references={2}
                details="All references are up-to-date"
              />
              <CrossReferenceItem
                document="Accessibility Standards"
                status="broken"
                references={1}
                details="Referenced document has been moved or deleted"
              />
            </div>

            <div className="pt-2">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Fix All References</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
          <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-indigo-400" />
              Moderation Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Document Health Score</h3>
              <div className="flex items-center gap-3">
                <Progress value={88} className="h-2 flex-1" />
                <span className="text-sm font-medium">88/100</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Moderation History</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Initial review by Jamie Chen</span>
                  <span className="text-indigo-300">2 days ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Technical verification by Alex Morgan</span>
                  <span className="text-indigo-300">1 day ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sensitivity check by System</span>
                  <span className="text-indigo-300">4 hours ago</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recommended Actions</h3>
              <ul className="space-y-2 text-sm text-indigo-300">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Update cross-references to User Permissions Overview</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Request API team review for authentication section</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sensitivity score is excellent, no changes needed</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SensitivityItem({ label, score, issues, details }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{score}/100</span>
          {issues > 0 && (
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
              {issues} {issues === 1 ? "issue" : "issues"}
            </Badge>
          )}
        </div>
      </div>
      <div className="h-1.5 bg-indigo-900/50 rounded-full">
        <div className={`h-1.5 ${getScoreColor(score)} rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      <p className="text-xs text-indigo-300">{details}</p>
    </div>
  )
}

function TerminologyItem({ term, status, occurrences, suggestion }) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "consistent":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: "text-green-400" }
      case "flagged":
        return { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, className: "text-yellow-400" }
      case "inconsistent":
        return { icon: <XCircle className="h-4 w-4 text-red-500" />, className: "text-red-400" }
      default:
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: "text-green-400" }
    }
  }

  const statusDetails = getStatusDetails(status)

  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">{statusDetails.icon}</div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="text-sm font-medium">{term}</span>
          <span className="text-xs text-indigo-300">
            {occurrences} {occurrences === 1 ? "occurrence" : "occurrences"}
          </span>
        </div>
        {suggestion && <div className={`text-xs ${statusDetails.className}`}>Suggested alternative: {suggestion}</div>}
      </div>
    </div>
  )
}

function CitationItem({ source, status, link, details }) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "verified":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: "text-green-400" }
      case "unverified":
        return { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, className: "text-yellow-400" }
      case "invalid":
        return { icon: <XCircle className="h-4 w-4 text-red-500" />, className: "text-red-400" }
      default:
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: "text-green-400" }
    }
  }

  const statusDetails = getStatusDetails(status)

  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">{statusDetails.icon}</div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="text-sm font-medium">{source}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 p-0 px-1 text-indigo-300 hover:text-white hover:bg-indigo-700/30"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            <span className="text-xs">View</span>
          </Button>
        </div>
        <div className="text-xs text-indigo-300">{link}</div>
        <div className={`text-xs ${statusDetails.className}`}>{details}</div>
      </div>
    </div>
  )
}

function TechnicalItem({ section, status, expert, details }) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "verified":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: "text-green-400" }
      case "needs-review":
        return { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, className: "text-yellow-400" }
      case "needs-update":
        return { icon: <AlertCircle className="h-4 w-4 text-orange-500" />, className: "text-orange-400" }
      case "incorrect":
        return { icon: <XCircle className="h-4 w-4 text-red-500" />, className: "text-red-400" }
      default:
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: "text-green-400" }
    }
  }

  const statusDetails = getStatusDetails(status)

  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">{statusDetails.icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium">{section}</div>
        <div className="text-xs text-indigo-300">Expert: {expert}</div>
        <div className={`text-xs ${statusDetails.className}`}>{details}</div>
      </div>
    </div>
  )
}

function CrossReferenceItem({ document, status, references, details }) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "valid":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: "text-green-400" }
      case "outdated":
        return { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, className: "text-yellow-400" }
      case "broken":
        return { icon: <XCircle className="h-4 w-4 text-red-500" />, className: "text-red-400" }
      default:
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: "text-green-400" }
    }
  }

  const statusDetails = getStatusDetails(status)

  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">{statusDetails.icon}</div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="text-sm font-medium">{document}</span>
          <span className="text-xs text-indigo-300">
            {references} {references === 1 ? "reference" : "references"}
          </span>
        </div>
        <div className={`text-xs ${statusDetails.className}`}>{details}</div>
      </div>
    </div>
  )
}

