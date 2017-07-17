function [a, b] = getCoefficients(csvfile)

% assuming file generated from WebPlotDigitizer using sensor datasheet
points = csvread(csvfile)
x = points(:, 2);
y = points(:, 1);

P = polyfit(log(x), log(y), 1);
a = exp(P(2));
b = P(1);

end
