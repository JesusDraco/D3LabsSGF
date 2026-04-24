var margin = { top: 50, right: 20, bottom: 100, left: 100 };
var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var flag = true; 

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxisGroup = g.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y-axis");

var xLabel = g.append("text")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("font-size", "25px")
    .attr("text-anchor", "middle")
    .text("Month");

var yLabel = g.append("text")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "25px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");

d3.json("data/revenues.json").then(function(data) {
    data.forEach(function(d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    update(data);

    d3.interval(function() {
        flag = !flag;
        update(data);
    }, 1000);

}).catch(function(error) {
    console.log(error);
});

function update(data) {

    var value = flag ? "revenue" : "profit";
    var label = flag ? "Revenue" : "Profit";

    x.domain(data.map(function(d) {
        return d.month;
    }));

    y.domain([0, d3.max(data, function(d) {
        return d[value];
    })]);

    var xAxisCall = d3.axisBottom(x);
    var yAxisCall = d3.axisLeft(y)
        .ticks(10)
        .tickFormat(function(d) {
            return "$" + (d / 1000) + "K";
        });

    xAxisGroup.call(xAxisCall);
    yAxisGroup.call(yAxisCall);

    yLabel.text(label);

    var bars = g.selectAll("rect")
        .data(data);

    bars.exit().remove();

    bars
        .attr("x", function(d) {
            return x(d.month);
        })
        .attr("y", function(d) {
            return y(d[value]);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return height - y(d[value]);
        })
        .attr("fill", "yellow");

    bars.enter()
        .append("rect")
        .attr("x", function(d) {
            return x(d.month);
        })
        .attr("y", function(d) {
            return y(d[value]);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return height - y(d[value]);
        })
        .attr("fill", "yellow");
}