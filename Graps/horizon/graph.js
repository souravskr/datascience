var metric = "Open";
var dateformat = d3.time.format("%e-%b-%y");

var data,
    values,
    mean,
    lookup;

var width = 730,
    height = 500,
    chartheight = 20;

var chart = d3.horizon()
    .width(width)
    .height(height)
    .bands(8)
    .height(chartheight)
    .mode("mirror")
    .interpolate("step-after");

/* Utility functions to generate all days in a year */
// http://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate))
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
/* End utility functions */

var dates = getDates(
    dateformat.parse("1-Jan-12"),
    dateformat.parse("31-Dec-12")
);

// used only for axes, unfortunately horizon plugin doesn't play with scales well
var xscale = d3.time.scale()
    .domain(d3.extent(dates))
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(xscale)
    .orient("bottom");

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("zeroSpeed.csv", function (error, raw) {
    raw.forEach(function (d) {
        d[metric] = parseFloat(d[metric]);
    });

    values = raw.map(function (d) { return d[metric]; });

    // Offset so that positive is above-average and negative is below-average.
    mean = values.reduce(function (p, v) { return p + v; }, 0) / values.length;

    lookup = {};
    raw.forEach(function (d, i) {
        // makes sure lookup uses output of the formatter
        var date = dateformat(dateformat.parse(d.Date));
        lookup[date] = d;
    });

    data = dates.map(function (day, i) {
        var value = dateformat(day) in lookup
            ? lookup[dateformat(day)][metric] - mean
            : null;
        return [day, value];
    });

    // Render the chart.
    svg.data([data]).call(chart);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartheight + ")")
        .call(xAxis);
});






















// d3.json('zero_horizon.json').then(data => {
  
// data.forEach((d, i, n) => {
//     d.values[i].date = new Date(d.values[i].date)
// });
//      render (data)
//     // console.log(data)

// })

// d3.csv('zeroSpeed.csv').then (data => {
//     data.forEach (d => {
//         d.date = new Date(d.date)
//         d.time = +d.time
//     })

//     var data = d3.nest()
//         .key(function (d) { return d.uuid; })
//         .entries(data);
//     render (data)
//     console.log(data)
// })