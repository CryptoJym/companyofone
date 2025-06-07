'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageCircle, 
  FiSend, 
  FiX, 
  FiMinimize2, 
  FiMaximize2,
  FiBrain,
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiTarget,
  FiSettings,
  FiLightbulb
} from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: BusinessCategory;
  confidence?: number;
}

export type BusinessCategory = 
  | 'strategy'
  | 'marketing'
  | 'finance'
  | 'productivity'
  | 'growth'
  | 'operations'
  | 'general';

interface AIResponse {
  response: string;
  category: BusinessCategory;
  confidence: number;
  suggestions?: string[];
  sessionId: string;
  messageId: string;
}

interface AIBusinessAssistantProps {
  className?: string;
}

const categoryIcons: Record<BusinessCategory, React.ReactNode> = {
  strategy: <FiTarget className="w-3 h-3" />,
  marketing: <FiTrendingUp className="w-3 h-3" />,
  finance: <FiDollarSign className="w-3 h-3" />,
  productivity: <FiClock className="w-3 h-3" />,
  growth: <FiTrendingUp className="w-3 h-3" />,
  operations: <FiSettings className="w-3 h-3" />,
  general: <FiBrain className="w-3 h-3" />
};

const categoryColors: Record<BusinessCategory, string> = {
  strategy: 'bg-purple-100 text-purple-700 border-purple-200',
  marketing: 'bg-blue-100 text-blue-700 border-blue-200',
  finance: 'bg-green-100 text-green-700 border-green-200',
  productivity: 'bg-orange-100 text-orange-700 border-orange-200',
  growth: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  operations: 'bg-gray-100 text-gray-700 border-gray-200',
  general: 'bg-slate-100 text-slate-700 border-slate-200'
};

export const AIBusinessAssistant: React.FC<AIBusinessAssistantProps> = ({ 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data: { success: boolean; data: AIResponse } = await response.json();
      
      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: data.data.messageId,
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
          category: data.data.category,
          confidence: data.data.confidence
        };

        setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
        setSuggestions(data.data.suggestions || []);
        
        if (!sessionId) {
          setSessionId(data.data.sessionId);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        category: 'general'
      };
      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    setSuggestions([]);
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/💡 \*\*(.*?)\*\*/g, '💡 <strong class="text-yellow-600">$1</strong>')
      .replace(/🎯 \*\*(.*?)\*\*/g, '🎯 <strong class="text-blue-600">$1</strong>');
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
        >
          <FiMessageCircle className="w-8 h-8" />
        </Button>
        <div className="absolute -top-12 right-0 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          AI Business Assistant
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className={`fixed bottom-6 right-6 z-50 ${className}`}
    >
      <Card className={`w-96 h-[600px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm ${isMinimized ? 'h-16' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <FiBrain className="w-5 h-5" />
            <div>
              <h3 className="font-semibold text-sm">AI Business Assistant</h3>
              {!isMinimized && <p className="text-xs opacity-90">Your solopreneur success partner</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 h-8 w-8 text-white hover:bg-white/20"
            >
              {isMinimized ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-1 h-8 w-8 text-white hover:bg-white/20"
            >
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <FiLightbulb className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                  <h4 className="font-semibold text-gray-800 mb-2">Welcome to your AI Business Assistant!</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    I'm here to help you with business strategy, marketing, finance, productivity, and growth advice.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => sendMessage("How do I price my services?")}
                      className="p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                    >
                      💰 Pricing strategy
                    </button>
                    <button
                      onClick={() => sendMessage("How do I build an email list?")}
                      className="p-2 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                    >
                      📧 Email marketing
                    </button>
                    <button
                      onClick={() => sendMessage("How do I stay productive as a solopreneur?")}
                      className="p-2 text-left bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
                    >
                      ⚡ Productivity tips
                    </button>
                    <button
                      onClick={() => sendMessage("How do I scale my business?")}
                      className="p-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                    >
                      📈 Growth strategies
                    </button>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.role === 'assistant' && message.category && (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${categoryColors[message.category]}`}
                          >
                            {categoryIcons[message.category]}
                            <span className="ml-1 capitalize">{message.category}</span>
                          </Badge>
                          {message.confidence && (
                            <span className="text-xs text-gray-500">
                              {Math.round(message.confidence * 100)}% confident
                            </span>
                          )}
                        </div>
                      )}
                      <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessageContent(message.content) 
                        }}
                      />
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-600 mb-2">Suggested questions:</div>
                <div className="flex flex-wrap gap-1">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                  placeholder="Ask me anything about business..."
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                  className="px-3"
                >
                  <FiSend className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};