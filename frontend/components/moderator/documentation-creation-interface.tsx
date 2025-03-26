"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Editor } from "@/components/ui/editor"
import { Badge } from "@/components/ui/badge"

export function DocumentationCreationInterface() {
  const [content, setContent] = useState("")
  const [activeTab, setActiveTab] = useState("edit")

  return (
    <Card className="bg-white text-gray-900">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Create New Documentation</span>
          <Badge variant="outline">Auto-saving...</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Editor content={content} onChange={setContent} />
          </TabsContent>
          <TabsContent value="preview">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          </TabsContent>
          <TabsContent value="history">
            <p>Version history will be displayed here.</p>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </CardContent>
    </Card>
  )
}

