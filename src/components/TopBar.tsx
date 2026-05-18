import React, { useState } from 'react';
import { Settings, Network } from 'lucide-react';
import { AVAILABLE_PROVIDERS } from '../services/SimulatedBackendService';

export function TopBar() {
  const [plannerProvider, setPlannerProvider] = useState(AVAILABLE_PROVIDERS[1]);
  const [plannerModel, setPlannerModel] = useState(AVAILABLE_PROVIDERS[1].models[0]);
  
  const [coderProvider, setCoderProvider] = useState(AVAILABLE_PROVIDERS[0]);
  const [coderModel, setCoderModel] = useState(AVAILABLE_PROVIDERS[0].models[0]);

  return (
    <div className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4 text-sm text-gray-300">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold tracking-tighter">
          NX
        </div>
        <span className="font-semibold text-gray-100 tracking-wide">NEXUS DUALITY <span className="text-gray-500 font-normal">LOSM Operator</span></span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Planner Actor Selector */}
        <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
          <Network className="w-4 h-4 text-purple-400" />
          <span className="text-gray-400 text-xs uppercase tracking-wider">Planner Base</span>
          <select 
            className="bg-transparent text-gray-200 outline-none cursor-pointer"
            value={plannerProvider.id}
            onChange={(e) => {
              const p = AVAILABLE_PROVIDERS.find(x => x.id === e.target.value)!;
              setPlannerProvider(p);
              setPlannerModel(p.models[0]);
            }}
          >
            {AVAILABLE_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span className="text-gray-600">/</span>
          <select 
            className="bg-transparent text-gray-200 outline-none cursor-pointer max-w-[120px] truncate"
            value={plannerModel}
            onChange={(e) => setPlannerModel(e.target.value)}
          >
            {plannerProvider.models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Builder Actor Selector */}
        <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
          <Network className="w-4 h-4 text-green-400" />
          <span className="text-gray-400 text-xs uppercase tracking-wider">Coder Base</span>
          <select 
            className="bg-transparent text-gray-200 outline-none cursor-pointer"
            value={coderProvider.id}
            onChange={(e) => {
              const p = AVAILABLE_PROVIDERS.find(x => x.id === e.target.value)!;
              setCoderProvider(p);
              setCoderModel(p.models[0]);
            }}
          >
            {AVAILABLE_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span className="text-gray-600">/</span>
          <select 
            className="bg-transparent text-gray-200 outline-none cursor-pointer max-w-[120px] truncate"
            value={coderModel}
            onChange={(e) => setCoderModel(e.target.value)}
          >
            {coderProvider.models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Settings className="w-5 h-5 text-gray-400 hover:text-gray-200 cursor-pointer" />
      </div>
    </div>
  );
}
