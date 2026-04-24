d3.json("data/buildings.json").then(function(data) {
    console.log(data);

    data.forEach(function(d) {
        d.height = +d.height;
    });

    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", 500)
        .attr("height", 900); 

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * 30;
        })
        .attr("y", function(d) {
            return 900 - d.height;
        })
        .attr("width", 20)
        .attr("height", function(d) {
            return d.height;
        })
        .attr("fill", "blue");
});