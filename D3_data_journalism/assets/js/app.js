// @TODO: YOUR CODE HERE!
var svgWidth=700;
var svgHeight=500;

var margin= {
    top: 20,
    right: 20,
    bottom: 60,
    left: 55
};

var width= svgWidth - margin.left - margin.right;
var height= svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup= svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
d3.csv("assets/data/data.csv").then(function(chartData) {
    chartData.forEach(function(data) {
        data.age= +data.age;
        data.smokes= +data.smokes;
});

    var xLinearScale=d3.scaleLinear()
        .domain([30, d3.max(chartData, d => d.age)])
        .range([0, width]);

    var yLinearScale=d3.scaleLinear()
        .domain([5, d3.max(chartData, d => d.smokes)])
        .range([height, 0]);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis=d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup= chartGroup.selectAll("circle")
        .data(chartData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "#788dc2")
        .attr("opacity", ".5")
    
    chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .selectAll("tspan")
    .data(chartData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.age-0);
        })
        .attr("y", function(data) {
            return yLinearScale(data.smokes-0.2);
        })
        .text(function(d) {
            return (`${d.abbr}`)
        });


    var toolTip= d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`ID: ${d.id}<br>Age: ${d.age}<br>Smokers: ${d.smokes}`);
    });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left)
        .attr("x", 0-(height/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokers (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age");

});