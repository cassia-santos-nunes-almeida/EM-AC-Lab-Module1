import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ChatMessage } from '@/types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are a Socratic physics tutor embedded in the EM&AC Lab, an interactive simulation tool for Electromagnetism and AC Circuit Analysis.

ABSOLUTE RULE — Never give a direct numerical answer or solve a problem for the student. Instead, guide them to discover the answer themselves.

Your method:
1. When a student asks a question, respond with a focused counter-question that isolates the key concept they need.
2. Acknowledge correct reasoning with brief encouragement, then ask the next logical question to deepen understanding.
3. When a student is stuck, offer a small conceptual hint (not a procedural one) and follow up with another question.
4. If a student asks you to "just tell me the answer", kindly explain that working through it themselves builds stronger understanding, then offer a simpler sub-question to get them started.
5. Reference the interactive simulations in the app — suggest specific parameters to try (e.g., "What happens in the Coulomb simulation when you drag a charge closer?").

Topics you cover: Maxwell's equations, Coulomb's law, Gauss's law, Ampère's law, Lorentz force, Faraday's law, Lenz's law, EM waves, polarization, and AC circuits.

Use LaTeX notation for math when helpful. Keep responses concise (2-3 short paragraphs max). Use bullet points sparingly.`;

interface AiTutorProps {
  moduleContext?: string;
}

export function AiTutor({ moduleContext }: AiTutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
    setShowKeyInput(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const contextPrefix = moduleContext
        ? `[Student is currently viewing the ${moduleContext} module]\n\n`
        : '';

      const history = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            ...history,
            { role: 'user', parts: [{ text: contextPrefix + userMessage.content }] },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantText, timestamp: Date.now() },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${errorMessage}. Please check your API key and try again.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-engineering-blue-600 hover:bg-engineering-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        aria-label="Open Think it Through"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-engineering-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <div>
            <h3 className="text-sm font-bold">Think it Through</h3>
            <p className="text-[10px] opacity-80">Powered by Google Gemini</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-xs"
            aria-label="Toggle API key settings"
          >
            ⚙
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Close Think it Through"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* API Key input */}
      {showKeyInput && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              Enter your Google Gemini API key. Get one free at{' '}
              <span className="font-mono">aistudio.google.com</span>. Key is stored locally only.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              aria-label="Google Gemini API key"
              className="flex-1 px-2 py-1.5 text-xs rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            />
            <button
              onClick={() => saveApiKey(apiKey)}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded font-semibold hover:bg-amber-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <Bot size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hi! I won't give you answers directly — instead I'll ask questions that help you figure it out yourself. Ready?
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                "Explain Faraday's law",
                'What is polarization?',
                'Why F = qv × B?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                  }}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-engineering-blue-50 dark:hover:bg-engineering-blue-900/20 hover:text-engineering-blue-600 dark:hover:text-engineering-blue-400 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <Bot size={18} className="text-engineering-blue-500 shrink-0 mt-1" />
            )}
            <div
              className={cn(
                'max-w-[80%] p-2.5 rounded-xl text-xs leading-relaxed',
                msg.role === 'user'
                  ? 'bg-engineering-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-bl-sm'
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
            {msg.role === 'user' && (
              <User size={18} className="text-slate-400 shrink-0 mt-1" />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <Bot size={18} className="text-engineering-blue-500 shrink-0 mt-1" />
            <div className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-xl rounded-bl-sm">
              <Loader2 size={16} className="animate-spin text-engineering-blue-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about EM concepts..."
            aria-label="Type your question"
            rows={1}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:border-engineering-blue-500 dark:focus:border-engineering-blue-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={cn(
              'p-2 rounded-lg transition-colors',
              input.trim() && !isLoading
                ? 'bg-engineering-blue-600 text-white hover:bg-engineering-blue-700'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
