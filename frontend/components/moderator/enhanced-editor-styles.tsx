"use client"

export function EnhancedEditorStyles() {
  return (
    <style jsx global>{`
      /* Base Editor Styles */
      .enhanced-editor {
        --editor-bg: rgba(30, 27, 75, 0.4);
        --editor-border: rgba(139, 92, 246, 0.3);
        --editor-text: rgba(255, 255, 255, 0.9);
        --editor-accent: rgba(139, 92, 246, 0.8);
        --editor-highlight: rgba(124, 58, 237, 0.5);
        --editor-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        --editor-glow: 0 0 20px rgba(139, 92, 246, 0.3);
        --editor-glass: rgba(30, 27, 75, 0.7);
        
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Glass Morphism */
      .glass-panel {
        background: rgba(30, 27, 75, 0.4);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: 0.5rem;
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .glass-panel:hover {
        box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.4);
        border-color: rgba(139, 92, 246, 0.4);
      }
      
      .glass-panel.focused {
        border-color: rgba(139, 92, 246, 0.6);
        box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 92, 246, 0.3);
      }
      
      /* Animated Buttons */
      .animated-button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .animated-button:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(139, 92, 246, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s ease, height 0.6s ease;
      }
      
      .animated-button:hover:before {
        width: 300%;
        height: 300%;
      }
      
      .animated-button:active {
        transform: scale(0.97);
      }
      
      /* Magnetic Hover */
      .magnetic-button {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Floating Elements */
      .floating-element {
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      /* Parallax Layers */
      .parallax-container {
        perspective: 1000px;
        overflow: hidden;
      }
      
      .parallax-layer-1 {
        transform: translateZ(-10px) scale(2);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .parallax-layer-2 {
        transform: translateZ(-5px) scale(1.5);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .parallax-layer-3 {
        transform: translateZ(0) scale(1);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Animated Gradients */
      .animated-gradient {
        background: linear-gradient(-45deg, #6366f1, #8b5cf6, #d946ef, #ec4899);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Glow Effects */
      .glow-text {
        text-shadow: 0 0 10px rgba(139, 92, 246, 0.7);
      }
      
      .glow-border {
        box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
      }
      
      /* Pulse Animation */
      .pulse {
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      /* Typing Effect */
      .typing-effect::after {
        content: '|';
        animation: blink 1s step-end infinite;
      }
      
      @keyframes blink {
        from, to { opacity: 1; }
        50% { opacity: 0; }
      }
      
      /* Success Animation */
      .success-animation {
        position: relative;
      }
      
      .success-animation::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(72, 187, 120, 0.7) 0%, rgba(72, 187, 120, 0) 70%);
        opacity: 0;
        transform: scale(0);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .success-animation.active::before {
        opacity: 1;
        transform: scale(1.5);
      }
      
      /* Custom Scrollbar */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(30, 27, 75, 0.2);
        border-radius: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.4);
        border-radius: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(139, 92, 246, 0.6);
      }
      
      /* Progress Indicators */
      .liquid-progress {
        position: relative;
        overflow: hidden;
      }
      
      .liquid-progress::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, rgba(139, 92, 246, 0.7), rgba(124, 58, 237, 0.9));
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Tooltip System */
      .enhanced-tooltip {
        position: relative;
      }
      
      .enhanced-tooltip::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        padding: 0.5rem 1rem;
        background: rgba(30, 27, 75, 0.9);
        color: white;
        border-radius: 0.25rem;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 10;
      }
      
      .enhanced-tooltip:hover::before {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
      }
      
      /* Editor Content Styles */
      .enhanced-editor .ProseMirror {
        min-height: 400px;
        outline: none;
        color: var(--editor-text);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror p {
        margin-bottom: 1em;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror p:hover {
        text-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
      }
      
      .enhanced-editor .ProseMirror h1,
      .enhanced-editor .ProseMirror h2,
      .enhanced-editor .ProseMirror h3 {
        font-weight: bold;
        margin-bottom: 0.5em;
        margin-top: 1em;
        color: rgba(255, 255, 255, 0.95);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror h1 {
        font-size: 1.75em;
        text-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
      }
      
      .enhanced-editor .ProseMirror h2 {
        font-size: 1.5em;
        text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
      }
      
      .enhanced-editor .ProseMirror h3 {
        font-size: 1.25em;
        text-shadow: 0 0 6px rgba(139, 92, 246, 0.2);
      }
      
      .enhanced-editor .ProseMirror ul,
      .enhanced-editor .ProseMirror ol {
        padding-left: 1.5em;
        margin-bottom: 1em;
      }
      
      .enhanced-editor .ProseMirror ul {
        list-style-type: none;
      }
      
      .enhanced-editor .ProseMirror ul li {
        position: relative;
        padding-left: 0.5em;
      }
      
      .enhanced-editor .ProseMirror ul li::before {
        content: '•';
        position: absolute;
        left: -1em;
        color: rgba(139, 92, 246, 0.8);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror ul li:hover::before {
        color: rgba(139, 92, 246, 1);
        text-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
      }
      
      .enhanced-editor .ProseMirror ol {
        list-style-type: decimal;
      }
      
      .enhanced-editor .ProseMirror img {
        max-width: 100%;
        height: auto;
        margin: 1em 0;
        border-radius: 0.5rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror img:hover {
        transform: scale(1.01);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 10px rgba(139, 92, 246, 0.4);
      }
      
      .enhanced-editor .ProseMirror blockquote {
        border-left: 3px solid rgba(139, 92, 246, 0.6);
        padding-left: 1em;
        margin-left: 0;
        margin-right: 0;
        font-style: italic;
        color: rgba(255, 255, 255, 0.8);
        background: rgba(139, 92, 246, 0.1);
        border-radius: 0 0.25rem 0.25rem 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror blockquote:hover {
        border-left-color: rgba(139, 92, 246, 1);
        background: rgba(139, 92, 246, 0.15);
        box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
      }
      
      .enhanced-editor .ProseMirror pre {
        background-color: rgba(30, 41, 59, 0.8);
        color: #e2e8f0;
        padding: 0.75em 1em;
        border-radius: 0.375em;
        overflow-x: auto;
        margin: 1em 0;
        border: 1px solid rgba(139, 92, 246, 0.3);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror pre:hover {
        border-color: rgba(139, 92, 246, 0.6);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 10px rgba(139, 92, 246, 0.3);
      }
      
      .enhanced-editor .ProseMirror code {
        background-color: rgba(30, 41, 59, 0.6);
        color: #e2e8f0;
        padding: 0.2em 0.4em;
        border-radius: 0.25em;
        font-family: monospace;
        border: 1px solid rgba(139, 92, 246, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror code:hover {
        background-color: rgba(30, 41, 59, 0.8);
        border-color: rgba(139, 92, 246, 0.4);
        box-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
      }
      
      .enhanced-editor .ProseMirror a {
        color: rgba(139, 92, 246, 0.9);
        text-decoration: none;
        border-bottom: 1px dashed rgba(139, 92, 246, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .enhanced-editor .ProseMirror a:hover {
        color: rgba(139, 92, 246, 1);
        border-bottom: 1px solid rgba(139, 92, 246, 0.8);
        text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
      }
      
      /* Cursor Styles */
      .cursor-default {
        cursor: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 2L17 12L7 22' stroke='%238b5cf6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E"), auto;
      }
      
      .cursor-text {
        cursor: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17 12H7M12 7V17' stroke='%238b5cf6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E"), text;
      }
      
      .cursor-pointer {
        cursor: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 5V19M5 12H19' stroke='%238b5cf6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E"), pointer;
      }
      
      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  )
}

