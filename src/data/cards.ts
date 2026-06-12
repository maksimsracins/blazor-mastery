import type { LearningCard } from '../types';

export const ALL_CARDS: LearningCard[] = [
  // ─── JUNIOR TIER ───────────────────────────────────────────────────────────

  {
    id: 'j-001',
    tier: 'junior',
    topicTitle: 'What is Blazor?',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor' },
    body: [
      'Blazor is Microsoft\'s framework for building interactive web UIs using C# instead of JavaScript. It runs on .NET, which means you bring your existing C# skills directly to the browser.',
      'The pitch: one language, full stack. Your models, validation, and business logic live in C#. Your components live in C#. You never have to context-switch into JavaScript for the frontend.',
      'Think of it like React or Vue — but you write components in .razor files instead of .jsx or .vue. The component model is similar: state, events, props, lifecycle. The syntax is just C# + HTML.',
      'Why does this matter? JavaScript fatigue is real. TypeScript helps but you\'re still fighting npm, bundlers, and a separate type system. Blazor lets .NET teams ship full UIs without a frontend specialist.',
    ],
    abbreviations: [
      { term: 'UI', fullForm: 'User Interface', definition: 'The visual layer of an app that users interact with directly.' },
      { term: 'SPA', fullForm: 'Single Page Application', definition: 'A web app that loads once and updates the page dynamically without full reloads.' },
    ],
    keyTakeaway: 'Blazor lets you build interactive web UIs entirely in C# — no JavaScript required.',
  },

  {
    id: 'j-002',
    tier: 'junior',
    topicTitle: 'Server vs WebAssembly vs Hybrid',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/hosting-models' },
    body: [
      'Blazor ships three hosting models. They share the same component model and syntax — only where execution happens differs.',
      'Blazor Server: components run on the server. UI events are sent over a SignalR WebSocket, the server re-renders, and the diff is sent back. Fast startup, full .NET API access, but requires a persistent connection.',
      'Blazor WebAssembly: .NET is compiled to WASM and runs entirely in the browser. No server connection after initial load. Slower first load, but offline-capable and no server costs for compute.',
      'Blazor Hybrid: a .NET MAUI app embeds a BlazorWebView control. Your Blazor components render inside a native shell. Target iOS, Android, Windows, and macOS from one codebase.',
    ],
    codeBlock: {
      language: 'bash',
      code: `# Blazor Server
dotnet new blazorserver -o MyServerApp

# Blazor WebAssembly (standalone)
dotnet new blazorwasm -o MyWasmApp

# Blazor WebAssembly hosted (with ASP.NET backend)
dotnet new blazorwasm -o MyHostedApp --hosted`,
      filename: 'terminal',
    },
    abbreviations: [
      { term: 'WASM', fullForm: 'WebAssembly', definition: 'A binary instruction format that runs in browsers at near-native speed, enabling languages like C# to run client-side.' },
      { term: 'SSR', fullForm: 'Server-Side Rendering', definition: 'Generating HTML on the server before sending it to the browser, enabling faster first paints.' },
    ],
    keyTakeaway: 'Choose Server for fast startup and full .NET access, WASM for offline capability, Hybrid for native desktop/mobile.',
  },

  {
    id: 'j-003',
    tier: 'junior',
    topicTitle: 'Setting Up Your Environment',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/tooling' },
    body: [
      'You need two things: the .NET 8 SDK and an editor. Everything else is optional.',
      'The .NET SDK ships the compiler, runtime, and CLI. Download it from dot.net. Verify installation with `dotnet --version` — you want 8.x or higher.',
      'For editors: VS Code with the C# Dev Kit extension is free, cross-platform, and excellent. Visual Studio 2022 Community is also free and has deeper Blazor tooling on Windows. Either works.',
      'Once the SDK is installed, you\'re one command away from a running Blazor app. `dotnet new` creates projects from templates, `dotnet run` starts the dev server with hot reload.',
    ],
    codeBlock: {
      language: 'bash',
      code: `# Create a new Blazor WASM project
dotnet new blazorwasm -o BlazorPath

# Enter the project directory
cd BlazorPath

# Start the dev server (with hot reload)
dotnet watch run

# App is now live at https://localhost:5001`,
      filename: 'terminal',
    },
    abbreviations: [
      { term: 'SDK', fullForm: 'Software Development Kit', definition: 'A package of tools, libraries, and compilers needed to build for a specific platform.' },
      { term: 'CLI', fullForm: 'Command Line Interface', definition: 'A text-based interface for interacting with software, used here via the `dotnet` command.' },
    ],
    youtubeRef: {
      videoId: 'RBVIclt4sOo',
      title: 'Getting Started with Blazor in .NET 8',
      channel: 'Nick Chapsas',
      duration: '18:42',
    },
    keyTakeaway: 'You need .NET 8 SDK and an editor. VS Code with C# Dev Kit is free, fast, and fully capable.',
  },

  {
    id: 'j-004',
    tier: 'junior',
    topicTitle: 'Anatomy of a .razor File',
    source: { name: 'Blazor in Action', type: 'book', url: 'https://www.manning.com/books/blazor-in-action' },
    body: [
      'Every .razor file is a Blazor component. It combines an HTML template with C# logic in a single file — think of it as a class and a template merged together.',
      'A component has up to three sections. The @page directive (optional) registers it as a routable page. The markup section is standard HTML mixed with Razor syntax (C# expressions start with @). The @code block holds properties, fields, and methods.',
      'Think of it like a LEGO brick: it has inputs (parameters), internal state, and a visual output. Connect bricks together to build UIs.',
      'The Razor compiler turns your .razor file into a C# class that inherits from ComponentBase. The HTML becomes a BuildRenderTree method. You never need to see the generated code — but knowing it exists helps demystify how it works.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@page "/counter"

<h1>Count: @count</h1>
<p>Current value is @(count % 2 == 0 ? "even" : "odd").</p>

<button @onclick="Increment" class="btn">
    Increment
</button>

@code {
    private int count = 0;

    private void Increment()
    {
        count++;
    }
}`,
      filename: 'Counter.razor',
    },
    abbreviations: [
      { term: 'DOM', fullForm: 'Document Object Model', definition: 'The browser\'s tree representation of an HTML page, which Blazor manipulates to update the UI.' },
    ],
    keyTakeaway: 'A .razor file is HTML template + C# logic in one file. The Razor compiler turns it into a ComponentBase subclass.',
  },

  {
    id: 'j-005',
    tier: 'junior',
    topicTitle: 'Two-Way Data Binding with @bind',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/components/data-binding' },
    body: [
      '@bind creates a two-way link between a form element and a C# variable. Write to the variable → the input updates. User types → the variable updates. No event handler wiring needed.',
      'By default, @bind fires on the `onchange` event — when the user leaves the field. To react on every keystroke, use `@bind:event="oninput"`.',
      'You can also bind to component parameters. Pass `Value` and `ValueChanged` as a pair, and the parent can use @bind-Value on the child component.',
      'Under the hood, @bind is syntactic sugar. `<input @bind="name" />` expands to `<input value="@name" @onchange="e => name = e.Value?.ToString()" />`. Knowing this helps when you need to customize behavior.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Binds on blur (default) *@
<input @bind="username" placeholder="Username" />

@* Binds on every keystroke *@
<input @bind="searchQuery" @bind:event="oninput" />

@* Result is live — no separate event handler *@
<p>Hello, @username! Searching: @searchQuery</p>

@code {
    private string username = "";
    private string searchQuery = "";
}`,
      filename: 'BindingDemo.razor',
    },
    keyTakeaway: '@bind:event="oninput" fires on every keystroke; the default @bind fires on blur.',
  },

  {
    id: 'j-006',
    tier: 'junior',
    topicTitle: 'Event Handling',
    source: { name: 'Nick Chapsas', type: 'youtube', url: 'https://www.youtube.com/@nickchapsas' },
    body: [
      'Event handlers in Blazor are C# methods wired to HTML events. Every standard DOM event has a @on prefix: @onclick, @onchange, @oninput, @onsubmit, @onkeydown, and so on.',
      'Handlers can be sync or async. Use `async Task` for handlers that need to await something — Blazor re-renders after the task completes. Avoid `async void`; it hides exceptions.',
      'Lambda expressions work inline: `@onclick="() => count++"`. For event arguments, the lambda takes a typed event arg: `@oninput="e => name = e.Value?.ToString()"`. The types are in the Microsoft.AspNetCore.Components.Web namespace.',
      'EventCallback<T> is the type for component event parameters. It\'s more efficient than Action<T> — it automatically calls StateHasChanged on the parent after invocation.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `<button @onclick="HandleClick">Sync handler</button>

<button @onclick="HandleAsync">Async handler</button>

<input @oninput="e => message = e.Value?.ToString()" />

<p>@message</p>

@code {
    private string message = "";

    private void HandleClick()
    {
        message = "Clicked!";
    }

    private async Task HandleAsync()
    {
        await Task.Delay(500);
        message = "Done!";
    }
}`,
      filename: 'EventDemo.razor',
    },
    youtubeRef: {
      videoId: 'PPiuTqESvJE',
      title: 'Blazor Event Handling Deep Dive',
      channel: 'Nick Chapsas',
      duration: '12:18',
    },
    keyTakeaway: 'Wire any DOM event with @on[eventname]. Use async Task handlers for awaitable work — never async void.',
  },

  {
    id: 'j-007',
    tier: 'junior',
    topicTitle: 'Conditional Rendering',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/components/control-structures' },
    body: [
      'Blazor uses standard C# control flow in templates. There is no special template DSL to learn — if you know C#, you already know Blazor conditionals.',
      '@if / @else works exactly like C# if/else. Wrap any markup in the block. @switch handles multiple cases. Missing cases fall through unless you add a default.',
      'For components, conditional rendering is just including or excluding the tag. `@if (showModal) { <Modal /> }` — when showModal is false, Modal is not mounted. Its lifecycle methods are not called.',
      'Avoid deeply nested @if chains in templates — they make the component hard to read. Extract a helper method that returns a string or small fragment instead.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@if (isLoading)
{
    <span class="spinner">Loading...</span>
}
else if (items.Count == 0)
{
    <p>No items found.</p>
}
else
{
    @foreach (var item in items)
    {
        <div>@item.Name</div>
    }
}

@switch (user.Role)
{
    case "admin":
        <AdminPanel />
        break;
    case "editor":
        <EditorPanel />
        break;
    default:
        <ReadOnlyView />
        break;
}`,
      filename: 'ConditionalDemo.razor',
    },
    keyTakeaway: 'Conditional rendering in Blazor is just C# if/switch in your template — no special DSL to learn.',
  },

  {
    id: 'j-008',
    tier: 'junior',
    topicTitle: 'Loops with @foreach',
    source: { name: 'Blazor in Action', type: 'book', url: 'https://www.manning.com/books/blazor-in-action' },
    body: [
      '@foreach renders a list of elements by iterating over any IEnumerable<T>. Each iteration produces markup — there\'s no limit on complexity inside the loop body.',
      'The critical rule: always add @key when iterating over components (not plain HTML elements). @key lets Blazor\'s diffing algorithm match existing DOM nodes to list items. Without it, Blazor recreates components on every re-render — losing state, triggering flicker, and degrading performance.',
      '@key should be a stable, unique identifier — typically the item\'s database ID. Avoid using the loop index as @key; if items are reordered, the keys shift and Blazor gets confused.',
      '@for also works. It is less idiomatic for collections but useful when you need the index. For simple HTML elements without local state, @key is less critical but still good practice.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Always use @key on component instances *@
@foreach (var product in products)
{
    <ProductCard @key="product.Id" Product="product" />
}

@* For plain HTML, @key helps but is optional *@
@foreach (var tag in tags)
{
    <span @key="tag" class="tag">@tag</span>
}

@code {
    private List<Product> products = new();
    private List<string> tags = new();
}`,
      filename: 'ListDemo.razor',
    },
    keyTakeaway: 'Always use @key when rendering lists of components — it prevents subtle rendering bugs and state loss.',
  },

  {
    id: 'j-009',
    tier: 'junior',
    topicTitle: 'Component Parameters',
    source: { name: 'Chris Sainty', type: 'blog', url: 'https://chrissainty.com' },
    body: [
      '[Parameter] turns a C# property into a component input. Parent components set it like an HTML attribute. It\'s Blazor\'s equivalent of React props or Vue props.',
      'Add [EditorRequired] alongside [Parameter] to get a compiler warning when the parent forgets to set the value — better than a runtime NullReferenceException.',
      '[CascadingParameter] receives values from any ancestor component without explicit prop drilling. The parent wraps children in <CascadingValue Value="theme">. Any descendant can declare [CascadingParameter] to receive it.',
      'Parameters are set before OnParametersSet fires. If you need to react to a parameter change (e.g. fetch new data when an ID changes), do it in OnParametersSetAsync — not in the setter.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* UserCard.razor *@
<div class="card">
    <h2>@Name</h2>
    <p>@Role</p>
</div>

@code {
    [Parameter, EditorRequired]
    public string Name { get; set; } = "";

    [Parameter]
    public string Role { get; set; } = "Member";

    [CascadingParameter]
    public AppTheme? Theme { get; set; }
}

@* Parent usage *@
<CascadingValue Value="currentTheme">
    <UserCard Name="Alice" Role="Admin" />
</CascadingValue>`,
      filename: 'UserCard.razor',
    },
    abbreviations: [
      { term: 'DI', fullForm: 'Dependency Injection', definition: 'A pattern where dependencies are provided to a component from outside rather than created internally.' },
    ],
    keyTakeaway: '[Parameter] is how components communicate downward; EventCallback communicates upward.',
  },

  {
    id: 'j-010',
    tier: 'junior',
    topicTitle: 'Component Lifecycle',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/components/lifecycle' },
    body: [
      'Every Blazor component goes through a predictable lifecycle. The methods fire in order: OnInitialized → OnParametersSet → OnAfterRender. Each has an async variant that supports await.',
      'OnInitializedAsync is where you fetch initial data. It fires once, after the component is first created. Perfect for loading the data a component needs to display.',
      'OnParametersSetAsync fires every time a parameter changes. Use it when a parameter change should trigger side effects — like refetching data when a selected ID prop changes.',
      'ShouldRender() is your performance escape hatch. Return false to skip re-rendering when you know nothing has changed. StateHasChanged() forces a re-render outside the normal flow — useful in background tasks or event handlers that run outside Blazor\'s component scope.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@code {
    private User? user;
    private bool isLoading = true;

    // Runs once on first render
    protected override async Task OnInitializedAsync()
    {
        user = await UserService.GetCurrentUserAsync();
        isLoading = false;
    }

    // Runs when parameters change
    protected override async Task OnParametersSetAsync()
    {
        if (UserId != previousId)
        {
            user = await UserService.GetAsync(UserId);
            previousId = UserId;
        }
    }

    [Parameter] public int UserId { get; set; }
    private int previousId;
}`,
      filename: 'UserProfile.razor',
    },
    keyTakeaway: 'Use OnInitializedAsync for data fetching — it runs once after the component is first created.',
  },

  {
    id: 'j-011',
    tier: 'junior',
    topicTitle: 'Routing: @page and NavLink',
    source: { name: 'Jon Hilton', type: 'blog', url: 'https://jonhilton.net' },
    body: [
      '@page "/path" registers a component as a routable page. The Router component in App.razor maps URL paths to components. No separate routing configuration file needed.',
      'Route parameters are declared in curly braces: @page "/user/{id}". Match the parameter name with a [Parameter] property of the same name on the component.',
      'NavLink renders an anchor tag that automatically adds an "active" CSS class when the current URL matches the href. Use NavLinkMatch.All to match the full path; NavLinkMatch.Prefix to match the start.',
      'NavigationManager.NavigateTo("/path") handles programmatic navigation. Call it from event handlers when you need to redirect after a form submit or action.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Parameterized route *@
@page "/users/{UserId:int}"
<h1>User @UserId</h1>

@code {
    [Parameter] public int UserId { get; set; }
}

@* Navigation menu *@
<nav>
    <NavLink href="/" Match="NavLinkMatch.All">Home</NavLink>
    <NavLink href="/users">Users</NavLink>
    <NavLink href="/settings">Settings</NavLink>
</nav>

@* Programmatic navigation *@
@inject NavigationManager Nav

<button @onclick='() => Nav.NavigateTo("/dashboard")'>
    Go to Dashboard
</button>`,
      filename: 'RoutingDemo.razor',
    },
    keyTakeaway: 'NavLink is smarter than a plain anchor — it knows when it\'s the active route and adds the CSS class automatically.',
  },

  {
    id: 'j-012',
    tier: 'junior',
    topicTitle: 'Forms and Validation',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/forms/' },
    body: [
      'EditForm is Blazor\'s form wrapper. It takes a Model parameter — a plain C# object — and manages the validation state for all fields inside it.',
      'DataAnnotationsValidator reads [Required], [StringLength], [EmailAddress], [Range], and other System.ComponentModel.DataAnnotations attributes from your model class. No JavaScript validation library needed.',
      'ValidationSummary shows all validation errors at once. ValidationMessage<T> shows the error for a specific field. InputText, InputNumber, InputDate are built-in input components that participate in EditContext validation automatically.',
      'OnValidSubmit fires only when all validation passes. OnSubmit fires unconditionally. Use OnValidSubmit for forms where you want the framework to guard the happy path.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Model class *@
public class LoginModel
{
    [Required] public string Email { get; set; } = "";
    [Required, MinLength(8)] public string Password { get; set; } = "";
}

@* Form component *@
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    <ValidationSummary />

    <InputText @bind-Value="model.Email" placeholder="Email" />
    <ValidationMessage For="() => model.Email" />

    <InputText @bind-Value="model.Password"
               type="password" placeholder="Password" />
    <ValidationMessage For="() => model.Password" />

    <button type="submit">Sign In</button>
</EditForm>

@code {
    private LoginModel model = new();
    private async Task HandleSubmit() { /* login logic */ }
}`,
      filename: 'LoginForm.razor',
    },
    keyTakeaway: 'EditForm + DataAnnotationsValidator gives you full model validation with zero JavaScript.',
  },

  {
    id: 'j-013',
    tier: 'junior',
    topicTitle: 'Dependency Injection',
    source: { name: 'Blazor in Action', type: 'book', url: 'https://www.manning.com/books/blazor-in-action' },
    body: [
      'Blazor uses the same DI container as ASP.NET Core. Register services in Program.cs and inject them into components. If you\'ve used ASP.NET before, this is identical.',
      'Three lifetimes: Singleton (one instance for the app), Scoped (one per circuit in Server, one per browser tab in WASM), Transient (new instance each injection). In WASM, Scoped behaves like Singleton because there\'s only one user.',
      'Inject with @inject in the template section, or with [Inject] on a property in the @code block. Both work — @inject is cleaner for components, [Inject] is useful in code-behind classes.',
      'Built-in services you get for free: HttpClient (in WASM), NavigationManager (routing), IJSRuntime (JavaScript interop), AuthenticationStateProvider (auth).',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// Program.cs — register services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddSingleton<AppSettings>();
builder.Services.AddHttpClient<ApiClient>(c =>
    c.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress));

// Component — inject and use
@inject IProductService ProductService
@inject NavigationManager Nav

<ul>
    @foreach (var p in products)
    {
        <li>@p.Name</li>
    }
</ul>

@code {
    private List<Product> products = new();

    protected override async Task OnInitializedAsync()
    {
        products = await ProductService.GetAllAsync();
    }
}`,
      filename: 'ProductList.razor',
    },
    abbreviations: [
      { term: 'IoC', fullForm: 'Inversion of Control', definition: 'The principle where a framework calls your code, rather than your code calling the framework — DI is one implementation of IoC.' },
    ],
    keyTakeaway: '@inject wires up your services — the same DI system you know from ASP.NET Core, no new concepts.',
  },

  {
    id: 'j-014',
    tier: 'junior',
    topicTitle: 'HTTP Calls with HttpClient',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/call-web-api' },
    body: [
      'In Blazor WASM, HttpClient is pre-configured to use the browser\'s native fetch API. Its base address defaults to the app\'s origin. Register it in DI and inject it wherever needed.',
      'System.Net.Http.Json adds extension methods that serialize/deserialize JSON automatically. GetFromJsonAsync<T> fetches and deserializes. PostAsJsonAsync serializes and POSTs. No manual JsonSerializer calls required.',
      'Always handle loading state and errors. Assign a loading bool before the call, clear it in a finally block. Wrap in try/catch for network failures. Display meaningful UI for each state.',
      'In Blazor Server, use IHttpClientFactory to create named or typed clients. Avoid injecting a raw HttpClient singleton — it doesn\'t handle DNS changes well. Typed clients are the cleanest pattern.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@inject HttpClient Http

@if (isLoading)
{
    <p>Loading...</p>
}
else if (error != null)
{
    <p class="error">@error</p>
}
else
{
    @foreach (var post in posts)
    {
        <article>
            <h3>@post.Title</h3>
            <p>@post.Body</p>
        </article>
    }
}

@code {
    private Post[]? posts;
    private bool isLoading = true;
    private string? error;

    protected override async Task OnInitializedAsync()
    {
        try
        {
            posts = await Http.GetFromJsonAsync<Post[]>(
                "https://jsonplaceholder.typicode.com/posts");
        }
        catch (Exception ex)
        {
            error = ex.Message;
        }
        finally
        {
            isLoading = false;
        }
    }

    record Post(int Id, string Title, string Body);
}`,
      filename: 'PostList.razor',
    },
    abbreviations: [
      { term: 'HTTP', fullForm: 'HyperText Transfer Protocol', definition: 'The protocol for transferring data between browsers and servers on the web.' },
      { term: 'API', fullForm: 'Application Programming Interface', definition: 'A defined contract for how software components communicate with each other.' },
      { term: 'JSON', fullForm: 'JavaScript Object Notation', definition: 'A lightweight text format for data exchange, widely used in web APIs.' },
    ],
    keyTakeaway: 'GetFromJsonAsync<T>() is the one-liner that replaces fetch + JSON.parse + TypeScript types.',
  },

  // ─── MID TIER ──────────────────────────────────────────────────────────────

  {
    id: 'm-001',
    tier: 'mid',
    topicTitle: 'State Management Patterns',
    source: { name: 'Khalid Abuhakmeh', type: 'blog', url: 'https://khalidabuhakmeh.com' },
    body: [
      'As apps grow, prop drilling — passing state down through many layers — becomes painful. Three patterns handle this cleanly, in order of complexity.',
      'Shared service (simplest): a Scoped DI service holds state and exposes an OnChange event. Components inject it, mutate state via methods, and subscribe to OnChange to re-render.',
      'Cascading values: wrap a subtree in <CascadingValue> to pass state implicitly. Good for theme, locale, or auth context. Not good for frequently-changing state — it re-renders everything in the subtree.',
      'Fluxor (Flux/Redux-inspired): unidirectional data flow with actions, reducers, and effects. Overkill for most apps, but right for complex multi-page state with undo, history, or async side effects.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// Shared state service (the pragmatic choice)
public class CartService
{
    private readonly List<CartItem> _items = new();
    public IReadOnlyList<CartItem> Items => _items;
    public event Action? OnChange;

    public void Add(Product product)
    {
        _items.Add(new CartItem(product));
        OnChange?.Invoke();
    }
}

// Component subscribes and unsubscribes
@implements IDisposable
@inject CartService Cart

<span>@Cart.Items.Count items</span>

@code {
    protected override void OnInitialized()
        => Cart.OnChange += StateHasChanged;

    public void Dispose()
        => Cart.OnChange -= StateHasChanged;
}`,
      filename: 'CartIcon.razor',
    },
    keyTakeaway: 'Start with a shared service. Only reach for Fluxor when you have complex multi-component state that needs a paper trail.',
  },

  {
    id: 'm-002',
    tier: 'mid',
    topicTitle: 'JavaScript Interop (IJSRuntime)',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/javascript-interoperability/' },
    body: [
      'Blazor can\'t wrap every browser API. IJSRuntime is the bridge. It lets you call JavaScript from C# and lets JavaScript call back into C# methods.',
      'InvokeAsync<T> calls a JS function and returns a typed result. InvokeVoidAsync calls it with no return. Both are async because crossing the Blazor-JS boundary is inherently async in Server mode.',
      'For C# methods you want JavaScript to call, mark them with [JSInvokable]. Pass a DotNetObjectReference to JS so it has a handle. Call dotNetRef.invokeMethodAsync("MethodName") from JavaScript.',
      'IJSRuntime is available only after OnAfterRenderAsync — the DOM must exist before you can interact with it. Storing a JS module reference in a field lets you avoid re-importing on every call.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@inject IJSRuntime JS

@code {
    private IJSObjectReference? module;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            // Import a local JS module
            module = await JS.InvokeAsync<IJSObjectReference>(
                "import", "./myModule.js");
        }
    }

    private async Task ScrollToTop()
    {
        await JS.InvokeVoidAsync("window.scrollTo", 0, 0);
    }

    private async Task<string> GetClipboard()
    {
        return await JS.InvokeAsync<string>("navigator.clipboard.readText");
    }

    [JSInvokable]
    public void OnBrowserEvent(string data)
    {
        // Called from JavaScript
    }
}`,
      filename: 'JSInteropDemo.razor',
    },
    abbreviations: [
      { term: 'JS', fullForm: 'JavaScript', definition: 'The scripting language that runs natively in browsers, used alongside Blazor for browser-specific APIs.' },
    ],
    keyTakeaway: 'IJSRuntime is your escape hatch to the browser — use it for things Blazor doesn\'t expose natively, like clipboard or local fonts.',
  },

  {
    id: 'm-003',
    tier: 'mid',
    topicTitle: '.NET 8 Render Modes',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/components/render-modes' },
    body: [
      '.NET 8 introduced per-component render modes. You can now mix static SSR, server interactivity, and WASM interactivity on the same page — each component chooses its own mode.',
      '@rendermode InteractiveServer: server-side rendering with SignalR. @rendermode InteractiveWebAssembly: WASM in the browser. @rendermode InteractiveAuto: starts with Server (fast first load), then silently upgrades to WASM once the runtime downloads.',
      'No @rendermode directive means static SSR: pure HTML, no C# running in the browser or maintaining a connection. Blazing fast, no JavaScript, perfect for content pages.',
      'The Auto mode is the new sweet spot for most apps: server-fast startup for the user, WASM for scale (no per-user server connection after upgrade). The tradeoff is a larger initial payload.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Static SSR — no interactivity, pure HTML *@
@page "/about"
<h1>About Us</h1>  @* No @code block needed *@

@* Interactive Server — real-time, requires SignalR *@
@page "/dashboard"
@rendermode InteractiveServer
<LiveChart />

@* Interactive WASM — runs in browser *@
@page "/calculator"
@rendermode InteractiveWebAssembly
<Calculator />

@* Auto — Server first, WASM after download *@
@page "/app"
@rendermode InteractiveAuto
<AppShell />`,
      filename: 'RenderModes.razor',
    },
    abbreviations: [
      { term: 'SSR', fullForm: 'Server-Side Rendering', definition: 'Generating HTML on the server before sending to the browser, for fast first paints with no client-side JS needed.' },
      { term: 'WASM', fullForm: 'WebAssembly', definition: 'A binary instruction format that runs in browsers at near-native speed.' },
    ],
    keyTakeaway: 'InteractiveAuto is the new default sweet spot: fast first paint via Server, then WASM for scale.',
  },

  {
    id: 'm-004',
    tier: 'mid',
    topicTitle: 'Authentication & Authorization',
    source: { name: 'Blazor in Action', type: 'book', url: 'https://www.manning.com/books/blazor-in-action' },
    body: [
      '<AuthorizeView> is the component-level auth primitive. It shows different content based on whether the user is authenticated, and optionally based on role or policy.',
      'The [Authorize] attribute on a @page component restricts the entire page to authenticated users. Add Roles or Policy parameters for fine-grained control.',
      'CascadingAuthenticationState makes the auth state available throughout the app. It wraps the entire component tree in App.razor, so every <AuthorizeView> can see the current user without explicit prop passing.',
      'IAuthenticationStateProvider is the extension point for custom auth. Implement GetAuthenticationStateAsync to return a ClaimsPrincipal built from your cookie, JWT, or session store.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Show different UI based on auth state *@
<AuthorizeView>
    <Authorized>
        <p>Welcome, @context.User.Identity?.Name!</p>
        <NavLink href="/dashboard">Dashboard</NavLink>
    </Authorized>
    <NotAuthorized>
        <NavLink href="/login">Sign In</NavLink>
    </NotAuthorized>
</AuthorizeView>

@* Role-based page protection *@
@page "/admin"
@attribute [Authorize(Roles = "Admin")]

<h1>Admin Panel</h1>

@* Policy-based *@
<AuthorizeView Policy="RequirePremium">
    <PremiumFeature />
</AuthorizeView>`,
      filename: 'AuthDemo.razor',
    },
    abbreviations: [
      { term: 'JWT', fullForm: 'JSON Web Token', definition: 'A compact, URL-safe token format for representing claims between two parties, commonly used for API authentication.' },
      { term: 'OIDC', fullForm: 'OpenID Connect', definition: 'An identity layer on top of OAuth 2.0 that provides user authentication and profile information.' },
    ],
    keyTakeaway: '<AuthorizeView> wraps any content you want to conditionally show based on auth — no if/else needed.',
  },

  {
    id: 'm-005',
    tier: 'mid',
    topicTitle: 'MudBlazor Component Library',
    source: { name: 'Patrick God', type: 'youtube', url: 'https://www.youtube.com/@PatrickGod' },
    body: [
      'MudBlazor is the most popular free Blazor component library. It follows Material Design but has evolved into its own cohesive system. The component API is clean and well-documented.',
      'Installation: add the NuGet package, reference the CSS/JS in index.html, add services in Program.cs, and drop the required layout wrappers in MainLayout.razor. About 10 minutes to functional.',
      'Key components: MudButton, MudTextField, MudDataGrid (with sort, filter, page), MudDialog, MudSnackbar (toasts), MudMenu, MudDatePicker, MudAutocomplete. 50+ components in total.',
      'Theming: MudThemeProvider with a custom MudTheme object sets colors, typography, and border radii globally. Cascade it at the root level. Dark mode is a single bool flip.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Quick MudBlazor form example *@
<MudCard>
    <MudCardContent>
        <MudTextField @bind-Value="email"
                      Label="Email"
                      Variant="Variant.Outlined"
                      InputType="InputType.Email" />
        <MudTextField @bind-Value="password"
                      Label="Password"
                      Variant="Variant.Outlined"
                      InputType="InputType.Password" />
    </MudCardContent>
    <MudCardActions>
        <MudButton Variant="Variant.Filled"
                   Color="Color.Primary"
                   OnClick="Login">
            Sign In
        </MudButton>
    </MudCardActions>
</MudCard>`,
      filename: 'MudLoginForm.razor',
    },
    keyTakeaway: 'MudBlazor gives you production-quality components in minutes — stop reinventing form controls.',
  },

  {
    id: 'm-006',
    tier: 'mid',
    topicTitle: 'RenderFragment and Composable Components',
    source: { name: 'Chris Sainty', type: 'blog', url: 'https://chrissainty.com' },
    body: [
      'RenderFragment is a delegate that returns UI content. Use it as a parameter type to create template slots — like React render props or Vue named slots.',
      'ChildContent is the conventional name for the default slot. Wrapping content in your component\'s tags fills this parameter automatically.',
      'Multiple named slots are just multiple RenderFragment parameters with different names. Parent sets them like any other parameter with named parameter syntax.',
      'RenderFragment<T> is a typed template. Use it for things like a row template in a data table — the parent defines how each T looks, the component handles iteration and layout.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Card.razor — accepts title slot and content slot *@
<div class="card">
    <div class="card-header">
        @Header
    </div>
    <div class="card-body">
        @ChildContent
    </div>
</div>

@code {
    [Parameter] public RenderFragment? Header { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
}

@* Parent usage *@
<Card>
    <Header>
        <h2>My Card Title</h2>
    </Header>
    <p>Any content goes here as ChildContent.</p>
</Card>`,
      filename: 'Card.razor',
    },
    keyTakeaway: 'RenderFragment is Blazor\'s answer to React render props — it\'s how you build truly composable, slot-based components.',
  },

  {
    id: 'm-007',
    tier: 'mid',
    topicTitle: 'Error Boundaries',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/fundamentals/handle-errors' },
    body: [
      'ErrorBoundary wraps a subtree and catches any unhandled exception thrown during rendering or lifecycle methods. Instead of crashing the whole page, it renders a fallback UI.',
      'The ErrorContent parameter lets you define a custom error UI. The context is the caught exception, so you can show an appropriate message or log it.',
      'Call Recover() on the ErrorBoundary reference to reset it — useful for a "Try again" button. This clears the error state and re-renders the child content.',
      'Nest ErrorBoundary thoughtfully. One per "risky section" is better than one per component. The goal is blast radius reduction, not wrapping everything.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `<ErrorBoundary @ref="errorBoundary">
    <ChildContent>
        <WeatherWidget />
    </ChildContent>
    <ErrorContent Context="ex">
        <div class="error-card">
            <p>Weather data unavailable.</p>
            <button @onclick="Recover">Try Again</button>
        </div>
    </ErrorContent>
</ErrorBoundary>

@code {
    private ErrorBoundary? errorBoundary;

    private void Recover()
    {
        errorBoundary?.Recover();
    }
}`,
      filename: 'SafeWidget.razor',
    },
    keyTakeaway: 'Wrap risky sections in <ErrorBoundary> so a single component crash doesn\'t take down the whole page.',
  },

  {
    id: 'm-008',
    tier: 'mid',
    topicTitle: 'Virtualization',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/components/virtualization' },
    body: [
      '<Virtualize> only renders items visible in the viewport. Scroll a list of 50,000 rows and only ~20 DOM nodes exist at any time. The DOM size stays flat regardless of collection size.',
      'For in-memory collections, pass Items="myList" and it handles everything. For paginated APIs, use the ItemsProvider parameter — a callback Blazor invokes with the visible range, returning just those items from your server.',
      'ItemSize sets the expected height per item in pixels. Getting this right prevents layout jumps as the user scrolls. OverscanCount controls how many items beyond the viewport to render as a buffer.',
      'Combine with the @key directive on the item template for correct identity tracking. The performance gain for large lists is dramatic — renders that took seconds become instant.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* In-memory list — instant for any size *@
<div style="height: 500px; overflow-y: auto;">
    <Virtualize Items="allProducts" ItemSize="80">
        <ItemContent Context="product">
            <div class="product-row" style="height: 80px;">
                <span>@product.Name</span>
                <span>@product.Price.ToString("C")</span>
            </div>
        </ItemContent>
    </Virtualize>
</div>

@* API-backed — only fetches visible page *@
<Virtualize ItemsProvider="LoadProducts" ItemSize="60">
    <ItemContent Context="p">
        <ProductRow Product="p" />
    </ItemContent>
</Virtualize>

@code {
    private async ValueTask<ItemsProviderResult<Product>> LoadProducts(
        ItemsProviderRequest request)
    {
        var result = await Api.GetProductsAsync(
            request.StartIndex, request.Count);
        return new ItemsProviderResult<Product>(
            result.Items, result.TotalCount);
    }
}`,
      filename: 'VirtualList.razor',
    },
    keyTakeaway: 'For any list over ~100 items, switch to <Virtualize> — one component swap for massive performance gains.',
  },

  {
    id: 'm-009',
    tier: 'mid',
    topicTitle: 'Unit Testing with bUnit',
    source: { name: 'dotnet YouTube channel', type: 'youtube', url: 'https://www.youtube.com/@dotnet' },
    body: [
      'bUnit is the testing library for Blazor. It renders components in a headless test context, lets you interact with them, and assert on the resulting markup.',
      'Use IRenderedComponent<T> to render. Find elements with Find (throws if missing) or FindAll (returns empty list). Trigger events with the Click(), Input(), or Change() extension methods.',
      'Mock services with TestContext.Services.AddSingleton<IMyService>(mockImpl). The test service provider resolves injected services exactly like the real app.',
      'Assertions: MarkupMatches for semantic HTML comparison (ignores whitespace diffs). HasComponent<T> checks if a child component is rendered. Instance gives you the component\'s C# instance for direct property assertions.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// Install: bunit, xunit, Moq
using Bunit;
using Xunit;

public class CounterTests : TestContext
{
    [Fact]
    public void CounterIncrementsOnClick()
    {
        // Render the component
        var cut = RenderComponent<Counter>();

        // Initial state
        cut.Find("h1").MarkupMatches("<h1>Count: 0</h1>");

        // Click the button
        cut.Find("button").Click();

        // Assert new state
        cut.Find("h1").MarkupMatches("<h1>Count: 1</h1>");
    }

    [Fact]
    public void UserListCallsService()
    {
        var mockService = new Mock<IUserService>();
        mockService.Setup(s => s.GetUsersAsync())
            .ReturnsAsync(new List<User> { new("Alice") });

        Services.AddScoped(_ => mockService.Object);
        var cut = RenderComponent<UserList>();

        cut.Find("li").TextContent.ShouldBe("Alice");
    }
}`,
      filename: 'CounterTests.cs',
    },
    keyTakeaway: 'bUnit tests your components like a user would: click buttons, assert rendered HTML, mock dependencies.',
  },

  {
    id: 'm-010',
    tier: 'mid',
    topicTitle: 'Real-Time with SignalR',
    source: { name: 'Nick Chapsas', type: 'youtube', url: 'https://www.youtube.com/@nickchapsas' },
    body: [
      'Blazor Server is built on SignalR. But in WASM, you can add SignalR manually to push real-time updates from server to client without polling.',
      'Add the Microsoft.AspNetCore.SignalR.Client NuGet package. Build a HubConnection pointing to your Hub URL. Subscribe to server-pushed events with On<T>. Call InvokeAsync to call server methods.',
      'Always dispose HubConnection when the component is disposed. Subscribe to the connection\'s Closed event to handle reconnection. The built-in retry policy handles transient network failures.',
      'Common patterns: live dashboard with server pushing metrics every second, collaborative editing, notifications, multiplayer game state. The pattern is the same for all: server pushes, client renders.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@implements IAsyncDisposable
@inject NavigationManager Nav

<ul>
    @foreach (var msg in messages)
    {
        <li>@msg</li>
    }
</ul>

@code {
    private HubConnection? hub;
    private List<string> messages = new();

    protected override async Task OnInitializedAsync()
    {
        hub = new HubConnectionBuilder()
            .WithUrl(Nav.ToAbsoluteUri("/chathub"))
            .WithAutomaticReconnect()
            .Build();

        hub.On<string>("ReceiveMessage", msg =>
        {
            messages.Add(msg);
            InvokeAsync(StateHasChanged);
        });

        await hub.StartAsync();
    }

    public async ValueTask DisposeAsync()
    {
        if (hub is not null)
            await hub.DisposeAsync();
    }
}`,
      filename: 'LiveChat.razor',
    },
    keyTakeaway: 'SignalR turns your Blazor WASM app into a real-time experience — about 15 lines to a working push connection.',
  },

  {
    id: 'm-011',
    tier: 'mid',
    topicTitle: 'Advanced Routing',
    source: { name: 'Jon Hilton', type: 'blog', url: 'https://jonhilton.net' },
    body: [
      'Route constraints validate URL parameters before the component renders. {id:int} only matches if the segment is a valid integer. {slug:alpha} requires only letters. {guid:guid} validates a GUID.',
      '{*path} is the catch-all — it matches any remaining URL segments. Useful for file browser paths or CMS slug routing. Always define catch-all routes last; they match anything.',
      '[SupplyParameterFromQuery] maps a query string parameter to a component property. Cleaner than reading NavigationManager.Uri and parsing it manually. Works with primitive types and nullable variants.',
      'NavigationManager.GetUriWithQueryParameter and GetUriWithQueryParameters build URLs with typed parameters. Pass the result to NavigateTo to navigate without losing other existing query params.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Route constraints *@
@page "/products/{CategoryId:int}/{Slug:alpha}"

@* Catch-all *@
@page "/files/{*FilePath}"

@* Query string via attribute *@
@page "/search"

<h2>Results for: @Query</h2>
<p>Page @Page of results</p>

@code {
    [Parameter] public int CategoryId { get; set; }
    [Parameter] public string Slug { get; set; } = "";
    [Parameter] public string FilePath { get; set; } = "";

    [SupplyParameterFromQuery]
    public string Query { get; set; } = "";

    [SupplyParameterFromQuery]
    public int Page { get; set; } = 1;
}`,
      filename: 'AdvancedRouting.razor',
    },
    keyTakeaway: '[SupplyParameterFromQuery] is the cleanest way to sync query string params with component state — no URI parsing needed.',
  },

  {
    id: 'm-012',
    tier: 'mid',
    topicTitle: 'Complex Form Validation',
    source: { name: 'Blazor in Action', type: 'book', url: 'https://www.manning.com/books/blazor-in-action' },
    body: [
      'Custom validators: create a class that inherits ValidationAttribute and override IsValid. Decorate your model property with it. EditForm + DataAnnotationsValidator picks it up automatically.',
      'FluentValidation integration: add the Blazor.FluentValidation package, register validators in DI, replace DataAnnotationsValidator with FluentValidationValidator. Get fluent rule chaining with .WithMessage, .WithSeverity, and .DependentRules.',
      'Real-time validation: the EditContext.OnFieldChanged event fires every time a field value changes. Subscribe to it in OnInitialized to trigger validation immediately, not only on submit.',
      'FieldCssClass(EditContext, fieldIdentifier) returns "valid" or "invalid" based on current validation state. Use it in your input\'s class attribute to style fields with color feedback without a component library.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// Custom async validator
public class UniqueEmailAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(
        object? value, ValidationContext context)
    {
        var email = value as string;
        var db = context.GetService<AppDbContext>();

        // Note: sync only for ValidationAttribute
        // Use FluentValidation for async rules
        bool exists = db.Users.Any(u => u.Email == email);
        return exists
            ? new ValidationResult("Email already registered.")
            : ValidationResult.Success;
    }
}

// Real-time validation via EditContext events
@code {
    private EditContext editContext = default!;

    protected override void OnInitialized()
    {
        editContext = new EditContext(model);
        editContext.OnFieldChanged += (_, _) =>
            editContext.Validate();
    }
}`,
      filename: 'AdvancedForms.razor',
    },
    keyTakeaway: 'For business-rule validation, a custom ValidationAttribute keeps your logic in the model, not scattered across components.',
  },

  // ─── SENIOR TIER ───────────────────────────────────────────────────────────

  {
    id: 's-001',
    tier: 'senior',
    topicTitle: 'Blazor Performance Optimization',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/performance' },
    body: [
      'Profile before optimizing. Use browser DevTools performance tab for WASM apps. For Server, dotnet-trace captures component render times. Most performance problems trace to one root cause: unnecessary re-renders.',
      'ShouldRender() is your first lever. Override it in components that receive parameter updates but rarely need to visually change. Return false to skip the render cycle entirely.',
      'Lazy-load assemblies in WASM. Split rarely-used pages into a separate assembly. Register them in Program.cs with AdditionalAssemblies. The runtime only downloads them when that route is first visited — reduces initial load significantly.',
      'Avoid allocations in hot render paths. String interpolation inside a render loop creates garbage. Cache formatted strings or computed values in fields. @key prevents component recreation when lists reorder.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// Skip re-render when only non-visual params change
public class StableRow : ComponentBase
{
    [Parameter] public Product Product { get; set; } = default!;
    private Product _lastProduct = default!;

    protected override bool ShouldRender()
    {
        if (ReferenceEquals(Product, _lastProduct))
            return false;
        _lastProduct = Product;
        return true;
    }
}

// Lazy load in Program.cs (WASM)
var additionalAssemblies = new[]
{
    typeof(AdminPanel).Assembly,
    typeof(ReportsModule).Assembly
};
// Pass to <Router AdditionalAssemblies="additionalAssemblies">`,
      filename: 'PerformancePatterns.cs',
    },
    keyTakeaway: 'Profile first, optimize second. Most Blazor perf issues are unnecessary re-renders — ShouldRender() is your first lever.',
  },

  {
    id: 's-002',
    tier: 'senior',
    topicTitle: 'Ahead-of-Time (AOT) Compilation',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/tooling' },
    body: [
      'By default, .NET IL runs on a JIT interpreter inside the WASM runtime. AOT compiles that IL to native WebAssembly at publish time. No interpreter — the code runs directly on the CPU.',
      'The gain: CPU-bound operations run 2-10x faster. The cost: much larger download. A trivial app might go from 2 MB to 10+ MB. AOT is the right choice for apps that do heavy computation in the browser: signal processing, image manipulation, game logic.',
      'Enable with <RunAOTCompilation>true</RunAOTCompilation> in your .csproj. Requires the wasm-tools .NET workload: `dotnet workload install wasm-tools`. Publish time increases significantly — plan for it in CI.',
      'Mitigate the size increase with lazy loading, Brotli compression (already on by default in Azure/Nginx), and trimming. HTTP/2 push and service worker caching amortize the cost for returning users.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `<!-- Enable AOT in your .csproj -->
<PropertyGroup>
  <RunAOTCompilation>true</RunAOTCompilation>
  <!-- Trim unused IL to reduce size -->
  <PublishTrimmed>true</PublishTrimmed>
  <!-- Enable compression -->
  <CompressionEnabled>true</CompressionEnabled>
</PropertyGroup>

<!-- Install the required workload -->
<!-- dotnet workload install wasm-tools -->

<!-- Build for production -->
<!-- dotnet publish -c Release -->`,
      filename: 'BlazorApp.csproj',
    },
    abbreviations: [
      { term: 'AOT', fullForm: 'Ahead-of-Time', definition: 'Compilation strategy that converts IL code to native machine code before runtime, eliminating JIT overhead.' },
      { term: 'JIT', fullForm: 'Just-in-Time', definition: 'Compilation strategy that converts IL to native code at runtime, adding startup overhead but enabling runtime optimizations.' },
      { term: 'IL', fullForm: 'Intermediate Language', definition: 'The CPU-independent bytecode that .NET compiles C# into, before being JIT or AOT compiled to native code.' },
    ],
    keyTakeaway: 'AOT trades bigger bundles for faster execution — worth it for compute-heavy WASM apps, overkill for most CRUD interfaces.',
  },

  {
    id: 's-003',
    tier: 'senior',
    topicTitle: 'Component Design Patterns',
    source: { name: 'Khalid Abuhakmeh', type: 'blog', url: 'https://khalidabuhakmeh.com' },
    body: [
      'Compound components: a parent component manages shared state; children are pure display. The parent exposes state via CascadingValue, children consume it via [CascadingParameter]. Classic examples: Tabs/Tab, Accordion/AccordionPanel, Dropdown/DropdownItem.',
      'Render props via RenderFragment<T>: the component handles behavior (sorting, filtering, async loading), the consumer provides the template. Decouples layout concerns from behavior concerns.',
      'Provider pattern: a service component wraps a subtree in CascadingValue. Children consume the service by type. Useful for form context, drag-drop context, or theme.',
      'Prefer composition over inheritance. Blazor components can inherit from a base class, but composition via RenderFragment and CascadingValue is almost always cleaner — it\'s more testable and the interfaces are explicit.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@* Compound Tabs pattern *@

@* Tabs.razor — manages state *@
<CascadingValue Value="this">
    <div class="tabs">@ChildContent</div>
</CascadingValue>
@code {
    [Parameter] public RenderFragment? ChildContent { get; set; }
    public string ActiveTab { get; private set; } = "";
    public void SetActive(string id)
    {
        ActiveTab = id;
        StateHasChanged();
    }
}

@* Tab.razor — consumes state *@
@if (TabsContext?.ActiveTab == Id)
{
    <div class="tab-panel">@ChildContent</div>
}
@code {
    [CascadingParameter] public Tabs? TabsContext { get; set; }
    [Parameter] public string Id { get; set; } = "";
    [Parameter] public RenderFragment? ChildContent { get; set; }
}`,
      filename: 'Tabs.razor',
    },
    keyTakeaway: 'The compound component pattern (Tabs+Tab, Accordion+Panel) is the most reusable Blazor architecture for UI kits.',
  },

  {
    id: 's-004',
    tier: 'senior',
    topicTitle: 'Clean Architecture with Blazor',
    source: { name: 'Blazor in Action', type: 'book', url: 'https://www.manning.com/books/blazor-in-action' },
    body: [
      'Clean Architecture splits a solution into layers with a strict dependency rule: outer layers depend on inner layers, never the reverse.',
      'Domain: entities and value objects with no external dependencies. Application: use cases (commands/queries), interfaces for infrastructure concerns, DTOs. Infrastructure: EF Core, external APIs, email services — implementations of Application interfaces. WebUI: Blazor components that call Application use cases.',
      'Blazor components should be thin. They receive a view model (DTO), render it, and dispatch commands. Business logic belongs in the Application layer.',
      'Use MediatR for command/query dispatch in the Application layer. Each use case is a Command or Query record with a Handler. The Blazor component calls mediator.Send(new GetProductsQuery()). The component has no idea how products are fetched.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// Application layer — query
public record GetProductsQuery(string Category)
    : IRequest<List<ProductDto>>;

public class GetProductsHandler
    : IRequestHandler<GetProductsQuery, List<ProductDto>>
{
    private readonly IProductRepository _repo;
    public GetProductsHandler(IProductRepository repo)
        => _repo = repo;

    public async Task<List<ProductDto>> Handle(
        GetProductsQuery q, CancellationToken ct)
        => await _repo.GetByCategoryAsync(q.Category);
}

// Blazor component — just dispatches and renders
@inject IMediator Mediator

@code {
    private List<ProductDto> products = new();

    protected override async Task OnInitializedAsync()
    {
        products = await Mediator.Send(
            new GetProductsQuery("Electronics"));
    }
}`,
      filename: 'ProductsPage.razor',
    },
    abbreviations: [
      { term: 'DTO', fullForm: 'Data Transfer Object', definition: 'A simple object used to carry data between layers without exposing domain internals.' },
    ],
    keyTakeaway: 'Thin Blazor components + rich Application layer = maintainable at scale. The component\'s job is to render and dispatch, not compute.',
  },

  {
    id: 's-005',
    tier: 'senior',
    topicTitle: 'Blazor + gRPC',
    source: { name: 'Nick Chapsas', type: 'youtube', url: 'https://www.youtube.com/@nickchapsas' },
    body: [
      'gRPC-Web enables browser-to-server gRPC calls. Standard HTTP/2 gRPC can\'t run in browsers because browsers don\'t expose raw HTTP/2 frames. gRPC-Web adds an envelope layer that works over standard HTTP requests.',
      'Define your API in a .proto contract file. The tooling generates both the server stub (C# interface) and client code. Both client and server are strongly typed from the same contract — no JSON schema drift.',
      'Add the Grpc.Net.Client.Web NuGet package on the client. Register a GrpcChannel with GrpcWebHandler in DI. Inject the generated client and call methods — they look like regular async method calls.',
      'Trade-offs vs REST: binary protocol (smaller payloads, faster parse), contract-first (schema is the truth), streaming support. Downsides: harder to debug with browser DevTools, Proto changes need coordination, browser caching doesn\'t apply the same way.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// Register in Program.cs (WASM)
builder.Services.AddSingleton(sp =>
{
    var httpClient = new HttpClient(new GrpcWebHandler(
        GrpcWebMode.GrpcWeb,
        new HttpClientHandler()));

    var channel = GrpcChannel.ForAddress(
        "https://localhost:5001",
        new GrpcChannelOptions { HttpClient = httpClient });

    return new Greeter.GreeterClient(channel);
});

// Use in component
@inject Greeter.GreeterClient GrpcClient

@code {
    private string greeting = "";

    protected override async Task OnInitializedAsync()
    {
        var reply = await GrpcClient.SayHelloAsync(
            new HelloRequest { Name = "Blazor" });
        greeting = reply.Message;
    }
}`,
      filename: 'GrpcDemo.razor',
    },
    abbreviations: [
      { term: 'RPC', fullForm: 'Remote Procedure Call', definition: 'A protocol that allows a program to call a function on a remote server as if it were a local call.' },
      { term: 'REST', fullForm: 'Representational State Transfer', definition: 'An architectural style for HTTP APIs using resources, verbs (GET/POST/PUT/DELETE), and status codes.' },
    ],
    keyTakeaway: 'gRPC-Web + Blazor WASM = type-safe, binary-protocol API calls generated from .proto contracts — no JSON schema drift.',
  },

  {
    id: 's-006',
    tier: 'senior',
    topicTitle: 'Blazor Hybrid with MAUI',
    source: { name: 'dotnet YouTube channel', type: 'youtube', url: 'https://www.youtube.com/@dotnet' },
    body: [
      'BlazorWebView is a MAUI control that renders a Blazor app inside a native WebView. Your Blazor components run in the same process as the native app — no network calls between them, just method calls.',
      'The typical architecture: a shared Razor Class Library contains all components and services. A Blazor WASM project references it for the web. A MAUI project references it for native. One component codebase, two shells.',
      'Native device APIs are accessible via DI. Register platform-specific implementations in MauiProgram.cs. Inject them in components with an interface. The component doesn\'t know whether it\'s running in a browser or a native app.',
      'Known pain points: WebView rendering differences across platforms (especially iOS), debugging workflow is different from web, and some browser APIs are restricted in the native WebView. Test on real devices early.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// MauiProgram.cs
public static MauiApp CreateMauiApp()
{
    var builder = MauiApp.CreateBuilder();
    builder
        .UseMauiApp<App>()
        .ConfigureFonts(fonts =>
        {
            fonts.AddFont("Inter.ttf", "Inter");
        });

    // Add Blazor
    builder.Services.AddMauiBlazorWebView();

    // Register native services
    builder.Services.AddSingleton<ICameraService, MauiCameraService>();
    builder.Services.AddSingleton<IGeolocationService, MauiGeoService>();

    return builder.Build();
}

// MainPage.xaml — embed the Blazor app
<BlazorWebView HostPage="wwwroot/index.html">
    <BlazorWebView.RootComponents>
        <RootComponent Selector="#app" ComponentType="{x:Type local:App}" />
    </BlazorWebView.RootComponents>
</BlazorWebView>`,
      filename: 'MauiProgram.cs',
    },
    abbreviations: [
      { term: 'MAUI', fullForm: 'Multi-platform App UI', definition: 'Microsoft\'s cross-platform framework for building native apps for iOS, Android, Windows, and macOS from a single codebase.' },
    ],
    keyTakeaway: 'Blazor Hybrid shares your component library between web and native — reuse 90% of your web code to ship a native app.',
  },

  {
    id: 's-007',
    tier: 'senior',
    topicTitle: 'SSR and Streaming Rendering',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/components/render-modes' },
    body: [
      'Static SSR in .NET 8 renders components to HTML on the server with no runtime interactivity. No SignalR, no WASM download, no JavaScript. Pure HTML sent to the browser. Fastest possible first paint, works without JS.',
      '[StreamRendering(true)] tells the server to start flushing HTML immediately, before async work completes. The browser receives and renders the static shell first. Placeholders appear, then get replaced as awaited data arrives — like React Suspense, but server-side.',
      'This enables an architecture where your page loads instantly with a skeleton, then data fills in progressively — without any client-side JavaScript state or loading spinners in the traditional sense.',
      'Combine strategies: outer page is static SSR for fast paint, individual interactive sections use @rendermode InteractiveServer or InteractiveAuto. Each component picks its own mode. Content pages stay static; app sections become interactive islands.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `@page "/products"
@* StreamRendering flushes HTML before await completes *@
@attribute [StreamRendering(true)]

@if (products is null)
{
    @* This renders immediately, before data loads *@
    <ProductListSkeleton />
}
else
{
    @foreach (var p in products)
    {
        <ProductCard Product="p" />
    }
}

@code {
    private List<Product>? products;

    protected override async Task OnInitializedAsync()
    {
        @* Page flushes skeleton while this runs *@
        await Task.Delay(100); // simulates DB query
        products = await ProductRepository.GetAllAsync();
    }
}`,
      filename: 'ProductsPage.razor',
    },
    abbreviations: [
      { term: 'HTML', fullForm: 'HyperText Markup Language', definition: 'The standard language for structuring content on the web.' },
    ],
    keyTakeaway: '[StreamRendering] lets your page paint immediately while awaiting data — no full-page loading spinners.',
  },

  {
    id: 's-008',
    tier: 'senior',
    topicTitle: 'Custom Authentication Providers',
    source: { name: 'Chris Sainty', type: 'blog', url: 'https://chrissainty.com' },
    body: [
      'AuthenticationStateProvider is the contract between Blazor\'s auth system and your authentication mechanism. Implement it once and every [Authorize], <AuthorizeView>, and AuthenticationState consumer works automatically.',
      'Override GetAuthenticationStateAsync to return an AuthenticationState containing a ClaimsPrincipal. An unauthenticated state uses an empty ClaimsPrincipal. Populate claims with roles, email, and custom data from your token or session.',
      'When auth state changes (login or logout), call NotifyAuthenticationStateChanged(Task<AuthenticationState>). This propagates the change through the entire component tree without any manual re-render calls.',
      'For WASM + JWT: store the token in localStorage (or memory for security), parse it with JwtSecurityTokenHandler to extract claims, build a ClaimsPrincipal. Register as Scoped in DI.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `public class JwtAuthProvider : AuthenticationStateProvider
{
    private readonly ILocalStorageService _storage;

    public JwtAuthProvider(ILocalStorageService storage)
        => _storage = storage;

    public override async Task<AuthenticationState>
        GetAuthenticationStateAsync()
    {
        var token = await _storage.GetItemAsync<string>("token");
        if (string.IsNullOrEmpty(token))
            return new AuthenticationState(new ClaimsPrincipal());

        var identity = new ClaimsIdentity(
            ParseClaimsFromJwt(token), "jwt");
        return new AuthenticationState(
            new ClaimsPrincipal(identity));
    }

    public void NotifyUserLogin(string token)
    {
        var identity = new ClaimsIdentity(
            ParseClaimsFromJwt(token), "jwt");
        var state = Task.FromResult(new AuthenticationState(
            new ClaimsPrincipal(identity)));
        NotifyAuthenticationStateChanged(state);
    }
}`,
      filename: 'JwtAuthProvider.cs',
    },
    abbreviations: [
      { term: 'JWT', fullForm: 'JSON Web Token', definition: 'A compact token encoding claims as a signed JSON payload, used for stateless authentication.' },
      { term: 'OIDC', fullForm: 'OpenID Connect', definition: 'Identity layer on OAuth 2.0 providing user authentication and claims.' },
    ],
    keyTakeaway: 'Implement AuthenticationStateProvider once and every <AuthorizeView> and [Authorize] in your app works automatically.',
  },

  {
    id: 's-009',
    tier: 'senior',
    topicTitle: 'Multi-Tenancy Patterns',
    source: { name: 'Khalid Abuhakmeh', type: 'blog', url: 'https://khalidabuhakmeh.com' },
    body: [
      'Tenant resolution strategies: subdomain (tenant.myapp.com — parse in middleware), path prefix (/tenant-slug/dashboard — route parameter), or claim-based (tenant ID in JWT — best for API auth flows).',
      'Define an ITenantContext interface: TenantId, TenantSlug, ConnectionString. Create a Scoped implementation that resolves the tenant from IHttpContextAccessor on Server, or from the auth claim in WASM.',
      'Database strategies: one database per tenant (strong isolation, high cost), single database with tenant column + row-level security (efficient, one migration), schema-per-tenant (middle ground). Each has different EF Core implications.',
      'Surface the tenant context to components via CascadingValue from App.razor. Any nested component can consume [CascadingParameter] TenantContext. Eliminates prop drilling for a value that\'s needed everywhere.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// ITenantContext.cs
public interface ITenantContext
{
    string TenantId { get; }
    string TenantName { get; }
}

// App.razor — cascade to all components
<CascadingValue Value="tenantContext" Name="Tenant">
    <Router AppAssembly="typeof(App).Assembly">
        <Found Context="routeData">
            <RouteView RouteData="routeData" />
        </Found>
    </Router>
</CascadingValue>

@code {
    [Inject] ITenantContext tenantContext { get; set; } = default!;
}

// Any component
@code {
    [CascadingParameter(Name = "Tenant")]
    public ITenantContext? Tenant { get; set; }
}`,
      filename: 'TenancySetup.cs',
    },
    keyTakeaway: 'A Scoped ITenantContext + CascadingValue is the cleanest way to thread tenancy through your entire Blazor component tree.',
  },

  {
    id: 's-010',
    tier: 'senior',
    topicTitle: 'CI/CD for Blazor Apps',
    source: { name: 'dotnet YouTube channel', type: 'youtube', url: 'https://www.youtube.com/@dotnet' },
    body: [
      'GitHub Actions for WASM: checkout → setup-dotnet → dotnet restore → dotnet test → dotnet publish -c Release. Output lands in publish/wwwroot. Deploy to Azure Static Web Apps or GitHub Pages.',
      'The single most common deployment bug: deploying WASM to a subdirectory without setting <base href>. The app loads but all sub-navigation returns 404. Fix: <base href="/myapp/" /> in index.html to match the deployment path.',
      'Docker for Blazor Server: multi-stage build (SDK image for compile, aspnet runtime image for run). Publish in Release. Use a non-root user. The final image is ~100 MB. Add a healthcheck endpoint.',
      'Secrets: use GitHub Secrets for environment-specific values (connection strings, API keys). Reference them as environment variables in the workflow. In WASM, secrets baked into the published output are visible — use a backend proxy for anything sensitive.',
    ],
    codeBlock: {
      language: 'bash',
      code: `# .github/workflows/deploy.yml
name: Deploy Blazor WASM
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 8.x
      - run: dotnet restore
      - run: dotnet test --no-restore
      - run: dotnet publish -c Release -o ./publish
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: \${{ secrets.AZURE_TOKEN }}
          app_location: ./publish/wwwroot`,
      filename: 'deploy.yml',
    },
    abbreviations: [
      { term: 'CI', fullForm: 'Continuous Integration', definition: 'Automatically building and testing code on every commit to catch integration issues early.' },
      { term: 'CD', fullForm: 'Continuous Deployment', definition: 'Automatically deploying passing builds to production or staging environments.' },
    ],
    keyTakeaway: 'Set <base href> correctly before deploying WASM to a subdirectory — it\'s the #1 deployment gotcha.',
  },

  {
    id: 's-011',
    tier: 'senior',
    topicTitle: 'Debugging & Profiling in WASM',
    source: { name: 'Microsoft Docs', type: 'docs', url: 'https://learn.microsoft.com/aspnet/core/blazor/debug' },
    body: [
      'You can set C# breakpoints in Blazor WASM apps that run in the browser. Enable it by adding the debugger configuration to launchSettings.json, then attach VS Code\'s "Blazor WebAssembly Debug" profile.',
      'Source maps translate WASM byte offsets back to C# line numbers. The browser debugger shows your .cs files with correct line numbers. Step through C# code in Chrome DevTools or Edge DevTools.',
      'For performance profiling, use the browser\'s Performance tab. WASM calls appear as native frames in the flame graph. For memory analysis, use dotnet-monitor to attach to the runtime and capture heap snapshots.',
      'Console.WriteLine and Debug.WriteLine both route to the browser console. Use structured logging with ILogger<T> — the logs appear in the console and can be shipped to a logging service. The logging infrastructure is the same as server-side .NET.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// launchSettings.json — enable WASM debugging
{
  "profiles": {
    "BlazorApp": {
      "commandName": "Project",
      "launchBrowser": true,
      "inspectUri": "{wsProtocol}://{url.hostname}:{url.port}/_framework/debug/ws-proxy?browser={browserInspectUri}",
      "applicationUrl": "https://localhost:5001"
    }
  }
}

// Structured logging in a component
@inject ILogger<MyComponent> Logger

@code {
    protected override async Task OnInitializedAsync()
    {
        Logger.LogInformation("Component initializing");
        try
        {
            var data = await Api.LoadAsync();
            Logger.LogInformation("Loaded {Count} items", data.Count);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Load failed");
        }
    }
}`,
      filename: 'DebuggingDemo.razor',
    },
    abbreviations: [
      { term: 'WASM', fullForm: 'WebAssembly', definition: 'Binary instruction format running in browsers at near-native speed.' },
    ],
    keyTakeaway: 'C# breakpoints in the browser work — the debugging story for Blazor WASM is far better than most developers expect.',
  },

  {
    id: 's-012',
    tier: 'senior',
    topicTitle: 'Custom Render Pipelines',
    source: { name: 'Khalid Abuhakmeh', type: 'blog', url: 'https://khalidabuhakmeh.com' },
    body: [
      'HtmlRenderer renders Blazor components to an HTML string outside of any HTTP request or component tree. Use it to generate email bodies, PDFs, or static pages from your component library.',
      'Implement IComponent directly (the interface ComponentBase implements) for ultra-low-overhead leaf components. You bypass the Razor compiler and build the render tree manually. Useful for performance-critical list items rendered thousands of times.',
      'IComponentRenderMode is the interface for custom render modes. Implement it to create your own mode — for example, a "print mode" that strips interactivity or a "preview mode" with mocked data.',
      'The diffing algorithm works by comparing the previous render tree with the new one. Understanding it helps you write components that generate minimal diffs. Stable keys, stable component types, and stable parameter types all reduce diff work.',
    ],
    codeBlock: {
      language: 'csharp',
      code: `// Render a Blazor component to HTML string
// (e.g., for email generation)
public class EmailRenderer
{
    private readonly HtmlRenderer _renderer;

    public EmailRenderer(IServiceProvider services)
    {
        _renderer = new HtmlRenderer(services,
            NullLoggerFactory.Instance);
    }

    public async Task<string> RenderAsync<TComponent>(
        Dictionary<string, object?> parameters)
        where TComponent : IComponent
    {
        var html = await _renderer.Dispatcher.InvokeAsync(async () =>
        {
            var output = await _renderer.RenderComponentAsync<TComponent>(
                ParameterView.FromDictionary(parameters));
            return output.ToHtmlString();
        });
        return html;
    }
}

// Usage
var html = await emailRenderer.RenderAsync<WelcomeEmail>(
    new() { ["UserName"] = "Alice" });
await emailService.SendAsync(to: "alice@example.com", body: html);`,
      filename: 'EmailRenderer.cs',
    },
    keyTakeaway: 'HtmlRenderer.RenderComponentAsync turns any Blazor component into an HTML template engine — perfect for emails and PDF generation.',
  },
];
