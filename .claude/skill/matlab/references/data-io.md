# Data Import/Export Reference

## Text and CSV Files

### Reading

```matlab
T = readtable('data.csv');                          % as table (mixed types)
M = readmatrix('data.csv');                         % as numeric matrix
C = readcell('data.csv');                           % as cell array
S = readlines('data.txt');                          % as string array (lines)
str = fileread('data.txt');                         % entire file as string

% With options
T = readtable('data.csv', 'Delimiter', '\t');
T = readtable('data.csv', 'NumHeaderLines', 2);
M = readmatrix('data.csv', 'Range', 'B2:D100');

% Auto-detect format
opts = detectImportOptions('data.csv');
opts.VariableTypes = {'double', 'string', 'double'};
T = readtable('data.csv', opts);
```

### Writing

```matlab
writetable(T, 'output.csv');
writematrix(M, 'output.csv');
writetable(T, 'output.tsv', 'Delimiter', '\t');
writematrix(M, 'output.csv', 'Delimiter', ',');
```

## MAT-Files

```matlab
% Save (always use -v7 for Octave compatibility)
save('data.mat', 'x', 'y', 'results', '-v7');
save('data.mat', 'x', '-append');                   % append to existing

% Load
load('data.mat');                                    % all variables
load('data.mat', 'x', 'y');                          % specific variables
S = load('data.mat');                                % into struct
x = S.x;

% Inspect without loading
whos('-file', 'data.mat');
```

## Spreadsheets

```matlab
T = readtable('data.xlsx');
T = readtable('data.xlsx', 'Sheet', 'Sheet2');
M = readmatrix('data.xlsx', 'Range', 'A1:F50');

writetable(T, 'output.xlsx');
writetable(T, 'output.xlsx', 'Sheet', 'Results');
```

## Tables

### Creating

```matlab
T = table(var1, var2, var3);
T = table(var1, var2, 'VariableNames', {'Col1', 'Col2'});
T = array2table(M, 'VariableNames', {'A', 'B', 'C'});
```

### Accessing

```matlab
col = T.ColumnName;                      % column as array
row = T(5, :);                           % row 5 as table
data = T{:, 3};                          % column 3 as array
subset = T(T.Value > 5, :);              % filtered rows
```

### Modifying

```matlab
T.NewCol = newData;                      % add column
T.OldCol = [];                           % remove column
T = renamevars(T, 'Old', 'New');         % rename
T = sortrows(T, 'Column');               % sort
T = sortrows(T, 'Column', 'descend');

% Group operations
G = groupsummary(T, 'GroupVar', 'mean', 'ValueVar');
G = groupsummary(T, 'GroupVar', {'mean', 'std'}, 'ValueVar');

% Join
T = innerjoin(T1, T2);
T = outerjoin(T1, T2);
```

### Cleaning

```matlab
T = rmmissing(T);                        % remove rows with NaN
T = unique(T);                           % remove duplicate rows
```

## Cell Arrays

```matlab
C = {1, 'text', [1 2 3]};               % mixed-type container
C = cell(m, n);                          % empty m x n

contents = C{1, 2};                      % access contents with {}
subset = C(1:2, :);                      % subset (still cell array)

A = cell2mat(C);                         % to matrix (if compatible)
T = cell2table(C);                       % to table
```

## Structures

```matlab
S.field1 = value1;
S.field2 = value2;
S = struct('field1', value1, 'field2', value2);

val = S.field1;
names = fieldnames(S);
tf = isfield(S, 'field1');
```

## Low-Level File I/O

```matlab
% Open/close
fid = fopen('file.txt', 'r');           % read
fid = fopen('file.txt', 'w');           % write (overwrite)
fid = fopen('file.txt', 'a');           % append
fclose(fid);

% Text
line = fgetl(fid);                       % one line (no newline)
data = fscanf(fid, '%f');                % formatted read
fprintf(fid, '%6.2f\n', data);           % formatted write
C = textscan(fid, '%f %s %f');           % mixed-type scan

% Binary
data = fread(fid, n, 'double');
fwrite(fid, data, 'double');

% Position
pos = ftell(fid);
fseek(fid, 0, 'bof');                   % beginning of file
frewind(fid);
tf = feof(fid);                          % end of file?
```

## File and Path Operations

```matlab
tf = isfile('file.txt');
tf = isfolder('folder');
files = dir('data/*.csv');               % list matching files
names = {files.name};

fullpath = fullfile('folder', 'sub', 'file.txt');
[path, name, ext] = fileparts(fullpath);

copyfile('src.txt', 'dst.txt');
movefile('old.txt', 'new.txt');
delete('file.txt');
mkdir('newfolder');
```
