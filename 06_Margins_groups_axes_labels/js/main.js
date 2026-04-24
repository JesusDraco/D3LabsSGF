d3.json("data/buildings.json").then(function(data) {
    console.log(data);

    data.forEach(function(d) {
        d.height = +d.height;
    });

    var margin = { top: 10, right: 10, bottom: 100, left: 100 };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", 600)
        .attr("height", 500);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scaleOrdinal(d3.schemeSet3).domain(data.map(function(d) {
        return d.name;
    }));

    var x = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.name;
        }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, 828])
        .range([height, 0]);

    var rects = g.selectAll("rect")
        .data(data);

    rects.enter()
        .append("rect")
        .attr("x", function(d) {
            return x(d.name);
        })
        .attr("y", function(d) {
            return y(d.height);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return height - y(d.height);
        })
        .attr("fill", function(d) {
            return color(d.name);
        });

    var xAxis = d3.axisBottom(x);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 10)
        .attr("x", -5)
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    var yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(function(d) {
            return d + "m";
        });

    g.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("The word's tallest buildings");

    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Height (m)");
});