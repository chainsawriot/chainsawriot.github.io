// use scale.css

//Width and height
var w = 1000;
var h = 300;
var padding = 35;

var format = d3.time.format("%m/%d/%Y");
var mindate = format.parse("08/25/2014");
var maxdate = format.parse("06/30/2015");
var onmousopaque = 0.8;
var normalopaque = 0.2;

//Create scale functions
var xScale = d3.time.scale()
    .domain([mindate, maxdate])
    .range([padding, w - padding * 2]);

var yScale = d3.scale.linear()
    .domain([10, 80])
    .range([h - padding, padding]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(10);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10);

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);


var rScale = d3.scale.linear()
    .domain([200, 1600])
    .range([5, 20]);



var infobox = d3.select('body').append("div")
    .style("visibility", "hidden");

d3.csv("smoothed.csv", function(error, data) {
    data.forEach(function(d) {
	d.date = d3.time.format("%Y-%m-%d").parse(d.date);
	d.value = +d.loessfit;
	d.lower = +d.loessmin;
	d.upper = +d.loessmax;
    });

    var trendline = d3.svg.line()
	.x(function(d) { return xScale(d.date); })
	.y(function(d) { return yScale(d.value * 100); });

    var confidenceInterval = d3.svg.area()
	.x(function(d) { return xScale(d.date); })
	.y0(function(d) { return yScale(d.lower * 100); })
	.y1(function(d) { return yScale(d.upper * 100); });

    svg.append("path")
	.datum(data)
	.attr("class", "trendline path")
	.attr("d", trendline);

    svg.append("path")
	.datum(data)
	.attr("class", "area confidence")
	.attr("d", confidenceInterval);
});

d3.csv("pocketsorted.csv", function(error, data) {
    data.forEach(function(d) {
	d.date = format.parse(d.datestart);
	d.value = +d.support;
    });
    svg.selectAll("circle")
	.data(data)
	.enter().append("circle")
	.attr("cx", function(d) { return xScale(d.date); })
	.attr("cy", function(d) { return yScale(d.value); })
	.attr("r", function(d) { return rScale(d.esamplesize); })
	.attr("opacity", normalopaque)
	.attr("fill", function(d) {
	    if (d.uni == 1) {
		return "steelblue";
	    } else {
		return "tomato";
	    };
	})
	.on("mouseover", function(d) {
	    d3.select(this).attr("opacity", onmousopaque);
	    infobox.style("visibility", "visible")
		.html("<b>贊助機構: </b> " + d.sponsor + "<br />" + "<b>研究機構: </b>" + d.org + "<br />"  + "<b>問題: </b>" + d.question + "<br /><b>開始訪問日期: </b>" + d.datestart + "<br /><b>結束訪問日期: </b>" + d.dateend + "<br /><b>支持比率: </b>" + d.support + "<br /><b>有否加權: </b>" + d.wei);
	})
	.on("mouseout", function(d) {
	    d3.select(this).attr("opacity", normalopaque);
	    infobox.html("").style("visibility", "hidden");
	})
	.on("click", function(d) {
	    window.open(d.origin);
	});
    svg.append("line")
	.attr("x1", xScale(format.parse("08/26/2014")))
	.attr("x2", xScale(format.parse("06/01/2015")))
	.attr("y1", yScale(50))
	.attr("y2", yScale(50))
	.style("stroke-width", 0.7)
	.attr("stroke", "black")
	.attr("stroke-dasharray", "5,5")
	.attr("opacity", normalopaque);
});

// Axes

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

svg.append("text").attr("x", xScale(format.parse("08/26/2014"))).attr("y", yScale(80)).text("Support, %");

