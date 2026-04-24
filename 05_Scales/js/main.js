d3.json("data/buildings.json").then(function(data) {
    console.log(data);

    data.forEach(function(d) {
        d.height = +d.height;
    });

    var width = 500;
    var height = 500;

    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var x = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.name;
        }))
        .range([0, 400])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, 828])
        .range([0, 400]);

    var colors = d3.scaleOrdinal(d3.schemeSet3)
        .domain(data.map(function(d) {
            return d.name;
        }));

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return x(d.name);
        })
        .attr("y", function(d) {
            return height - y(d.height);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return y(d.height);
        })
        .attr("fill", function(d) {
            return colors(d.name);
        });
});