# Core Mathematics Reference

## Matrix Creation

```matlab
A = [1 2 3; 4 5 6; 7 8 9];     % 3x3 matrix
v = 1:0.5:10;                   % row vector with step
v = linspace(0, 1, 100);        % 100 evenly spaced points
v = logspace(0, 3, 50);         % 50 points from 10^0 to 10^3

% Special matrices
I = eye(n);                     % identity
Z = zeros(m, n);                % zeros
O = ones(m, n);                 % ones
D = diag([1 2 3]);              % diagonal from vector
d = diag(A);                    % extract diagonal
R = rand(m, n);                 % uniform [0,1]
R = randn(m, n);                % normal (0,1)
R = randi([a b], m, n);         % random integers in [a,b]

% Grids for 2D/3D evaluation
[X, Y] = meshgrid(x, y);
```

## Indexing

```matlab
A(2, 3)                         % row 2, col 3
A(2, :)                         % entire row 2
A(:, 3)                         % entire column 3
A(1:2, 2:3)                     % submatrix
A(end, :)                       % last row
A(A > 5)                        % elements > 5 (logical indexing)
A(A < 0) = 0;                   % set negatives to zero
[row, col] = find(A > 5);       % subscript indices of matches
```

## Element-wise vs Matrix Operations

```matlab
C = A * B;                      % matrix multiplication
C = A .* B;                     % element-wise multiplication
C = A ./ B;                     % element-wise division
C = A .^ n;                     % element-wise power
C = A';                         % conjugate transpose
C = A.';                        % transpose (no conjugate)
```

## Linear Algebra

### Solving Linear Systems

```matlab
x = A \ b;                      % solve Ax = b (preferred)
x = linsolve(A, b);             % with solver options
x = lsqminnorm(A, b);           % minimum-norm least squares
% NEVER use inv(A) * b — numerically unstable and slower
```

### Decompositions

```matlab
[L, U, P] = lu(A);              % LU: P*A = L*U
[Q, R] = qr(A);                 % QR decomposition
[Q, R] = qr(A, 0);              % economy-size QR
R = chol(A);                    % Cholesky (symmetric positive definite)
[U, S, V] = svd(A);             % SVD: A = U*S*V'
[U, S, V] = svd(A, 'econ');     % economy-size SVD
```

### Eigenvalues

```matlab
e = eig(A);                     % eigenvalues only
[V, D] = eig(A);                % V: eigenvectors, D: eigenvalues on diagonal
                                % A*V = V*D
e = eig(A, B);                  % generalized: A*v = lambda*B*v
```

### Matrix Properties

```matlab
d = det(A);                     % determinant
t = trace(A);                   % trace
r = rank(A);                    % rank
n = norm(A);                    % 2-norm (default)
n = norm(A, 'fro');             % Frobenius norm
c = cond(A);                    % condition number
p = pinv(A);                    % pseudoinverse
```

## Trigonometric and Elementary Functions

```matlab
% Radians                       % Degrees
sin(x)  cos(x)  tan(x)         sind(x)  cosd(x)  tand(x)
asin(x) acos(x) atan(x)        asind(x) acosd(x) atand(x)
atan2(y, x)                    % four-quadrant arctangent

% Hyperbolic
sinh(x) cosh(x) tanh(x)

% Exponential / logarithmic
exp(x)    log(x)    log10(x)   log2(x)
sqrt(x)   abs(x)    sign(x)

% Complex numbers
z = complex(a, b);              % a + bi
real(z)  imag(z)  abs(z)  angle(z)  conj(z)

% Rounding
round(x)  floor(x)  ceil(x)  fix(x)  mod(x, m)  rem(x, m)
```

## Numerical Calculus

### Integration

```matlab
q = integral(@(x) x.^2, 0, 1);         % definite integral
q = integral(fun, 0, Inf);              % improper integral
q = integral2(fun, xa, xb, ya, yb);     % double integral
q = trapz(x, y);                        % trapezoidal from data
q = cumtrapz(x, y);                     % cumulative integral
```

### Differentiation

```matlab
dy = diff(y);                   % first differences
g = gradient(y, h);             % numerical derivative with spacing h
[gx, gy] = gradient(Z, hx, hy); % 2D gradient
```

## ODE Solvers

```matlab
% Standard form: dy/dt = f(t, y)
odefun = @(t, y) -2*y;
[t, y] = ode45(odefun, [0 5], 1);

% With options
opts = odeset('RelTol', 1e-6, 'AbsTol', 1e-9, 'MaxStep', 0.1);
[t, y] = ode45(odefun, [0 5], 1, opts);

% Higher-order: convert to system
% y'' + 2y' + y = 0 becomes y1'=y2, y2'=-2*y2-y1
f = @(t, y) [y(2); -2*y(2) - y(1)];
[t, y] = ode45(f, [0 10], [1; 0]);   % [y(0); y'(0)]

% Boundary value problems
solinit = bvpinit(linspace(0, 4, 5), [0; 0]);
sol = bvp4c(@odefun, @bcfun, solinit);
```

## Optimization and Root-Finding

```matlab
% Find root: f(x) = 0
x = fzero(@(x) cos(x) - x, 0.5);
x = fzero(fun, [a b]);                  % bracketed

% Polynomial roots
r = roots([1 0 -4]);                    % x^2 - 4 = 0 -> [2; -2]

% Minimize single variable
[x, fval] = fminbnd(fun, x1, x2);

% Minimize multivariable (unconstrained)
[x, fval] = fminsearch(fun, x0);

% Least squares curve fitting
p = polyfit(x, y, n);                   % polynomial degree n
y_fit = polyval(p, x_new);
```

## Statistics

```matlab
% Central tendency
mean(x)  median(x)  mode(x)

% Dispersion
std(x)   var(x)    range(x)

% Extremes
[minv, idx] = min(x);
[maxv, idx] = max(x);

% Correlation
R = corrcoef(X, Y);
C = cov(X, Y);

% Moving statistics
movmean(x, k)  movmedian(x, k)  movstd(x, k)

% Histogram counts
[N, edges] = histcounts(x);
[N, edges] = histcounts(x, 'Normalization', 'pdf');
```

## Interpolation

```matlab
yi = interp1(x, y, xi);                 % linear (default)
yi = interp1(x, y, xi, 'spline');       % spline
yi = interp1(x, y, xi, 'pchip');        % piecewise cubic Hermite
zi = interp2(X, Y, Z, xi, yi);          % 2D interpolation
```

## Signal Processing Basics

```matlab
% FFT
Y = fft(x);
f = (0:length(Y)-1) * fs / length(Y);   % frequency axis
Y_centered = fftshift(Y);

% Filtering
y = filter(b, a, x);                    % IIR/FIR filter
y = filtfilt(b, a, x);                  % zero-phase filtering
y = conv(x, h, 'same');                 % convolution

% Simple moving average
b = ones(1, k) / k;
y_smooth = filter(b, 1, x);
```

## Polynomial Operations

```matlab
p = polyfit(x, y, n);           % fit polynomial
yi = polyval(p, xi);            % evaluate
r = roots(p);                   % find roots
p = poly(r);                    % polynomial from roots
dp = polyder(p);                % derivative
ip = polyint(p);                % integral
cp = conv(p1, p2);              % multiply polynomials
```
