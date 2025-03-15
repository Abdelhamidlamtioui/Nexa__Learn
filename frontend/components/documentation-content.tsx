import { useState } from "react"
import { Copy, Play, Maximize2, ChevronDown, ChevronUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function DocumentationContent() {
  const [codeOutput, setCodeOutput] = useState("")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [foldedSections, setFoldedSections] = useState<number[]>([])
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({})

  const runCode = () => {
    // Simulating code execution
    setCodeOutput("Hello, World!")
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const toggleFoldSection = (index: number) => {
    setFoldedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const copyCode = (index: number, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedStates({ ...copiedStates, [index]: true })
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [index]: false })
    }, 2000)
  }

  return (
    <div
      className={`max-w-3xl mx-auto ${isFullScreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-auto" : ""}`}
    >
      <h1 className="text-4xl font-bold mb-6 text-primary-end">Getting Started with React</h1>
      <p className="mb-4 text-lg leading-relaxed">
        React is a popular JavaScript library for building user interfaces. This guide will help you get started with
        React development.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-secondary-end">Installation</h2>
      <p className="mb-4 text-lg leading-relaxed">
        To start using React, you need to set up a new project. The easiest way to do this is by using Create React App.
      </p>
      <Card className="bg-code-background dark:bg-code-background p-4 mb-6 overflow-hidden floating-effect gradient-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold bg-primary-start text-white px-2 py-1 rounded-full glow-effect">
            bash
          </span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyCode(0, "npx create-react-app my-app\ncd my-app\nnpm start")}
              className="glow-effect"
            >
              {copiedStates[0] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <pre className="text-sm overflow-x-auto">
          <code>npx create-react-app my-app cd my-app npm start</code>
        </pre>
      </Card>
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-secondary-end">Your First Component</h2>
      <p className="mb-4 text-lg leading-relaxed">Let's create a simple React component:</p>
      <Card className="bg-code-background dark:bg-code-background p-4 mb-6 overflow-hidden floating-effect gradient-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold bg-primary-start text-white px-2 py-1 rounded-full glow-effect">
            jsx
          </span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={runCode} className="glow-effect">
              <Play className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyCode(
                  1,
                  `import React from 'react';\n\nfunction HelloWorld() {\n  return <h1>Hello, World!</h1>;\n}\n\nexport default HelloWorld;`,
                )
              }
              className="glow-effect"
            >
              {copiedStates[1] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullScreen} className="glow-effect">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <pre className="text-sm overflow-x-auto">
          <code>
            {`import React from 'react';

function HelloWorld() {
  return <h1>Hello, World!</h1>;
}

export default HelloWorld;`}
          </code>
        </pre>
      </Card>
      {codeOutput && (
        <Card className="bg-highlight dark:bg-highlight p-4 mb-6 floating-effect">
          <h3 className="text-sm font-semibold mb-2">Output:</h3>
          <p>{codeOutput}</p>
        </Card>
      )}
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-secondary-end">Props and State</h2>
      <p className="mb-4 text-lg leading-relaxed">
        React components can accept inputs, called props, and maintain internal state. Let's explore these concepts:
      </p>
      <Card className="bg-code-background dark:bg-code-background p-4 mb-6 overflow-hidden floating-effect gradient-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold bg-primary-start text-white px-2 py-1 rounded-full glow-effect">
            jsx
          </span>
          <Button variant="ghost" size="sm" onClick={() => toggleFoldSection(0)} className="glow-effect">
            {foldedSections.includes(0) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
        {!foldedSections.includes(0) && (
          <pre className="text-sm overflow-x-auto">
            <code>
              {`import React, { useState } from 'react';

function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;`}
            </code>
          </pre>
        )}
      </Card>
      <p className="mb-4 text-lg leading-relaxed">
        In this example, <code className="bg-code-background dark:bg-code-background px-1 rounded">initialCount</code>{" "}
        is a prop passed to the <code className="bg-code-background dark:bg-code-background px-1 rounded">Counter</code>{" "}
        component, and <code className="bg-code-background dark:bg-code-background px-1 rounded">count</code> is a state
        variable managed within the component.
      </p>
    </div>
  )
}

