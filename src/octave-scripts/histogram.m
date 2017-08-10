function [n, idx] = histogram(csvfile)

points = csvread(csvfile);
x = points(:, 2); % mq135 column
for i = 1:10000
    entries(i) = i * 100;
end

[n, idx] = histc(x, edges);

end
