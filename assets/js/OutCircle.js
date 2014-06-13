var data = [10, 50, 80];
var r = 300;

var color = d3.scale.ordinal()
    .range(['rgb(0,120,50)', 'rgb(0,100,50)', 'rgb(0,80,50)']);

var canvas = d3.select('#canvas').append('svg')
    .attr('width', 1500)
    .attr('height', 1500);

var group = canvas.append('g')
    .attr('transform', 'translate(300, 300)');

var arc = d3.svg.arc()
    .innerRadius(230)
    .outerRadius(r-20);

var pie = d3.layout.pie()
    .value(function (d) {
    return d;
});

var arcs = group.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc');

arcs.append('path')
    .attr('d', arc)
    .attr('fill', function (d) {
    return color(d.data);
});

arcs.append('text')
    .attr('transform', function (d) {
    return 'translate(' + arc.centroid(d) + ')';
})
    .attr('text-anchor', 'middle')
    .attr('font-size', '1.5em')
    .text(function (d) {
    return d.data;
});
