import React, { useState } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { File, Folder, ChevronRight, ChevronDown, AlignLeft, Users } from 'lucide-react';
import { FileNode } from '../types';
import { cn } from '../lib/utils';

function TreeNode({ node, depth = 0 }: { node: FileNode, depth?: number }) {
  const [isOpen, setIsOpen] = useState(node.isOpen !== false);
  const isFolder = node.type === 'folder';

  return (
    <div className="select-none">
      <div 
        className="flex items-center space-x-1.5 py-1 px-2 hover:bg-gray-800/50 cursor-pointer rounded-sm text-sm"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          isOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
        ) : (
          <span className="w-3.5 h-3.5 shrink-0" /> // spacer
        )}
        
        {isFolder ? (
          <Folder className="w-4 h-4 text-blue-400 shrink-0" />
        ) : (
          <File className="w-4 h-4 text-gray-400 shrink-0" />
        )}
        
        <span className={cn(
          "truncate",
          isFolder ? "text-gray-300" : "text-gray-400 hover:text-gray-200"
        )}>
          {node.name}
        </span>
      </div>

      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTreeSidebar() {
  const { fileTree, activeAgents } = useSimulation();

  return (
    <div className="w-64 h-full border-l border-gray-800 bg-gray-900/50 flex flex-col">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-gray-800/50">
          <AlignLeft className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {fileTree.map(node => (
            <TreeNode key={node.id} node={node} />
          ))}
        </div>
      </div>
      
      {/* Active Participants display */}
      <div className="flex flex-col h-1/3 border-t border-gray-800 bg-gray-900 overflow-hidden shrink-0">
         <div className="flex items-center px-4 py-3 border-b border-gray-800/50 bg-gray-900/90 z-10">
           <Users className="w-4 h-4 text-gray-500 mr-2" />
           <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Agents</span>
         </div>
         <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeAgents.map(agent => (
              <div key={agent.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800/50 transition-colors">
                 <div className="flex flex-col">
                    <span className="text-sm text-gray-300 font-medium">{agent.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{agent.role}</span>
                 </div>
                 <div className="flex flex-col items-end right-2">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full mb-1",
                      agent.status === 'idle' ? "bg-gray-600" :
                      agent.status === 'working' ? "bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" :
                      "bg-yellow-500"
                    )} />
                    <span className="text-[9px] text-gray-600 uppercase font-mono">{agent.status}</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
