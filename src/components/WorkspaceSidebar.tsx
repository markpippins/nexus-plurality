import React, { useState } from 'react';
import { FolderKanban, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export function WorkspaceSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="w-12 h-full border-r border-gray-800 bg-gray-900/50 flex flex-col items-center py-4 cursor-pointer" onClick={() => setCollapsed(false)}>
        <ChevronRight className="w-5 h-5 text-gray-400 mb-4" />
        <FolderKanban className="w-5 h-5 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-64 h-full border-r border-gray-800 bg-gray-900/50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/20 cursor-pointer" onClick={() => setCollapsed(true)}>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspaces</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs text-gray-500 italic">Workspaces require backend integration. Coming in a future phase.</p>
      </div>
    </div>
  );
}
