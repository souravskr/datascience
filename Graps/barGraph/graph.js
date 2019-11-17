const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 40, right: 150, bottom: 60, left: 150 };
const graphWidth = width - margin.left - margin.right;
const graphHeight = height - margin.top - margin.bottom;

const render = data => {
  const xVAlue = d => d.max;
  const x1Value = d => d.mean;

  const yValue = d => d.uuid;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xVAlue)])
    .range([0, graphWidth]);

  const xAxis = d3.axisBottom(xScale).tickSize(-graphHeight + 20);

  // const x1Axis = d3.axisBottom(x1Scale);

  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([graphHeight, 0])
    .padding(0.3);
  //   console.log(yScale.range());
  //   console.log(xScale.range())

  svg
    .append("circle")
      .attr('cx', width - 170)
      .attr("cy", 0)
      .transition()
      .duration(1000)
     
      .delay(function (d, i) {
          return i * 50;
      })
    .attr("cx", width - 170)
      .attr("cy", 150)
    .attr("r", 6)
    .style("fill", "#69b3a2");

  svg
    .append("circle")
      .attr('cx', width - 170)
      .attr("cy", 0)
      .transition()
      .duration(1000)

      .delay(function (d, i) {
          return i * 50;
      })
    .attr("cx", width - 170)
    .attr("cy", 180)
    .attr("r", 6)
    .style("fill", "red")
    .style('opacity', '.5');

  svg
    .append("text")
    .attr("x", width - 160)
    .attr("y", 155)
    .text("Maximum Speed")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");

  svg
    .append("text")
    .attr("x", width - 160)
    .attr("y", 185)
    .text("Average Speed")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  // #############################

  const yAxis = d3.axisLeft(yScale);

  const graph = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  graph
    .append("g")
    .call(yAxis)
    .selectAll(".domain, .tick line")
    .remove();

  const xAxisG = graph
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${graphHeight})`);

  xAxisG
    .select(".domain")
    .remove()
    .append("text")
    .text("Devices At A Glance")
    .attr("x", graphWidth / 2)
    .attr("fill", "black");

  graph
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")

    .attr("width", d => xScale(xVAlue(d)))
    .attr("height", yScale.bandwidth())
    .attr("rx", 4)
    .transition()
    .duration(2000)
    .delay(function(d, i) {
      return i * 50;
    })
    .attr("x", 0)
    .attr("y", d => yScale(yValue(d)));

  graph
    .selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .transition()
    .duration(2000)
    .delay(function(d, i) {
      return i * 50;
    })
    .attr("x", 0)
    .attr("y", d => yScale(yValue(d)))
    .attr("x", function(d) {
      return xScale(xVAlue(d)) + 5;
    })
    .attr("y", function(d) {
      return yScale(d.uuid) + 15;
    })
    .attr("dy", ".75em")
    .text(function(d) {
      return d.count;
    });

  const exgraph = graph.append("g");
  // .attr('transform', `translate(0, ${graphHeight})`);

  exgraph
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar1")

    .attr("width", d => xScale(x1Value(d)))
    .attr("height", yScale.bandwidth())
    .attr("rx", 4)
    .transition()
    .duration(2000)
    .delay(function(d, i) {
      return i * 50;
    })
    .attr("x", 0)
    .attr("y", d => yScale(yValue(d)));
  // .atttr("fill", "black");

  exgraph
    .append("text")
    .text("Average and Maximum Speed of the Devices")
    .attr("x", graphWidth / 3);

  exgraph
    .append("text")
    .text("Speed (mp/s)")
    .attr("x", graphWidth / 2)
    .attr("y", graphHeight + margin.top);
};

d3.csv("avgSpeed.csv").then(data => {
  data.forEach(d => {
    d.max = +d.max;
    d.mean = +d.mean;
  });
  render(data);
});
