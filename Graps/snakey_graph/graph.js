// const svg = d3.select('svg');

const width = 800;
const height = 800;
const margin = { top: 60, right: 160, bottom: 88, left: 10 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

var colors = {
    'Device_1': '#edbd00',
    'Device_2': '#367d85',
    'Device_3': '#97ba4c',
    'Device_4': '#f5662b',
    'Device_5': '#3f3e47',
    'fallback': '#9f9fa3'
};
d3.json("snakey.json", function (error, json) {
    // console.log(json)

    const svg = d3.select('#chart').append('svg').attr('width', innerWidth + 200).attr('height', innerWidth + 100)
    // var chart = d3.select("#chart").append("svg").chart("Sankey.Path")
    //  svg = chart("Sankey.Path")
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .chart("Sankey.Path");
    
    g
        .name(label)
        .colorNodes(function (name, node) {
            // console.log(color(node, 1) || colors.fallback)
            return color(node, 1) || colors.fallback;
        })
        .colorLinks(function (link) {
           
            return color(link.source, 4) || color(link.target, 1) || colors.fallback;
        })
        .nodeWidth(15)
        .nodePadding(10)
        .spread(true)
        .iterations(0)
        .draw(json);
    function label(node) {
        // console.log(node.name.replace(/\s*\(.*?\)$/, ''))
        return node.name;
    }
    function color(node, depth) {
        var id = node.name;
        console.log(id)
        if (colors[id]) {
            // console.log(color[id])
            return colors[id];
        } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
            return color(node.targetLinks[0].source, depth - 1);
        } else {
            return null;
        }
    }
});

