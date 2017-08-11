function [] = histogram(csvfile)

points = csvread(csvfile);
x = points(:, 2); % mq135 column
for i = 1:100
    edges(i) = i * 10;
end

[n] = histc(x, edges);

bar(edges, n, 'histc');

end
