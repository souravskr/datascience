
var dataset;
var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    // times = d3.range(24);
    times = ["12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9p", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", '10p', '11p']

console.log(times);
var margin = { top: 140, right: 80, bottom: 70, left: 50 };

// calculate width and height based on window size
var w =
    Math.max(Math.min(window.innerWidth, 1200), 500) -
    margin.left -
    margin.right -
    20,
    gridSize = Math.floor(w / times.length),
    h = gridSize * (days.length + 2);

//reset the overall font size
var newFontSize = (w * 62.5) / 900;
d3.select("html").style("font-size", newFontSize + "%");

// svg container
var svg = d3
    .select("#heatmap")
    .append("svg")
    .attr("width", w + margin.top + margin.bottom + 300)
    .attr("height", h + margin.left + margin.right + 500)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var colours = d3
    .scaleSequential(d3.interpolateReds)
    .domain(d3.range(1, 100, 22));


var dayLabels = svg
    .selectAll(".dayLabel")
    .data(days)
    .enter()
    .append("text")
    .text(function (d) {
        return d;
    })
    .attr("x", -10)
    .attr("y", function (d, i) {
        return i * gridSize + 12;
    })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    // .attr("rx", 6)
    // .attr("ry", 6);

var timeLabels = svg
    .selectAll(".timeLabel")
    .data(times)
    .enter()
    .append("text")
    .text(function (d) {
        return d;
    })
    .attr("x", function (d, i) {
        return i * gridSize + 5;
    })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)");

// load data
d3.csv("heatmap.csv", function (error, data) {
    console.log(data);
    data.forEach(function (d) {
        d.day = +d.day;
        d.hour = +d.hour - 1;
        d.max_speed = +d.max_speed;
    });
    dataset = data;

    // group data by location
    var nest = d3
        .nest()
        .key(function (d) {
            return d.uuid;
        })
        .entries(dataset);

    // array of locations in the data
    var locations = nest.map(function (d) {
        return d.key;
    });
    var currentLocationIndex = 0;

    // create location dropdown menu
    var locationMenu = d3.select("#locationDropdown");
    locationMenu
        .append("select")
        .attr("id", "locationMenu")
        .selectAll("option")
        .data(locations)
        .enter()
        .append("option")
        .attr("value", function (d, i) {
            return i;
        })
        .text(function (d) {
            return d;
        });

    const tip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(d => {
            let content = `<div class='house'>Speed: <span style='color:black'>${d.max_speed} m/s</span></div>`;
            return content;
        });
    svg.call(tip);

    svg
        .append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "30px")
        .text("Maximum Speed (Hourly) of Devices ");

    var linear = d3
        .scaleLinear()
        .domain([0, 23])
        .range(["#fee0d2", "#67000d"])
        .interpolate(d3.interpolateCubehelix.gamma(1));

    svg
        .append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(250,400)");

    var legendLinear = d3
        .legendColor()
        .shapeWidth(50)
        .cells(10)
        .orient("horizontal")
        .scale(linear);

    svg.select(".legendLinear").call(legendLinear);




    // function to create the initial heatmap
    var drawHeatmap = function (location) {
        // filter the data to return object of location of interest
        var selectLocation = nest.find(function (d) {
            return d.key == location;
        });


        var heatmap = svg
            .selectAll(".hour")
            .data(selectLocation.values)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return d.hour * gridSize + 55;
            })
            .attr("y", function (d) {
                return d.day * gridSize + 15;
            })
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .attr("rx", 6)
            .attr("ry", 6)
            .style("stroke", "red")
            .style("stroke-width", 0.4)
            .style("fill", function (d) {
                return colours(d.max_speed);
            })
            // .append("title")
            // .text(function (d) {
            //     return d.max_speed;
            // })
            .on("mouseover", tip.show)
            // .on("mousemove", mousemove)
            .on("mouseleave", tip.hide);
            ;
    };
    drawHeatmap(locations[currentLocationIndex]);

    var updateHeatmap = function (location) {
        // console.log("currentLocationIndex: " + currentLocationIndex);
        // filter data to return object of location of interest

        var selectLocation = nest.find(function (d) {
            return d.key == location;
        });

        svg.selectAll(".hour").remove();
        svg.selectAll('.legendLinear').remove()

        // update the data and redraw heatmap
        // var heatmap = svg
        //   .selectAll(".hour")
        //   .data(selectLocation.values)
        //   .enter()
        //   .append("rect")
        //   .transition()
        //   .duration(500)
        //   .style("fill", function(d) {
        //     return colours(d.max_speed);
        //   });

        var heatmap = svg
            .selectAll(".hour")
            .data(selectLocation.values)
            .enter()
            .append("rect")
            .attr("class", "hour bordered")
            .attr("x", function (d) {
                return d.hour * gridSize + 55;
            })
            .attr("y", function (d) {
                return d.day * gridSize + 15;
            })
            
            .attr("width", gridSize)
            .attr("height", gridSize)
            .attr("rx", 6)
            .attr("ry", 6)
            .style("stroke", "red")
            .style("stroke-width", 0.4)
            .style("fill", function (d) {
                return colours(d.max_speed);
            })
            .on("mouseover", tip.show)
            // .on("mousemove", mousemove)
            .on("mouseleave", tip.hide);

        var linear = d3
            .scaleLinear()
            .domain([0, d3.max(selectLocation.values, d=> d.max_speed)])
            .range(["#fee0d2", "#67000d"])
            .interpolate(d3.interpolateCubehelix.gamma(1));

        svg
            .append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(250,400)");

        var legendLinear = d3
            .legendColor()
            .shapeWidth(50)
            .cells(10)
            .orient("horizontal")
            .scale(linear);

        svg.select(".legendLinear").call(legendLinear);







    };

    // run update function when dropdown selection changes
    locationMenu.on("change", function () {
        // find which location was selected from the dropdown
        var selectedLocation = d3
            .select(this)
            .select("select")
            .property("value");
        currentLocationIndex = +selectedLocation;
        // run update function with selected location
        updateHeatmap(locations[currentLocationIndex]);
    });

    d3.selectAll(".nav").on("click", function () {
        if (d3.select(this).classed("left")) {
            if (currentLocationIndex == 0) {
                currentLocationIndex = locations.length - 1;
            } else {
                currentLocationIndex--;
            }
        } else if (d3.select(this).classed("right")) {
            if (currentLocationIndex == locations.length - 1) {
                currentLocationIndex = 0;
            } else {
                currentLocationIndex++;
            }
        }
        d3.select("#locationMenu").property("value", currentLocationIndex);
        updateHeatmap(locations[currentLocationIndex]);
    });
});