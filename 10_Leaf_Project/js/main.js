var margin = { top: 50, right: 180, bottom: 100, left: 100 };
var width = 1200 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLog()
    .base(10)
    .domain([142, 150000])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, 90])
    .range([height, 0]);

var area = d3.scaleLinear()
    .domain([2000, 1400000000])
    .range([25 * Math.PI, 1500 * Math.PI]);

var color = d3.scaleOrdinal()
    .range(d3.schemePastel1);

var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(function(d) {
        return "$" + d;
    });

var yAxisCall = d3.axisLeft(y);

var xAxisGroup = g.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y-axis");

g.append("text")
    .attr("class", "x label")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("text-anchor", "middle")
    .attr("font-size", "32px")
    .text("GDP Per Capita ($)");

g.append("text")
    .attr("class", "y label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .attr("font-size", "32px")
    .text("Life Expectancy (Years)");

var yearLabel = g.append("text")
    .attr("class", "year-label")
    .attr("x", width - 10)
    .attr("y", height - 10)
    .attr("text-anchor", "end")
    .attr("font-size", "80px")
    .attr("fill", "#888")
    .text("");

var legendGroup = g.append("g")
    .attr("transform", "translate(" + (width + 20) + ", 200)");

var formattedData;
var continents = [];
var yearIndex = 0;

d3.json("data/data.json").then(function(data) {

    formattedData = data.map(function(yearData) {
        return {
            year: +yearData.year,
            countries: yearData.countries
                .filter(function(country) {
                    return country.income != null &&
                           country.life_exp != null &&
                           country.population != null;
                })
                .map(function(country) {
                    return {
                        continent: country.continent,
                        country: country.country,
                        income: +country.income,
                        life_exp: +country.life_exp,
                        population: +country.population
                    };
                })
        };
    });

    formattedData.forEach(function(yearData) {
        yearData.countries.forEach(function(country) {
            if (!continents.includes(country.continent)) {
                continents.push(country.continent);
            }
        });
    });

    color.domain(continents);

    legendGroup.selectAll("rect")
        .data(continents)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) {
            return i * 30;
        })
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", function(d) {
            return color(d);
        });

    legendGroup.selectAll("text")
        .data(continents)
        .enter()
        .append("text")
        .attr("x", 28)
        .attr("y", function(d, i) {
            return i * 30 + 14;
        })
        .text(function(d) {
            return d.charAt(0).toUpperCase() + d.slice(1);
        });

    update(formattedData[yearIndex]);

    d3.interval(function() {
        yearIndex++;
        if (yearIndex >= formattedData.length) {
            yearIndex = 0;
        }
        update(formattedData[yearIndex]);
    }, 1000);
});

function update(yearData) {

    xAxisGroup.transition()
        .duration(800)
        .call(xAxisCall);

    yAxisGroup.transition()
        .duration(800)
        .call(yAxisCall);

    yearLabel.text(yearData.year);

    var circles = g.selectAll("circle")
        .data(yearData.countries, function(d) {
            return d.country;
        });

    circles.exit()
        .transition()
        .duration(800)
        .attr("r", 0)
        .remove();

    circles.transition()
        .duration(800)
        .attr("cx", function(d) {
            return x(d.income);
        })
        .attr("cy", function(d) {
            return y(d.life_exp);
        })
        .attr("r", function(d) {
            return Math.sqrt(area(d.population) / Math.PI);
        })
        .attr("fill", function(d) {
            return color(d.continent);
        });

    circles.enter()
        .append("circle")
        .attr("cx", function(d) {
            return x(d.income);
        })
        .attr("cy", function(d) {
            return y(d.life_exp);
        })
        .attr("r", 0)
        .attr("fill", function(d) {
            return color(d.continent);
        })
        .attr("stroke", "#222")
        .attr("stroke-width", 1)
        .merge(circles)
        .transition()
        .duration(800)
        .attr("cx", function(d) {
            return x(d.income);
        })
        .attr("cy", function(d) {
            return y(d.life_exp);
        })
        .attr("r", function(d) {
            return Math.sqrt(area(d.population) / Math.PI);
        })
        .attr("fill", function(d) {
            return color(d.continent);
        });
}