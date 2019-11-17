const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 40, right: 20, bottom: 60, left: 150 };
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

  const xAxis = d3.axisBottom(xScale)
  .tickSize(-graphHeight +20 );

  // const x1Axis = d3.axisBottom(x1Scale);

  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([graphHeight, 0])
    .padding(0.3);
  //   console.log(yScale.range());
  //   console.log(xScale.range())

  const yAxis = d3.axisLeft(yScale);

  const graph = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  graph.append("g").call(yAxis)
  .selectAll('.domain, .tick line')
  .remove();


  const xAxisG = graph
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${graphHeight})`)
  
    xAxisG
        .select('.domain')
        .remove().append('text')
        .text('Devices At A Glance')
        .attr('x', graphWidth/2)
        .attr('fill', 'black')
  // graph.append("g").call(x1Axis)
  // .attr('transform', `translate(0, ${graphHeight})`);

  graph
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => yScale(yValue(d)))
    .attr("width", d => xScale(xVAlue(d)))
    .attr("height", yScale.bandwidth())
    .attr("rx", 4);

  const exgraph = graph.append("g");
  // .attr('transform', `translate(0, ${graphHeight})`);

  exgraph
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar1")
    .attr("y", d => yScale(yValue(d)))
    .attr("width", d => xScale(x1Value(d)))
    .attr("height", yScale.bandwidth())
    .attr("rx", 4)
    // .atttr("fill", "black");

exgraph.append('text')
    .text('Average and Maximum Speed of the Devices')
.attr('x', graphWidth/3)

    exgraph.append('text')
        .text('Speed (mp/s)')
        .attr('x', graphWidth / 2)
        .attr('y', graphHeight+ margin.top)
};






d3.csv("avgSpeed.csv").then(data => {
  data.forEach(d => {
    d.max = +d.max;
    d.mean = +d.mean;
  });
  render(data);
});
