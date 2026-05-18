import { useEffect, useState, useCallback } from 'react';
import { BackendService } from '../services/RealBackendService';
import { FileNode, WorkRequest, PlanIR, CritiqueIR, SpecIR, ExecutionIR, ValidationIR, ActiveAgent } from '../types';

const MOCK_ACTIVE_AGENTS: ActiveAgent[] = [
  { id: 'a1', name: 'Planner', role: 'Architect', status: 'idle' },
  { id: 'a2', name: 'Critic', role: 'Reviewer', status: 'idle' },
  { id: 'a3', name: 'Coder', role: 'Builder', status: 'idle' },
  { id: 'a4', name: 'Validator', role: 'QA', status: 'idle' },
];

export function useSimulation() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>([]);
  const [activeWorkRequest, setActiveWorkRequest] = useState<WorkRequest | null>(null);
  const [planIR, setPlanIR] = useState<PlanIR | null>(null);
  const [critiqueIR, setCritiqueIR] = useState<CritiqueIR | null>(null);
  const [specIR, setSpecIR] = useState<SpecIR | null>(null);
  const [executionIR, setExecutionIR] = useState<ExecutionIR | null>(null);
  const [validationIR, setValidationIR] = useState<ValidationIR | null>(null);
  const [activeAgents, setActiveAgents] = useState<ActiveAgent[]>(MOCK_ACTIVE_AGENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const wrs = await BackendService.listWorkRequests();
        setWorkRequests(wrs);
      } catch {
        // backend may not be running yet
      }
    })();
  }, []);

  const handleSetActiveWorkRequest = useCallback(async (wr: WorkRequest) => {
    setActiveWorkRequest(wr);
    setPlanIR(null);
    setCritiqueIR(null);
    setSpecIR(null);
    setExecutionIR(null);
    setValidationIR(null);

    if (!wr.dbId) return;

    try {
      const [plans, critiques, specs, executions, validations] = await Promise.all([
        fetchWorkPlan(wr.dbId),
        fetchLatestCritique(wr.dbId),
        fetchWorkSpec(wr.dbId),
        fetchLatestExecution(wr.dbId),
        fetchLatestValidation(wr.dbId),
      ]);
      if (plans) setPlanIR(plans);
      if (critiques) setCritiqueIR(critiques);
      if (specs) setSpecIR(specs);
      if (executions) setExecutionIR(executions);
      if (validations) setValidationIR(validations);
    } catch {
      // backend not available
    }
  }, []);

  async function fetchWorkPlan(dbId: number): Promise<PlanIR | null> {
    try {
      return await BackendService.generatePlan(dbId);
    } catch {
      return null;
    }
  }

  async function fetchLatestCritique(dbId: number): Promise<CritiqueIR | null> {
    try {
      return await BackendService.createCritique(dbId);
    } catch {
      return null;
    }
  }

  async function fetchWorkSpec(dbId: number): Promise<SpecIR | null> {
    try {
      return await BackendService.generateSpec(dbId);
    } catch {
      return null;
    }
  }

  async function fetchLatestExecution(dbId: number): Promise<ExecutionIR | null> {
    try {
      return await BackendService.executePlan(dbId);
    } catch {
      return null;
    }
  }

  async function fetchLatestValidation(dbId: number): Promise<ValidationIR | null> {
    try {
      const executions = await BackendService.listExecutions(dbId);
      if (executions.length === 0) return null;
      return await BackendService.validateExecution(dbId, executions[executions.length - 1].execution_id);
    } catch {
      return null;
    }
  }

  const createWorkRequest = useCallback(async (intent: string) => {
    try {
      const wr = await BackendService.createWorkRequest({ intent });
      setWorkRequests((prev) => [...prev, wr]);
      setActiveWorkRequest(wr);
    } catch {
      // backend not available
    }
  }, []);

  const generatePlan = useCallback(async (wrId: string) => {
    const wr = workRequests.find((w) => w.id === wrId);
    if (!wr?.dbId) return;
    setActiveAgents((prev) => prev.map((a) => (a.id === 'a1' ? { ...a, status: 'working' as const } : a)));
    try {
      const plan = await BackendService.generatePlan(wr.dbId);
      setPlanIR(plan);
      const updated = await BackendService.getWorkRequest(wr.dbId);
      setActiveWorkRequest(updated);
    } catch {
      // fallback
    } finally {
      setActiveAgents((prev) => prev.map((a) => (a.id === 'a1' ? { ...a, status: 'idle' as const } : a)));
    }
  }, [workRequests]);

  const approvePlan = useCallback(async (wrId: string) => {
    const wr = workRequests.find((w) => w.id === wrId);
    if (!wr?.dbId) return;
    try {
      await BackendService.transition(wr.dbId, 'SPEC');
      const updated = await BackendService.getWorkRequest(wr.dbId);
      setActiveWorkRequest(updated);
      const spec = await BackendService.generateSpec(wr.dbId);
      setSpecIR(spec);
    } catch {
      // backend not available
    }
  }, [workRequests]);

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
    loading,
    setActiveWorkRequest: handleSetActiveWorkRequest,
    createWorkRequest,
    generatePlan,
    approvePlan,
    BackendService,
  };
}
