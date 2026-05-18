import React, { useState, useRef } from 'react';
import { Send, User, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function ArchitectChat() {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 flex flex-col border-r border-gray-800 bg-gray-900 h-full relative">
      <div className="h-10 border-b border-gray-800 flex items-center px-4 shrink-0 bg-gray-900/90 z-10">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Architect Chat</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="text-sm text-gray-500 italic text-center mt-12">
          <Cpu className="w-8 h-8 mx-auto mb-3 opacity-30" />
          Chat requires backend integration. Coming in a future phase.
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="p-4 shrink-0 bg-gray-900">
        <form className="relative flex items-center">
          <input 
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2.5 pl-4 pr-12 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500"
            placeholder="Describe what you want to build..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-1.5 rounded bg-blue-600 text-white disabled:bg-gray-700 disabled:text-gray-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
