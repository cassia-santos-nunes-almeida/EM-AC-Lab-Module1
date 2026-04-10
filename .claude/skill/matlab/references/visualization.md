# Visualization Reference

## 2D Plots

### Line Plots

```matlab
plot(x, y);                             % basic
plot(x, y, 'r--', 'LineWidth', 2);      % red dashed, thick

% Line spec: [color][marker][linestyle]
% Colors:  r g b c m y k w
% Markers: o + * . x s d ^ v > < p h
% Lines:   - -- : -.

% Multiple series
plot(x, y1, 'b-', x, y2, 'r--');

% With hold
hold on;
plot(x, y1, 'b-');
plot(x, y2, 'r--');
hold off;
```

### Scatter, Bar, Area

```matlab
scatter(x, y, sz, c, 'filled');         % scatter with size and color
bar(x, y);                              % vertical bars
barh(x, y);                             % horizontal bars
bar(Y, 'stacked');                      % stacked bar chart
area(x, y);                             % filled area
errorbar(x, y, err);                    % with error bars
errorbar(x, y, neg, pos);              % asymmetric errors
```

### Logarithmic and Polar

```matlab
semilogy(x, y);                         % log y-axis
semilogx(x, y);                         % log x-axis
loglog(x, y);                           % both axes log
polarplot(theta, rho);                   % polar coordinates
```

### Histograms

```matlab
histogram(x);                           % automatic bins
histogram(x, nbins);                    % specify bin count
histogram(x, 'Normalization', 'pdf');    % probability density
histogram2(x, y);                        % 2D histogram
```

## 3D Plots

### Surface and Mesh

```matlab
[X, Y] = meshgrid(-2:0.1:2, -2:0.1:2);
Z = X.^2 + Y.^2;

surf(X, Y, Z);                          % surface with edges
surf(X, Y, Z, 'EdgeColor', 'none');     % smooth surface
mesh(X, Y, Z);                          % wireframe
surfc(X, Y, Z);                         % surface + contour below
```

### Contour

```matlab
contour(X, Y, Z);                       % 2D contour lines
contourf(X, Y, Z);                      % filled contours
contour(X, Y, Z, n);                    % n levels
[C, h] = contour(X, Y, Z);
clabel(C, h);                           % add labels
```

### 3D Line and Scatter

```matlab
plot3(x, y, z, 'r-', 'LineWidth', 2);
scatter3(x, y, z, sz, c, 'filled');
stem3(x, y, z);
```

### View and Lighting

```matlab
view(az, el);                           % set view angle
view(2);                                % top-down
view(3);                                % default 3D

light('Position', [1 0 1]);
lighting gouraud;
shading interp;
```

## Figure Management

### Creating and Arranging

```matlab
figure;                                  % new figure
figure('Position', [100 100 800 600]);   % sized figure

% Subplots (classic)
subplot(2, 2, 1); plot(x1, y1);
subplot(2, 2, 2); plot(x2, y2);

% Tiled layout (modern, MATLAB R2019b+)
tiledlayout(2, 2);
nexttile; plot(x1, y1);
nexttile; plot(x2, y2);
nexttile([1 2]); plot(x3, y3);          % span 2 columns
```

### Dual Y-Axes

```matlab
yyaxis left;
plot(x, y1); ylabel('Left');
yyaxis right;
plot(x, y2); ylabel('Right');
```

## Customization

### Labels and Title

```matlab
xlabel('X Label');
ylabel('Y Label');
zlabel('Z Label');
title('Title');

% LaTeX rendering
title('$$\int_0^1 x^2\,dx$$', 'Interpreter', 'latex');
xlabel('Frequency $f$ (Hz)', 'Interpreter', 'latex');
```

### Legend

```matlab
legend('Series 1', 'Series 2');
legend('Location', 'best');
legend('Location', 'northeastoutside');
legend('boxoff');
```

### Axes

```matlab
xlim([xmin xmax]);
ylim([ymin ymax]);
axis equal;                              % equal aspect ratio
axis tight;                              % fit to data
grid on;
grid minor;
box on;
```

### Ticks

```matlab
xticks([0 1 2 3 4]);
xticklabels({'A', 'B', 'C', 'D', 'E'});
xtickangle(45);
ytickformat('%.2f');
```

### Annotations

```matlab
text(x, y, 'Label', 'FontSize', 12);
xline(5, '--r', 'Threshold');           % vertical reference line
yline(10, ':b', 'Limit');               % horizontal reference line
```

### Colormaps

```matlab
colormap(parula);                        % default
colormap(jet);
colormap(hot);
colormap(gray);
colorbar;
clim([cmin cmax]);                       % color limits (R2022a+)
% caxis([cmin cmax]);                    % older syntax
```

### Vector Fields

```matlab
quiver(X, Y, U, V);                     % 2D arrows
quiver3(X, Y, Z, U, V, W);              % 3D arrows
streamline(X, Y, U, V, startx, starty);
```

## Export

```matlab
% Raster
saveas(gcf, 'figure.png');
print('-dpng', '-r300', 'figure.png');   % 300 DPI

% Vector (for publications)
print('-dpdf', '-painters', 'figure.pdf');
print('-dsvg', '-painters', 'figure.svg');
print('-depsc', 'figure.eps');           % color EPS

% Modern export (MATLAB R2020a+)
exportgraphics(gcf, 'figure.png', 'Resolution', 300);
exportgraphics(gcf, 'figure.pdf', 'ContentType', 'vector');
```

**Octave note:** `exportgraphics` is not available. Use `print()` or `saveas()`.
