import React, { useRef } from 'react';
import { Activity } from 'lucide-react';

export function BuilderStream() {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 flex flex-col border-r border-gray-800 bg-[#0d1117] h-full relative font-mono">
      <div className="h-10 border-b border-gray-800 flex items-center px-4 shrink-0 bg-gray-900/90 z-10">
        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Builder Stream</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-3">
          <Activity className="w-8 h-8 opacity-20" />
          <p className="uppercase tracking-widest text-[10px]">Builder Stream requires backend integration</p>
        </div>
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
