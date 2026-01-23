'use client';

import { Sparkles, Command, ArrowUp, Loader2, Bot, User, Trash2, RefreshCw } from "lucide-react";
import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

export function RightPanel() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, reload, stop } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const suggestedPrompts = [
    "总结我最新的笔记",
    "帮我优化产品文档",
    "分析当前技术栈",
    "生成下周工作计划"
  ];

  const handlePromptClick = (prompt: string) => {
    const event = {
      target: { value: prompt }
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(event);
    // Automatically submit after a short delay to allow state update? 
    // Actually handleInputChange just updates input value. 
    // We can't easily auto-submit with just handleInputChange without a custom form submission logic or using append from useChat.
    // But append adds a message directly.
    // Let's just set the input for now, user clicks send.
    // OR better: use append from useChat if we want immediate send.
    // But let's just populate input for better UX control.
    if (inputRef.current) {
      inputRef.current.value = prompt;
      inputRef.current.focus();
      // Trigger change event manually for React hook form if needed, but here we use simple value binding
      // wait, handleInputChange needs an event. 
      // Let's just manually call the setter if exposed? useChat doesn't expose setInput.
      // We have to simulate the event.
    }
  };
  
  // Custom submit handler to allow "Enter" key
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-4">
      {/* AI Assistant Section */}
      <div className={cn(
        "flex-1 flex flex-col min-h-[400px] rounded-2xl border transition-all duration-300 overflow-hidden",
        isInputFocused 
          ? "border-purple-500/30 bg-zinc-900/40 shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]" 
          : "border-zinc-800/50 bg-zinc-900/20"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-200">AI 助手</span>
              <span className="text-[10px] text-zinc-500">DeepSeek V3 powered</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isLoading ? (
               <button onClick={() => stop()} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors" title="停止生成">
                 <div className="w-2.5 h-2.5 bg-current rounded-sm" />
               </button>
            ) : messages.length > 0 && (
               <button onClick={() => reload()} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors" title="重新生成">
                 <RefreshCw size={14} />
               </button>
            )}
            {messages.length > 0 && (
              <button 
                onClick={handleClearChat}
                className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="清空对话"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center mb-2">
                <Bot size={32} className="text-purple-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-medium text-zinc-200">有什么可以帮你的吗？</h3>
                <p className="text-xs text-zinc-500 max-w-[200px] mx-auto">我可以帮你整理笔记、分析项目结构或回答技术问题。</p>
              </div>
              
              <div className="grid grid-cols-1 gap-2 w-full max-w-[240px]">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-xs text-left px-3 py-2.5 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/80 border border-zinc-800/50 hover:border-purple-500/30 text-zinc-400 hover:text-zinc-200 transition-all duration-200 truncate"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border",
                    m.role === 'user' 
                      ? "bg-zinc-800 border-zinc-700" 
                      : "bg-purple-500/10 border-purple-500/20"
                  )}>
                    {m.role === 'user' ? (
                      <User size={14} className="text-zinc-400" />
                    ) : (
                      <Sparkles size={14} className="text-purple-400" />
                    )}
                  </div>
                  
                  <div className={cn(
                    "flex flex-col max-w-[85%]",
                    m.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-3 py-2 rounded-2xl text-sm leading-relaxed",
                      m.role === 'user'
                        ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                        : "bg-zinc-900/50 text-zinc-300 rounded-tl-sm border border-zinc-800/50"
                    )}>
                      {m.role === 'user' ? (
                        m.content
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({children}) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            code: ({node, className, children, ...props}) => {
                              const match = /language-(\w+)/.exec(className || '')
                              return match ? (
                                <div className="rounded-md bg-black/50 border border-zinc-800 p-2 my-2 text-xs font-mono overflow-x-auto">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </div>
                              ) : (
                                <code className="bg-zinc-800/50 px-1 py-0.5 rounded text-xs font-mono text-purple-300" {...props}>
                                  {children}
                                </code>
                              )
                            },
                            ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-zinc-300">{children}</li>,
                            h1: ({children}) => <h1 className="text-base font-bold text-zinc-100 mb-2 mt-3">{children}</h1>,
                            h2: ({children}) => <h2 className="text-sm font-bold text-zinc-100 mb-2 mt-3">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-bold text-zinc-100 mb-1 mt-2">{children}</h3>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-purple-500/50 pl-3 py-1 my-2 bg-purple-500/5 text-zinc-400 italic">{children}</blockquote>,
                            a: ({children, href}) => <a href={href} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">{children}</a>
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                 <Loader2 size={14} className="text-purple-400 animate-spin" />
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                 <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-zinc-900/30 border-t border-zinc-800/50 backdrop-blur-sm">
           <form 
             onSubmit={handleSubmit} 
             className={cn(
               "relative flex items-center bg-zinc-950/80 border rounded-xl transition-all duration-200",
               isInputFocused ? "border-purple-500/50 shadow-sm" : "border-zinc-800 hover:border-zinc-700"
             )}
           >
              <input 
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={onKeyDown}
                placeholder="问点什么... (Enter 发送)" 
                className="w-full bg-transparent border-none py-3 pl-4 pr-10 text-sm text-zinc-200 focus:ring-0 placeholder:text-zinc-600"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                  "absolute right-2 p-1.5 rounded-lg transition-all duration-200",
                  input.trim() 
                    ? "bg-purple-500 text-white hover:bg-purple-600 shadow-[0_0_10px_-2px_rgba(168,85,247,0.5)]" 
                    : "bg-transparent text-zinc-600 cursor-not-allowed"
                )}
              >
                <ArrowUp size={16} />
              </button>
           </form>
           <div className="mt-2 flex items-center justify-center">
             <span className="text-[10px] text-zinc-600 flex items-center gap-1">
               <span className="inline-block w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50"></span>
               AI Ready
             </span>
           </div>
        </div>
      </div>

      {/* Intelligent Navigation (Raycast-like List) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-zinc-400 px-1">
          <Command size={16} />
          <span className="text-sm font-medium">快捷访问</span>
        </div>
        
        <div className="flex flex-col gap-1">
          {[
            { label: "技术栈", tag: "Tech", hotkey: "S" },
            { label: "阅读清单", tag: "Learning", hotkey: "R" },
            { label: "项目灵感", tag: "Drafts", hotkey: "P" },
            { label: "系统状态", tag: "Monitor", hotkey: "M" },
          ].map((item) => (
            <button 
              key={item.label}
              className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:bg-zinc-800/50 hover:border-zinc-800 group transition-all duration-200 text-left"
            >
              <span className="text-sm text-zinc-300 group-hover:text-white font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                  {item.tag}
                </span>
                <span className="text-xs text-zinc-500 font-mono w-5 h-5 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 group-hover:text-zinc-300 transition-colors">
                  {item.hotkey}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
