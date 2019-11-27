var margin = { top: 30, right: 30, bottom: 30, left: 50 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("horizon.csv", function(data) {
  data.forEach(d => {
    d.speed = +d.speed;
    d.timestamp = new Date(d.timestamp);
  });
//   console.log(data);
  var allGroup = d3.map(data, d => d.uuid).keys();
//   console.log(allGroup);

  d3.select("#selectButton")
    .selectAll("myOptions")
    .data(allGroup)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    }) // text showed in the menu
    .attr("value", function(d) {
      // console.log(d)
      return d;
    });

  // const x = d3.scaleTime()
  //     .domain(d3.extent(data, d => d.timestamp))
  //     .range([0, width])
  //     .nice();
  var x = d3
    .scaleLinear()
    .domain(d3.extent(data, d=> d.speed))
    // .domain([0, 50])
    .range([0, width]);
  // console.log(x.range())

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, 0.4])
    .nice();

  svg.append("g").call(d3.axisLeft(y));

  var kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(40));
  var density = kde(
    data
      .filter(function(d) {
        return d.uuid == "Device_1";
      })
      .map(function(d) {
        return d.speed;
      })
  );

  var curve = svg
    .append("g")
    .append("path")
    .attr("class", "mypath")
    .datum(density)
    .attr("fill", "#69b3a2")
    .attr("opacity", ".8")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveBasis)
        .x(function(d) {
          return x(d[0]);
        })
        .y(function(d) {
          return y(d[1]);
        })
    );

  function updateChart(selectedGroup) {
    // recompute density estimation
    kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(40));
    var density = kde(
      data
        .filter(function(d) {
          return d.uuid == selectedGroup;
        })
        .map(function(d) {
          return d.speed;
        })
    );
// console.log(density)
    // update the chart
    curve
      .datum(density)
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function(d) {
            return x(d[0]);
          })
          .y(function(d) {
            return y(d[1]);
          })
      );
  }

  d3.select("#selectButton").on("change", function(d) {
    selectedGroup = this.value;
    // console.log(selectedGroup)
    updateChart(selectedGroup);
  });
});

// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [
        x,
        d3.mean(V, function(v) {
          return kernel(x - v);
        })
      ];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}
