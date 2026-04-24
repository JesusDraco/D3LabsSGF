d3.csv("data/ages.csv").then(function(data) {
    console.log("CSV:", data);
});

d3.tsv("data/ages.tsv").then(function(data) {
    console.log("TSV:", data);
});

d3.json("data/ages.json").then(function(data) {
    console.log("JSON:", data);

    data.forEach(function(d) {
        d.age = +d.age;
    });

    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", 500)
        .attr("height", 200);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            return 60 + i * 90;
        })
        .attr("cy", 100)
        .attr("r", function(d) {
            return d.age * 2;
        })
        .attr("fill", function(d) {
            if (d.age > 10) {
                return "orange";   
            } else {
                return "blue";
            }
        });
}).catch(function(error) {
    console.log("Error loading file:", error);
});