import { BehaviorSubject, Subject, delay, of, tap } from 'rxjs';
import { 
  Workspace, FileNode, ChatMessage, AgentLog, ProviderConfig,
  WorkRequest, PlanIR, CritiqueIR, SpecIR, ExecutionIR, ValidationIR, AppState, ActiveAgent
} from '../types';

// Initial Mock Data
const MOCK_WORK_REQUESTS: WorkRequest[] = [
  { id: 'wr-1', intent: 'Build an E-commerce API', status: 'NEW', created_at: new Date(Date.now() - 3600000) },
  { id: 'wr-2', intent: 'Implement a React IDE', status: 'PLAN', created_at: new Date() },
];

const INITIAL_FILE_TREE: FileNode[] = [
  {
    id: 'root', name: 'OpenCode-Clone', type: 'folder', children: [
      { id: 'src', name: 'src', type: 'folder', children: [
        { id: 'f1', name: 'App.tsx', type: 'file' },
        { id: 'f2', name: 'main.tsx', type: 'file' }
      ]},
      { id: 'pkg', name: 'package.json', type: 'file' }
    ]
  }
];

export const AVAILABLE_PROVIDERS: ProviderConfig[] = [
  { id: 'oai', name: 'OpenAI', models: ['gpt-4-turbo', 'gpt-4o'] },
  { id: 'ath', name: 'Anthropic', models: ['claude-3-5-sonnet', 'claude-3-opus'] },
  { id: 'gem', name: 'Google Gemini', models: ['gemini-1.5-pro'] }
];

const MOCK_ACTIVE_AGENTS: ActiveAgent[] = [
  { id: 'a1', name: 'Planner', role: 'Architect', status: 'idle' },
  { id: 'a2', name: 'Critic', role: 'Reviewer', status: 'idle' },
  { id: 'a3', name: 'Coder', role: 'Builder', status: 'idle' },
  { id: 'a4', name: 'Validator', role: 'QA', status: 'idle' },
];

export class SimulatedBackendService {
  // Legacy Streams
  private workspacesSubject = new BehaviorSubject<Workspace[]>([]);
  public workspaces$ = this.workspacesSubject.asObservable();
  
  private activeWorkspaceSubject = new BehaviorSubject<Workspace | null>(null);
  public activeWorkspace$ = this.activeWorkspaceSubject.asObservable();

  private fileTreeSubject = new BehaviorSubject<FileNode[]>(INITIAL_FILE_TREE);
  public fileTree$ = this.fileTreeSubject.asObservable();

  private architectChatSubject = new BehaviorSubject<ChatMessage[]>([]);
  public architectChat$ = this.architectChatSubject.asObservable();

  private builderLogsSubject = new BehaviorSubject<AgentLog[]>([]);
  public builderLogs$ = this.builderLogsSubject.asObservable();

  public terminalOutput$ = new Subject<string>();

  // LOSM Streams
  private workRequestsSubject = new BehaviorSubject<WorkRequest[]>(MOCK_WORK_REQUESTS);
  public workRequests$ = this.workRequestsSubject.asObservable();

  private activeWorkRequestSubject = new BehaviorSubject<WorkRequest | null>(MOCK_WORK_REQUESTS[1]);
  public activeWorkRequest$ = this.activeWorkRequestSubject.asObservable();

  private planIRSubject = new BehaviorSubject<PlanIR | null>(null);
  public planIR$ = this.planIRSubject.asObservable();

  private critiqueIRSubject = new BehaviorSubject<CritiqueIR | null>(null);
  public critiqueIR$ = this.critiqueIRSubject.asObservable();

  private specIRSubject = new BehaviorSubject<SpecIR | null>(null);
  public specIR$ = this.specIRSubject.asObservable();

  private executionIRSubject = new BehaviorSubject<ExecutionIR | null>(null);
  public executionIR$ = this.executionIRSubject.asObservable();

  private validationIRSubject = new BehaviorSubject<ValidationIR | null>(null);
  public validationIR$ = this.validationIRSubject.asObservable();
  
  private activeAgentsSubject = new BehaviorSubject<ActiveAgent[]>(MOCK_ACTIVE_AGENTS);
  public activeAgents$ = this.activeAgentsSubject.asObservable();

  // Methods
  public setActiveWorkRequest(wr: WorkRequest) {
    this.activeWorkRequestSubject.next(wr);
    this.terminalOutput$.next(`\r\n\x1b[32mSwitching to WorkRequest: ${wr.id}\x1b[0m\r\n`);
    
    // reset IRs
    this.planIRSubject.next(null);
    this.critiqueIRSubject.next(null);
    this.specIRSubject.next(null);
    this.executionIRSubject.next(null);
    this.validationIRSubject.next(null);
    
    // Auto-progress based on status for mock
    if (wr.status === 'PLAN') {
      this.generatePlan(wr.id);
    }
  }

  public updateAgentStatus(id: string, status: 'idle' | 'working' | 'waiting') {
    const agents = this.activeAgentsSubject.getValue();
    const idx = agents.findIndex(a => a.id === id);
    if (idx !== -1) {
      agents[idx].status = status;
      this.activeAgentsSubject.next([...agents]);
    }
  }

  public createWorkRequest(intent: string) {
    const newWR: WorkRequest = {
      id: `wr-${Date.now()}`,
      intent,
      status: 'NEW',
      created_at: new Date()
    };
    this.workRequestsSubject.next([...this.workRequestsSubject.getValue(), newWR]);
    this.setActiveWorkRequest(newWR);
    
    setTimeout(() => {
      this.generatePlan(newWR.id);
    }, 500);
  }

  public generatePlan(wrId: string) {
    this.updateAgentStatus('a1', 'working');
    this.terminalOutput$.next('\r\n\x1b[36m[Planner]\x1b[0m Generating PlanIR...\r\n');
    
    setTimeout(() => {
      this.planIRSubject.next({
        id: `plan-${Date.now()}`,
        goal: 'Implement requested feature securely and efficiently.',
        steps: [
          { id: 's1', name: 'Scaffold Components', description: 'Create React components', risk_level: 'low' },
          { id: 's2', name: 'Wire State', description: 'Connect RxJS observables', risk_level: 'medium' }
        ],
        risks: ['State mutation leakage'],
        assumptions: ['React 18 is installed']
      });
      
      const wrs = this.workRequestsSubject.getValue();
      const idx = wrs.findIndex(w => w.id === wrId);
      if (idx !== -1) {
        wrs[idx].status = 'REVIEW';
        this.workRequestsSubject.next([...wrs]);
        this.activeWorkRequestSubject.next(wrs[idx]);
      }
      this.updateAgentStatus('a1', 'idle');
      this.critiquePlan(wrId);
    }, 2000);
  }

  public critiquePlan(wrId: string) {
    this.updateAgentStatus('a2', 'working');
    this.terminalOutput$.next('\r\n\x1b[33m[Critic]\x1b[0m Reviewing PlanIR...\r\n');
    
    setTimeout(() => {
      this.critiqueIRSubject.next({
        id: `crit-${Date.now()}`,
        issues: [{ severity: 'low', description: 'Ensure components have Error Boundaries' }],
        risk_score: 0.2,
        recommendation: 'approve'
      });
      
      const wrs = this.workRequestsSubject.getValue();
      const idx = wrs.findIndex(w => w.id === wrId);
      if (idx !== -1) {
        wrs[idx].status = 'APPROVAL';
        this.workRequestsSubject.next([...wrs]);
        this.activeWorkRequestSubject.next(wrs[idx]);
      }
      this.updateAgentStatus('a2', 'idle');
    }, 1500);
  }
  
  public approvePlan(wrId: string) {
    const wrs = this.workRequestsSubject.getValue();
    const idx = wrs.findIndex(w => w.id === wrId);
    if (idx !== -1) {
      wrs[idx].status = 'SPEC';
      this.workRequestsSubject.next([...wrs]);
      this.activeWorkRequestSubject.next(wrs[idx]);
      this.generateSpec(wrId);
    }
  }

  public generateSpec(wrId: string) {
    this.terminalOutput$.next('\r\n\x1b[34m[SpecGen]\x1b[0m Generating SpecIR...\r\n');
    setTimeout(() => {
      this.specIRSubject.next({ id: `spec-${Date.now()}`, details: 'React hooks and RxJS implementation details.' });
      
      const wrs = this.workRequestsSubject.getValue();
      const idx = wrs.findIndex(w => w.id === wrId);
      if (idx !== -1) {
        wrs[idx].status = 'EXEC';
        this.workRequestsSubject.next([...wrs]);
        this.activeWorkRequestSubject.next(wrs[idx]);
        this.execute(wrId);
      }
    }, 1000);
  }

  public execute(wrId: string) {
    this.updateAgentStatus('a3', 'working');
    this.terminalOutput$.next('\r\n\x1b[35m[Builder]\x1b[0m Executing SpecIR...\r\n');
    
    setTimeout(() => {
      const tree = JSON.parse(JSON.stringify(this.fileTreeSubject.getValue()));
      if (tree[0] && tree[0].children && tree[0].children[0]) {
        tree[0].children[0].children.push({
          id: 'new-' + Date.now(),
          name: 'NewComponent.tsx',
          type: 'file'
        });
        this.fileTreeSubject.next(tree);
      }

      this.executionIRSubject.next({
        id: `exec-${Date.now()}`,
        steps: [
           { step_id: 's1', result: 'Created components', status: 'success' },
           { step_id: 's2', result: 'Wired state', status: 'success' }
        ],
        trace: [
           { id: 't1', event_type: 'enter', message: 'Starting execution', timestamp: new Date() },
           { id: 't2', event_type: 'exit', message: 'Finished execution', timestamp: new Date() }
        ]
      });

      const wrs = this.workRequestsSubject.getValue();
      const idx = wrs.findIndex(w => w.id === wrId);
      if (idx !== -1) {
        wrs[idx].status = 'VALIDATE';
        this.workRequestsSubject.next([...wrs]);
        this.activeWorkRequestSubject.next(wrs[idx]);
        this.validate(wrId);
      }
      this.updateAgentStatus('a3', 'idle');
    }, 2500);
  }

  public validate(wrId: string) {
    this.updateAgentStatus('a4', 'working');
    this.terminalOutput$.next('\r\n\x1b[32m[Validator]\x1b[0m Checking results...\r\n');
    setTimeout(() => {
      this.validationIRSubject.next({
        id: `val-${Date.now()}`,
        scores: { intent_alignment: 0.98, compliance: 1.0, correctness: 1.0 },
        recommendation: 'complete'
      });
      this.updateAgentStatus('a4', 'idle');
      this.terminalOutput$.next('\x1b[32m[Validator] All tests passed.\x1b[0m\r\n$ ');
    }, 1500);
  }
}

export const BackendService = new SimulatedBackendService();
