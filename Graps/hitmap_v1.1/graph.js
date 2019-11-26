
var dataset;
var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const times = ["12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9p", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", '10p', '11p']

// console.log(times[0])

var margin = { top: 100, right: 150, bottom: 70, left: 150 };

var w = Math.max(Math.min(window.innerWidth, 1200), 1500) - margin.left - margin.right - 20,

    gridSize = Math.floor(w / times.length),
    h = 2 * gridSize * (days.length + 2);

console.log(h)


//reset the overall font size
// var newFontSize = w * 92.5 / 900;
// d3.select("html").style("font-size", newFontSize + "%");


var svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", w + margin.top + margin.bottom)
    .attr("height", h + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left - 50}, ${margin.top + 20})`);



    const render = data => {

       

        // const colorScale = d3.scaleSequentialQuantile(d3.interpolateGreens).domain([100, 1, 13])



// console.log(colorScale.domain())


        var dayLabels = svg.selectAll(".dayLabel")
            .data(days)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return( i * gridSize * 1.2); })
            .style("text-anchor", "end")
            .attr("transform", "translate(-100," + gridSize / 35 + ")")



        var timeLabels = svg.selectAll(".timeLabel")
            .data(times)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", function (d, i) { return i * gridSize -100 ; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -36)");
    

        var nest = d3.nest()
            .key(function (d) { return d.uuid; })
            .entries(data);

        var devices = nest.map(function (d) { return d.key; });
        var currentDeviceIndex = 0;

        // console.log(devices)


        var deviceMenu = d3.select("#locationDropdown");

        deviceMenu
            .append("select")
            .attr("id", "locationMenu")
            .selectAll("option")
            .data(devices)
            .enter()
            .append("option")
            .attr("value", function (d, i) { return i; })
            .text(function (d) { return d; });


        var drawHeatmap = function (device) {

            // filter the data to return object of location of interest
            var selectLocation = nest.find(function (d) {
                return d.key == device;
            });

            var colorScale = d3
                .scaleSequential(d3.interpolateGreens)
                .domain(d3.extent(selectLocation.values, d=> d.hour));

        var heatmap = svg.selectAll(".hour")
            .data(selectLocation.values)
            .enter()
            .append("rect")
            .attr("x", function (d) { return (d.hour - 1) * gridSize * 1.2; })
            .attr("y", function (d) { return (d.day - 1) * gridSize * 1.2; })
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("stroke", "black")
            .style("stroke-opacity", 0.6)
            .style("fill", function (d) { return colorScale(d.max_speed); })
            .append('title')
            .text(d => d.max_speed)

    }


        drawHeatmap(devices[currentDeviceIndex]);

        var updateHeatmap = function (device) {
            console.log("currentDeviceIndex: " + currentDeviceIndex)
            // filter data to return object of location of interest
            var selectLocation = nest.find(function (d) {
                return d.key == device;
            });
            var colorScale = d3
                .scaleSequential(d3.interpolateGreens)
                .domain(d3.extent(selectLocation.values, d => d.hour));

            console.log(selectLocation.values)
            
            // update the data and redraw heatmap
            var heatmap = svg.selectAll(".hour")
                .data(selectLocation.values)
                .transition()
                .duration(500)
                .style("fill", function (d) { return colorScale(d.max_speed); })
        }


        deviceMenu.on("change", function () {
            // find which location was selected from the dropdown
            var selectedLocation = d3.select(this)
                .select("select")
                .property("value");
            currentDeviceIndex = +selectedLocation;
            // run update function with selected location
            updateHeatmap(devices[currentDeviceIndex]);
        });


        d3.selectAll(".nav").on("click", function () {
            if (d3.select(this).classed("left")) {
                if (currentDeviceIndex == 0) {
                    currentDeviceIndex = devices.length - 1;
                } else {
                    currentDeviceIndex--;
                }
            } else if (d3.select(this).classed("right")) {
                if (currentDeviceIndex == devices.length - 1) {
                    currentDeviceIndex = 0;
                } else {
                    currentDeviceIndex++;
                }
            }
            d3.select("#locationMenu").property("value", currentDeviceIndex)
            updateHeatmap(devices[currentDeviceIndex]);
        })








}


















    d3.csv('heatmap.csv').then(data => {
        // console.log(data)

        data.forEach(d => {
            
            d.hour = +d.hour
            d.day = +d.day
            d.max_speed = +d.max_speed

        });

        render (data)
    })

