# Commands

## About

This document details the commands that Claude Code is authorized to perform without seeking permission.

* **Risk** is defined as `Critical`, `High`, `Medium`, or `Low`.
* **Allowed** refers to Claude being authorized to run this command autonomously without human intervention (`Yes` or `No`).

## Policy Catalog

### 1. File System Navigation & Search (`grep`, `find`, `ls`)

| Rule ID        | Command Scope                                | Risk     | Allowed? |
| -------------- | -------------------------------------------- | -------- | -------- |
| **SEC-FS-001** | Local Project Directory Search               | Low      | Yes      |
| **SEC-FS-002** | Arbitrary Shell Chaining / Injection Attempt | Critical | No       |
| **SEC-FS-003** | Local Project Directory Recursive Search     | Low      | Yes      |
| **SEC-FS-004** | Node Modules Dependency Search with Fallback | Low      | Yes      |
| **SEC-FS-005** | Node Modules File View with Search Fallback  | Low      | Yes      |
| **SEC-FS-006** | Git Worktree Dependency Symlinking           | Medium   | Yes      |
| **SEC-FS-007** | Git Worktree Dependency Cleanup              | Medium   | Yes      |

### 2. Package Management & Build Tools (`pnpm`, `npm`, `yarn`)

| Rule ID         | Command Scope                                | Risk   | Allowed? |
| --------------- | -------------------------------------------- | ------ | -------- |
| **SEC-PKG-001** | Local Project Build & Type Generation        | Medium | Yes      |
| **SEC-PKG-002** | Local Project Code Linting                   | Low    | Yes      |
| **SEC-PKG-003** | Local TypeScript Type Checking               | Low    | Yes      |
| **SEC-PKG-004** | Local Production Application Build           | High   | Yes      |
| **SEC-PKG-005** | Next.js Build with Custom Node/Webpack Flags | High   | Yes      |

### 3. Version Control & Source Code Management (git, gh)

| Rule ID         | Command Scope                          | Risk   | Allowed? |
| --------------- | -------------------------------------- | ------ | -------- |
| **SEC-GIT-001** | Stage All Local Modifications          | Low    | Yes      |
| **SEC-GIT-002** | Commit Staged Modifications Locally    | Medium | Yes      |
| **SEC-GIT-003** | Automated GitHub Pull Request Creation | High   | No       |

---

## Rule Signatures

### Category: File System Navigation & Search

#### **SEC-FS-001: Local Project Directory Search**

* **Purpose**: Searches within the project directory for a string, optionally piping a limited number of lines to head.
* **Signature Pattern**:

```bash
grep -n "[^"]+" /home/harrywest/grcmana-website/.* (| head -\d+)?

```

#### **SEC-FS-002: Arbitrary Shell Chaining Attempt**

* **Purpose**: Matches any grep command trying to escape boundaries using shell separators like semicolons, ampersands, or logical ORs.
* **Signature Pattern**:

```bash
grep -n "[^"]+" /.* [;&||]

```

#### **SEC-FS-003: Local Project Directory Recursive Search**

* **Purpose**: Recursively searches a specific project directory for matching terms, piping the first 30 lines to head.
* **Signature Pattern**:

```bash
grep -rn "[^"]+" /home/harrywest/grcmana-website/.claude/skills/payload/reference/ (\| head -\d+)?

```

* **Why this is safe:** Although recursive (`-r`) grep commands can sometimes risk Performance Degradation (DoS) if executed on root directories, this signature tightly confines the scope to a highly specific, local reference directory.
* **Guardrail Check:** The rule requires the tracking `| head -30` pipe pattern (or similar line limitations) to guarantee that Claude doesn't overwhelm your terminal buffer if it encounters massive text files within that directory.

### Command Evaluation

This command introduces fallback chaining using a logical OR (`||`) operator and directs errors to the null device (`2>/dev/null`). It attempts to search compiled JavaScript inside `node_modules` first, falling back to the plugin's source directory if the first search yields no results.

Here is the update for your `commands.md` file.

#### **SEC-FS-004: Node Modules Dependency Search with Fallback**

* **Purpose**: Searches a specific third-party dependency directory for terms, falling back to its source directory if the primary target fails.
* **Signature Pattern**:

```bash
grep -n "[^"]+" /home/harrywest/grcmana-website/node_modules/.* 2>/dev/null \| head -\d+ \|\| grep -rn "[^"]+" /home/harrywest/grcmana-website/node_modules/.* 2>/dev/null \| head -\d+

```

* **Why this is safe:** Although the command utilizes a logical OR (`||`) operator—which can be dangerous if used for arbitrary command chaining—the fallback command is strictly restricted to another read-only `grep` operation. Furthermore, both target scopes are locked down to a specific, non-system dependency subfolder (`@payloadcms/plugin-nested-docs/`).
* **Guardrail Check:** The rule requires that both sides of the `||` operator strictly target paths within the `/home/harrywest/grcmana-website/node_modules/` directory structure, ensure error suppression (`2>/dev/null`) does not mask unauthorized commands, and enforce line truncation (`head`) on both pipelines.

#### **SEC-FS-005: Node Modules File View with Search Fallback**

* **Purpose**: Attempts to output a specific dependency file's contents, falling back to a scoped file search if missing.
* **Signature Pattern**:

```bash
cat /home/harrywest/grcmana-website/node_modules/.* 2>/dev/null \|\| find /home/harrywest/grcmana-website/node_modules/.* -name "[^"]+" \| head -\d+

```

* **Why this is safe:** Both `cat` and `find` are natively read-only utilities. While chaining with `||` can theoretically allow execution of arbitrary second-stage payloads, this signature restricts the fallback entirely to a scoped `find` command bound strictly inside your local `node_modules` project path.
* **Guardrail Check:** The rule requires that both the initial `cat` command and the fallback `find` command point exclusively to targets within the `/home/harrywest/grcmana-website/node_modules/` directory structure, and that the `find` segment forces line truncation via `head` to avoid terminal buffer exhaustion.

#### **SEC-FS-006: Git Worktree Dependency Symlinking**

* **Purpose**: Creates relative symbolic links for package dependencies inside a specific project git worktree directory.
* **Signature Pattern**:

```bash
ln -s /home/harrywest/grcmana-website/node_modules /home/harrywest/grcmana-website/.claude/worktrees/[^/]+/node_modules && ln -s /home/harrywest/grcmana-website/\.pnpm-store /home/harrywest/grcmana-website/.claude/worktrees/[^/]+/\.pnpm-store 2>/dev/null; echo "done"

```

* **Why this is safe:** While `ln -s` modifies the filesystem, it only creates pointers (shortcuts) rather than creating, modifying, or deleting actual source code files. The command is tightly constrained to internal project infrastructure (`.claude/worktrees/`), allowing Claude to efficiently share dependencies across branch environments without re-running heavy installations.
* **Guardrail Check:** The rule must strictly enforce that both target paths and destination paths reside entirely within the `/home/harrywest/grcmana-website/` hierarchy. The worktree name slot should use a strict regex placeholder (`[^/]+`) to block directory traversal tricks (e.g., trying to write symlinks to `/etc/` or `~/.ssh/`).
* **Residual Risk Warning:** Material risk arises if Claude is tricked via prompt injection into symlinking a sensitive host directory (like your user root or configuration paths) into a public-facing web directory where it could be read or exfiltrated. This signature relies on strict regex constraint of both the source and destination paths.

#### **SEC-FS-007: Git Worktree Dependency Cleanup**

* **Purpose**: Removes a specific dependency symbolic link inside a project git worktree directory.
* **Signature Pattern**:

```bash
rm /home/harrywest/grcmana-website/.claude/worktrees/[^/]+/node_modules

```

* **Why this is safe:** Although `rm` is an inherently high-risk deletion utility, this pattern restricts the target explicitly to a `node_modules` path inside an ephemeral development worktree (`.claude/worktrees/`). Since the target file is a symbolic link (as established by the setup workflow), deleting it merely breaks the reference and does not delete actual source files or global dependency stores.
* **Guardrail Check:** The rule must strictly enforce that the target path matches the exact worktree layout under `/home/harrywest/grcmana-website/` and terminates precisely at `/node_modules`. No recursive flags (`-r`, `-R`) or force flags (`-f`) should be permitted in this signature to prevent accidental or malicious cascade deletions of actual project files.
* **Residual Risk Warning:** If a prompt injection attack tricks Claude into running this command when `node_modules` is a real directory rather than a symbolic link, the command will fail (since `rm` without `-r` cannot delete directories). However, if flags are loosely handled or if nested files are targeted, it could result in local data loss.

---

### Category: Package Management & Build Tools

#### **SEC-PKG-001: Local Project Build & Type Generation**

* **Purpose**: Navigates to the project directory and executes a local package script to generate TypeScript definitions.
* **Signature Pattern**:

```bash
cd /home/harrywest/grcmana-website && pnpm payload generate:types 2>&1

```

* **Why this is safe:** While running local build processes carries inherently higher risk than read-only commands (due to potential execution of compromised downstream dependency code), this script is limited to a locked, local CMS script (`payload generate:types`) that operates on existing project schemas. It does not pull down new packages from the internet or install unvetted code.
* **Guardrail Check:** The rule must explicitly match the static script string `payload generate:types` and be structurally chained *only* via `&&` immediately following a deterministic directory switch to `/home/harrywest/grcmana-website`. No wildcard operators (`*`) or variable expansions should be authorized within this command pattern.
* **Residual Risk Warning:** Material risk exists if local source code or dependencies have been maliciously tampered with prior to execution. This command assumes the underlying integrity of the local codebase schema configurations.

#### **SEC-PKG-002: Local Project Code Linting**

* **Purpose**: Runs the locally configured linter script to analyze code quality and static syntax issues.
* **Signature Pattern**:

```bash
pnpm lint 2>&1

```

* **Why this is safe:** Linting is natively a static analysis process designed to read source files and flag style or syntax violations. It does not compile binaries, spin up servers, or execute the core application logic, making it highly secure to run autonomously.
* **Guardrail Check:** The rule must match the exact string `pnpm lint 2>&1` without any additional flags, variable expansions, or appended file paths that could be manipulated to bypass the linting scope.
* **Residual Risk Warning:** While rare, a malicious actor could modify the local `.eslintrc` or equivalent linter configuration file to execute arbitrary Node scripts via custom plugin hooks when the lint command is triggered. This rule assumes the integrity of the local repository configuration files.

#### **SEC-PKG-003: Local TypeScript Type Checking**

* **Purpose**: Runs the TypeScript compiler strictly to perform type checking across the project without generating output files.
* **Signature Pattern**:

```bash
pnpm exec tsc --noEmit 2>&1

```

* **Why this is safe:** The `--noEmit` flag guarantees that the compiler acts purely as a static analysis tool. It reads code to validate type safety but is blocked from writing, overwriting, or compiling any JavaScript files to disk, eliminating the risk of rogue file generation.
* **Guardrail Check:** The rule must strictly require the `--noEmit` flag to be present and match the static string exactly. No file path arguments or additional flags should be permitted to ensure Claude evaluates the whole project using the local `tsconfig.json` constraints.
* **Residual Risk Warning:** Running `tsc` triggers code execution of any custom TypeScript compiler plugins or transformers configured globally or locally within your project's build setup. This permission assumes that your `tsconfig.json` and compiler plugins have not been maliciously altered.

#### **SEC-PKG-004: Local Production Application Build**

* **Purpose**: Compiles and bundles the local application code into optimized assets ready for production deployment.
* **Signature Pattern**:

```bash
pnpm build 2>&1

```

* **Why this is safe:** It executes an explicitly declared package lifecycle script (`build`) bundled within your repository. It manages compiling local UI code, optimizing bundles, and preparing static pages locally without modifying your active filesystem state outside of the project's output/build directories.
* **Guardrail Check:** The rule must strictly match the string `pnpm build 2>&1` exactly. It cannot permit arbitrary appended variables, custom system environment flags, or inline overrides that could alter how Node behaves during the compile phase.
* **Residual Risk Warning:** Full application compilation carries High risk because it executes arbitrary code across your entire codebase and `node_modules` dependency tree. If an untrusted package or compromise exists in your local code, running a build can trigger malicious pre-build or post-build lifecycle hooks, or bake persistent security flaws directly into the production bundle.

#### **SEC-PKG-005: Next.js Build with Custom Node/Webpack Flags**

* **Purpose**: Navigates to the project directory and invokes the local Next.js build binary using specialized environment and node engine flags.
* **Signature Pattern**:

```bash
cd /home/harrywest/grcmana-website && NEXT_PRIVATE_FORCE_WEBPACK=1 NODE_OPTIONS=--no-deprecation node_modules/\.bin/next build 2>&1

```

* **Why this is safe:** Although it bypasses default framework settings by injecting specific environment flags, it remains isolated to invoking your local `node_modules` framework binaries directly. It serves the same architectural purpose as running a standard `pnpm build`, but targets the underlying Next.js compiler directly to streamline build pipelines.
* **Guardrail Check:** The rule must tightly enforce that the directory switch maps directly to your authorized repository `/home/harrywest/grcmana-website`. Crucially, the pattern must match the literal string arguments exactly—any attempt by Claude to change `NODE_OPTIONS` to pass arbitrary flags (such as `--require` or `--experimental-policy`, which allow remote code execution) must be caught and blocked.
* **Residual Risk Warning:** Full application compilation via Next.js triggers static page rendering and executes internal API routes, component code, and configuration scripts locally. If a malicious dependency or source code mutation has been injected, running this build can cause arbitrary code execution or leak data contained in environment variables to a compromised build pipeline.

### 3. Version Control & Source Code Management (`git`, `gh`)

### Category: Version Control & Source Code Management

#### **SEC-GIT-001: Stage All Local Modifications**

* **Purpose**: Stages all current working directory modifications, deletions, and new files into the Git index.
* **Signature Pattern**:

```bash
git add \.

```

* **Why this is safe:** Running `git add .` is inherently an internal, undoable preparation step. It modifies the Git index locally but does not commit changes to history, push code to remote servers, or execute any project files, keeping the operational risk low.
* **Guardrail Check:** The rule must match the exact string `git add .` precisely. It should not accept target path wildcards or specific external files outside the current repository scope to prevent accidentally staging untracked files from outside the project.
* **Residual Risk Warning:** If Claude has been compromised by a prompt injection attack and has generated hidden malicious files in your directory, this command will blindly stage them for the next commit. It assumes the human operator will review the staged changes via `git status` or `git diff` before committing.

#### **SEC-GIT-002: Commit Staged Modifications Locally**

* **Purpose**: Saves the currently staged snapshots to the local repository history with an associated descriptive message.
* **Signature Pattern**:

```bash
git commit -m "[^"]+"

```

* **Why this is safe:** This operation records a snapshot strictly within your local `.git` history. It remains fully reversible (via `git reset`) and does not broadcast changes to GitHub or any remote server, meaning errors or unintended modifications are safely contained on your host machine.
* **Guardrail Check:** The signature must enforce that the `-m` flag accompanies a string message, and it must disallow flags like `--allow-empty-message` or external file inclusions. It must also block hooks bypasses (such as `--no-verify`) if you use pre-commit hooks to scan for secrets.
* **Residual Risk Warning:** If Claude writes the commit message autonomously, a compromised agent could write misleading messages to mask malicious changes (e.g., writing "fix typo" while committing a backdoored dependency). It relies heavily on subsequent human verification before pushing.

#### **SEC-GIT-003: Automated GitHub Pull Request Creation**

* **Purpose**: Submits local branch changes to the remote upstream repository and automatically opens a new GitHub pull request.
* **Signature Pattern**:

```bash
gh pr create --title "[^"]+" --body "[^"]+"

```

* **Risk Level:** High
* **Allowed:** No
* **Why this is unsafe for autonomy:** Giving an LLM agent the autonomy to publish code and open pull requests creates a direct path for automated source code poisoning. If the agent's context window is compromised, it could generate malicious code, commit it, push it, and open a PR to your production branches entirely without your knowledge.
* **Guardrail Check:** This pattern should be explicitly blocked from autonomous execution. It requires strict Human-in-the-Loop (HITL) review to verify the titles, descriptions, and the underlying code delta before any external repository state is modified.
* **Residual Risk Warning:** Even with manual approval, the operator must do a thorough line-by-line review of the branch's actual `git diff` on GitHub rather than trusting the summary written in the PR body by the AI.
