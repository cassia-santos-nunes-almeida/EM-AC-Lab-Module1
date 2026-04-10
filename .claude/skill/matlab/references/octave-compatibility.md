# GNU Octave Compatibility

## Installation

```bash
# macOS
brew install octave

# Ubuntu/Debian
sudo apt install octave

# Fedora
sudo dnf install octave

# Windows — download from https://octave.org/download
```

## Execution

```bash
# Run script
octave --quiet --no-gui script.m

# Run expression
octave --quiet --eval "result = myfunc(42)"

# MATLAB equivalent
matlab -batch "run('script.m')"
```

## Syntax to Avoid for Portability

| Feature | MATLAB | Octave | Portable |
|---------|--------|--------|----------|
| Comments | `%` | `%` or `#` | Always use `%` |
| Line continuation | `...` | `...` or `\` | Always use `...` |
| Block terminators | `end` | `end`, `endif`, `endfor` | Always use `end` |
| Increment | `x = x + 1` | `x++`, `x += 1` | Always use `x = x + 1` |
| Strings | `'single'` | `'single'` or `"double\n"` | Use `'single quotes'` |
| Indexing after call | temp = f(x); temp(1) | f(x)(1) | Use intermediate variable |
| Input validation | `arguments` block | Not supported | Use manual checks |

## Features Not Available in Octave

- **Simulink** (.slx/.mdl models)
- **App Designer / GUIDE**
- **Live Scripts** (.mlx)
- **`arguments` blocks** (input validation syntax)
- **`tiledlayout`/`nexttile`** (use `subplot` instead)
- **`exportgraphics`** (use `print` or `saveas`)
- **Most commercial toolboxes** (see package equivalents below)

## Octave Forge Packages

Octave packages provide equivalents for many MATLAB toolboxes:

```matlab
% Install package
pkg install -forge signal

% Load before use (required each session)
pkg load signal

% Auto-load at startup: add to ~/.octaverc
pkg load signal
pkg load control
```

| MATLAB Toolbox | Octave Package | Install |
|----------------|---------------|---------|
| Signal Processing | `signal` | `pkg install -forge signal` |
| Control System | `control` | `pkg install -forge control` |
| Image Processing | `image` | `pkg install -forge image` |
| Statistics | `statistics` | `pkg install -forge statistics` |
| Optimization | `optim` | `pkg install -forge optim` |
| Symbolic Math | `symbolic` | `pkg install -forge symbolic` |
| I/O functions | `io` | `pkg install -forge io` |

## MAT-File Compatibility

```matlab
% Portable format (recommended)
save('data.mat', 'x', 'y', '-v7');

% HDF5 format — partial Octave support, avoid for portability
% save('data.mat', 'x', 'y', '-v7.3');
```

## Graphics Differences

- Octave uses **Qt** or **gnuplot** as graphics backends (not MATLAB's Java-based engine)
- Basic `plot`, `surf`, `contour`, `bar`, `histogram` work in both
- Some advanced property names may differ
- `exportgraphics` unavailable — use `print` or `saveas`
- `tiledlayout`/`nexttile` unavailable — use `subplot`
- Test plots in both environments if visual fidelity matters

## Detect Environment at Runtime

```matlab
function tf = isOctave()
    tf = exist('OCTAVE_VERSION', 'builtin') ~= 0;
end

% Conditional code when unavoidable
if isOctave()
    pkg load signal;
    print('-dpng', '-r300', 'plot.png');
else
    exportgraphics(gcf, 'plot.png', 'Resolution', 300);
end
```

## Writing Portable Code — Checklist

1. Use `%` comments, `...` continuation, `end` terminators
2. Use `'single quotes'` for char arrays
3. Use intermediate variables for chained indexing
4. Save MAT-files with `-v7`
5. Avoid `arguments` blocks — validate manually if needed
6. Avoid `++`, `+=`, `--`, `-=` operators
7. Use `subplot` instead of `tiledlayout`
8. Use `print`/`saveas` instead of `exportgraphics`
9. Note toolbox dependencies and suggest Octave package alternatives
10. Test critical scripts in both environments
