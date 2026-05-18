import { useEffect, useState } from 'react';
import { BackendService } from '../services/SimulatedBackendService';
import { FileNode, WorkRequest, PlanIR, CritiqueIR, SpecIR, ExecutionIR, ValidationIR, ActiveAgent } from '../types';

export function useSimulation() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>([]);
  const [activeWorkRequest, setActiveWorkRequest] = useState<WorkRequest | null>(null);
  const [planIR, setPlanIR] = useState<PlanIR | null>(null);
  const [critiqueIR, setCritiqueIR] = useState<CritiqueIR | null>(null);
  const [specIR, setSpecIR] = useState<SpecIR | null>(null);
  const [executionIR, setExecutionIR] = useState<ExecutionIR | null>(null);
  const [validationIR, setValidationIR] = useState<ValidationIR | null>(null);
  const [activeAgents, setActiveAgents] = useState<ActiveAgent[]>([]);

  useEffect(() => {
    const subs = [
      BackendService.fileTree$.subscribe(setFileTree),
      BackendService.workRequests$.subscribe(setWorkRequests),
      BackendService.activeWorkRequest$.subscribe(setActiveWorkRequest),
      BackendService.planIR$.subscribe(setPlanIR),
      BackendService.critiqueIR$.subscribe(setCritiqueIR),
      BackendService.specIR$.subscribe(setSpecIR),
      BackendService.executionIR$.subscribe(setExecutionIR),
      BackendService.validationIR$.subscribe(setValidationIR),
      BackendService.activeAgents$.subscribe(setActiveAgents),
    ];

    return () => subs.forEach(s => s.unsubscribe());
  }, []);

  return {
    fileTree,
    workRequests,
    activeWorkRequest,
    planIR,
    critiqueIR,
    specIR,
    executionIR,
    validationIR,
    activeAgents,
    BackendService
  };
}
