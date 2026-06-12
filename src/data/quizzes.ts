import type { QuizCard } from '../types';

export const ALL_QUIZZES: QuizCard[] = [
  // ─── JUNIOR QUIZZES ────────────────────────────────────────────────────────
  {
    id: 'q-001',
    type: 'quiz',
    quizType: 'multiple-choice',
    tier: 'junior',
    question: 'Which Blazor hosting model runs entirely in the browser without a server connection after initial load?',
    options: [
      'Blazor Server',
      'Blazor WebAssembly',
      'Blazor Hybrid',
      'ASP.NET Razor Pages',
    ],
    correctIndex: 1,
    explanation:
      'Blazor WebAssembly compiles your .NET code to WASM and ships it to the browser. Once loaded, all execution happens client-side with no server connection required.',
  },

  {
    id: 'q-002',
    type: 'quiz',
    quizType: 'code-fill',
    tier: 'junior',
    question: 'Complete this two-way data binding syntax so the input stays in sync with the C# variable:',
    codeSnippet: '<input ___="userName" placeholder="Enter name" />',
    fillOptions: ['@bind', '@value', '@model', '@sync'],
    correctFill: '@bind',
    explanation:
      '@bind creates a two-way binding. It reads the variable for display and writes back on change. Equivalent to wiring both value and onchange manually.',
  },

  {
    id: 'q-003',
    type: 'quiz',
    quizType: 'true-false',
    tier: 'junior',
    question:
      'In Blazor, you should always add @key when rendering a list of components with @foreach.',
    answer: true,
    explanation:
      '@key gives Blazor\'s diffing algorithm a stable identity for each component. Without it, reordering a list can corrupt component state or cause unnecessary recreation.',
  },

  {
    id: 'q-004',
    type: 'quiz',
    quizType: 'match',
    tier: 'junior',
    question: 'Match each lifecycle method to when it fires:',
    pairs: [
      { term: 'OnInitializedAsync', definition: 'Runs once when component first loads' },
      { term: 'OnParametersSetAsync', definition: 'Runs when parent passes new parameters' },
      { term: 'ShouldRender', definition: 'Controls whether a re-render is skipped' },
      { term: 'OnAfterRenderAsync', definition: 'Runs after the DOM has been updated' },
    ],
    explanation:
      'These four methods cover the full lifecycle. OnInitializedAsync is for data fetching, OnParametersSetAsync for reacting to prop changes, ShouldRender for performance, OnAfterRenderAsync for DOM interaction.',
  },

  // ─── MID QUIZZES ───────────────────────────────────────────────────────────
  {
    id: 'q-005',
    type: 'quiz',
    quizType: 'multiple-choice',
    tier: 'mid',
    question:
      'Which component should you wrap around a risky subtree to prevent a crash from taking down the whole page?',
    options: ['ErrorHandler', 'TryCatch', 'ErrorBoundary', 'SafeZone'],
    correctIndex: 2,
    explanation:
      'ErrorBoundary is a built-in Blazor component that catches unhandled exceptions in its child tree and renders a fallback UI. Call Recover() to reset after an error.',
  },

  {
    id: 'q-006',
    type: 'quiz',
    quizType: 'code-fill',
    tier: 'mid',
    question: 'Complete the IJSRuntime call to invoke a JS function named showAlert and get a string result:',
    codeSnippet: 'var result = await JS.___<string>("showAlert", "Hello!");',
    fillOptions: ['InvokeAsync', 'CallAsync', 'RunAsync', 'ExecuteAsync'],
    correctFill: 'InvokeAsync',
    explanation:
      'InvokeAsync<T> calls a JS function and awaits a typed return value. Use InvokeVoidAsync when you don\'t need a return value — it\'s slightly more efficient.',
  },

  // ─── SENIOR QUIZZES ────────────────────────────────────────────────────────
  {
    id: 'q-007',
    type: 'quiz',
    quizType: 'true-false',
    tier: 'senior',
    question:
      'AOT compilation for Blazor WASM always results in a smaller download size compared to the JIT interpreter mode.',
    answer: false,
    explanation:
      'AOT actually increases download size significantly because it includes native WASM bytecode instead of compact .NET IL. The tradeoff is faster runtime execution at the cost of a larger initial bundle.',
  },

  {
    id: 'q-008',
    type: 'quiz',
    quizType: 'multiple-choice',
    tier: 'senior',
    question:
      'In Clean Architecture applied to Blazor, which layer should your components directly depend on?',
    options: [
      'Infrastructure layer',
      'Database layer',
      'Application layer',
      'Domain entities only',
    ],
    correctIndex: 2,
    explanation:
      'Blazor components belong to the WebUI layer and should depend only on the Application layer (use cases, DTOs, interfaces). This keeps components thin, testable, and decoupled from EF Core or external services.',
  },
];
