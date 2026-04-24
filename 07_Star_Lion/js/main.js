d3.json("data/revenues.json").then(function(data) {
    console.log(data);

    data.forEach(function(d) {
        d.revenue = +d.revenue;
    });

    var margin = { top: 50, right: 20, bottom: 100, left: 100 };
    var width = 800 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.month;
        }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.2);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.revenue;
        })])
        .range([height, 0]);

    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return x(d.month);
        })
        .attr("y", function(d) {
            return y(d.revenue);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return height - y(d.revenue);
        })
        .attr("fill", "yellow"); 

    var xAxis = d3.axisBottom(x);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var yAxis = d3.axisLeft(y)
        .ticks(10)
        .tickFormat(function(d) {
            return "$" + (d / 1000) + "K";
        });

    g.append("g")
        .call(yAxis);

    g.append("text")
        .attr("x", width / 2)
        .attr("y", height + 60)
        .attr("font-size", "25px")
        .attr("text-anchor", "middle")
        .text("Month");

    g.append("text")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "25px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Revenue (dlls.)");

});