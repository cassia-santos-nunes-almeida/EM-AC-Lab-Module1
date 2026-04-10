---
name: matlab
description: >
  Use when: writing MATLAB or GNU Octave scripts, numerical computing,
  matrix operations, solving linear systems, ODE/PDE solvers, plotting,
  data analysis, curve fitting, signal processing.
  Trigger: "MATLAB", "Octave", "write a script", "solve numerically",
  "plot this", "ODE solver", "matrix equation", ".m file".
---

# MATLAB / GNU Octave

Generate MATLAB scripts that run under both MATLAB and GNU Octave (the free, open-source alternative). Every script this skill produces must be portable unless the user explicitly requests a MATLAB-only or Octave-only feature.

## Compatibility Rule

All generated code defaults to the **portable subset** shared by MATLAB and Octave. When a MATLAB-only or Octave-only construct is unavoidable, add a comment:

```matlab
% NOTE: MATLAB-only — requires Statistics Toolbox
% NOTE: Octave-only — use pkg load signal
```

See `references/octave-compatibility.md` for the full compatibility guide.

## Workflow

### 1. Clarify the problem

Identify what the user needs: equation solving, data analysis, visualization, simulation, or a combination. Determine whether the output is a standalone script (.m) or a function.

### 2. Choose structure

| Need | Use |
|------|-----|
| One-off computation or plot | Script (.m) |
| Reusable computation with inputs | Function (.m, filename matches function name) |
| Quick inline operation | Anonymous function `f = @(x) ...` |

### 3. Generate the script

Follow these conventions:

- **Vectorize** — avoid loops when array operations work:
  ```matlab
  % avoid
  for i = 1:length(x)
      y(i) = sin(x(i));
  end
  % prefer
  y = sin(x);
  ```

- **Preallocate** — when loops are necessary:
  ```matlab
  y = zeros(1, N);
  for i = 1:N
      y(i) = compute(i);
  end
  ```

- **Solve linear systems with backslash**, never `inv()`:
  ```matlab
  x = A \ b;      % correct: numerically stable
  % x = inv(A) * b;  % avoid: numerically unstable, slower
  ```

- **Use `%` for comments** (not `#`, which is Octave-only).

- **Use `end` for block terminators** (not `endif`, `endfor`, etc.).

- **Use `...` for line continuation** (not `\`).

- **Use single quotes for strings** unless double-quote string objects are specifically needed.

- **Save MAT-files with `-v7`** for cross-compatibility:
  ```matlab
  save('data.mat', 'x', 'y', '-v7');
  ```

### 4. Provide execution instructions

```bash
# MATLAB
matlab -batch "run('script.m')"

# GNU Octave
octave --quiet --no-gui script.m
```

For functions:

```bash
# MATLAB
matlab -batch "result = myfunc(args)"

# GNU Octave
octave --quiet --eval "result = myfunc(args)"
```

## Patterns

### Data analysis pipeline

```matlab
% Load -> clean -> analyze -> visualize -> save
data = readtable('data.csv');
data = rmmissing(data);

results = groupsummary(data, 'Category', 'mean', 'Value');

figure;
bar(results.Category, results.mean_Value);
xlabel('Category'); ylabel('Mean Value');
title('Results by Category');
grid on;

writetable(results, 'results.csv');
saveas(gcf, 'results.png');
```

### Numerical simulation (time-stepping)

```matlab
% Parameters
N = 100; T = 10; dt = 0.01;
x = linspace(0, 1, N);
dx = x(2) - x(1);

% Initial condition
u = sin(pi * x);

% Time-stepping loop (heat equation example)
u_new = zeros(size(u));
for t_step = 0:dt:T
    u_new(2:N-1) = u(2:N-1) + dt/(dx^2) * (u(3:N) - 2*u(2:N-1) + u(1:N-2));
    u_new(1) = 0; u_new(N) = 0;  % boundary conditions
    u = u_new;
end

plot(x, u);
xlabel('x'); ylabel('u');
title('Solution at t = T');
```

### ODE solving

```matlab
% Convert higher-order ODE to first-order system
% Example: y'' + 2y' + y = 0, y(0)=1, y'(0)=0
% Let y1 = y, y2 = y'
odefun = @(t, y) [y(2); -2*y(2) - y(1)];
[t, y] = ode45(odefun, [0 10], [1; 0]);

figure;
plot(t, y(:,1), 'b-', 'LineWidth', 1.5);
xlabel('Time'); ylabel('y(t)');
title('Second-order ODE Solution');
grid on;
```

### Batch file processing

```matlab
files = dir('data/*.csv');
results = cell(length(files), 1);

for i = 1:length(files)
    filepath = fullfile(files(i).folder, files(i).name);
    data = readtable(filepath);
    results{i} = analyze(data);
end

all_results = vertcat(results{:});
writetable(all_results, 'combined_results.csv');
```

## ODE Solver Selection

| Solver | When to use |
|--------|-------------|
| `ode45` | Default choice. Nonstiff problems, medium accuracy. |
| `ode23` | Nonstiff, lower accuracy, faster per step. |
| `ode113` | Nonstiff, high accuracy, variable order. |
| `ode15s` | Stiff problems. Try this if `ode45` is very slow. |
| `ode23s` | Stiff, low order. |
| `ode23t` | Moderately stiff, trapezoidal rule. |

## Toolbox Awareness

These functions require paid MATLAB toolboxes. In Octave, equivalent functionality may be available via `pkg load <package>`.

| Function | MATLAB Toolbox | Octave package |
|----------|---------------|----------------|
| `lsqcurvefit` | Optimization | `optim` |
| `boxplot` | Statistics | `statistics` |
| `fmincon` | Optimization | `optim` |
| `butter`, `cheby1` | Signal Processing | `signal` |
| `bode`, `tf`, `ss` | Control System | `control` |
| `imread`/`imshow` (advanced) | Image Processing | `image` |

When generating scripts that use toolbox functions, always note the dependency and suggest the Octave package alternative.

## Reference Files

| File | Contents |
|------|----------|
| `references/core-math.md` | Matrices, linear algebra, calculus, ODEs, optimization, statistics |
| `references/visualization.md` | 2D/3D plots, figure management, export |
| `references/octave-compatibility.md` | Syntax differences, portable patterns, package system |
| `references/data-io.md` | File I/O, tables, structs, MAT-files |

## Common Mistakes to Avoid

1. **Using `inv(A) * b` instead of `A \ b`** — backslash is faster and numerically stable.
2. **Growing arrays in loops** — always preallocate with `zeros()` or `ones()`.
3. **Using `clear all` in functions** — clears the entire workspace. Use `clearvars` with specific variables if needed.
4. **Saving MAT-files as `-v7.3`** — uses HDF5 format with partial Octave support. Default to `-v7` for portability.
5. **Using `arguments` blocks** — MATLAB R2019b+ only, not supported in Octave.
6. **Using `++`, `+=` operators** — Octave-only, not valid MATLAB.
7. **Using `#` for comments** — Octave-only. Always use `%`.
8. **Using `endif`, `endfor`** — Octave-only block terminators. Always use `end`.
