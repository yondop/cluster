import './main.scss';
import d3 from 'd3';
import Kmeans from './kmeans';
import Minimax from './minimax';

d3.select('#step')
  .on('click', function() { step(); draw(); });
d3.select('#restart')
  .on('click', function() { restart(); draw(); });
d3.select('#reset')
  .on('click', function() { init(); draw(); });


const WIDTH = screen.width * .6 - 50;
const HEIGHT = screen.height * .6 - 50;

d3.select('#kmeans')
  .style('width', (WIDTH + 50) + 'px')
  .style('height', (HEIGHT + 50) + 'px');

let svg = d3.select('#kmeans svg')
  .attr('width', WIDTH + 30)
  .attr('height', HEIGHT + 30)
  .style('padding', '10px')
  .style('cursor', 'pointer')
  .style('margin', '10px auto')
  .style('-webkit-user-select', 'none')
  .style('-khtml-user-select', 'none')
  .style('-moz-user-select', 'none')
  .style('-ms-user-select', 'none')
  .style('user-select', 'none')
  .on('click', function() {
    d3.event.preventDefault();
    step();
  });

d3.selectAll('#kmeans button')
  .style('padding', '.5em .8em');

d3.selectAll('#kmeans label')
  .style('display', 'inline-block')
  .style('width', '15em');

let lineg = svg.append('g');
let dotg = svg.append('g');
let centerg = svg.append('g');

let mod = 'minimax';


let minimax = {
  isEnd: false,

  initGroups: function() {
    let i = groups.length;
    let g = {
      dots: [],
      color: 'hsl(' + (i * 360 / K) + ',100%,50%)',
      center: {
        x: dots[0].x,
        y: dots[0].y
      },
      init: {
        center: {}
      }
    };
    g.init.center = {
      x: g.center.x,
      y: g.center.y
    };
    groups.push(g);
  },
  updateCenter: function() {
    groups.forEach(function(group, i) {
      if (group.dots.length == 0) return;

      // get center of gravity
      let x = 0, y = 0;
      group.dots.forEach(function(dot) {
        x += dot.x;
        y += dot.y;
      });

      group.center = {
        x: x / group.dots.length,
        y: y / group.dots.length
      };
    });
  },
  updateGroups: function() {
    groups.forEach(function(g) { g.dots = []; });
    dots.forEach(function(dot) {
      // find the nearest group
      let min = Infinity;
      let group;
      groups.forEach(function(g) {
        let d = Math.pow(g.center.x - dot.x, 2) + Math.pow(g.center.y - dot.y, 2);
        if (d < min) {
          min = d;
          group = g;
        }
      });

      group.dots.push(dot);
      dot.group = group;
    });
  }
};

let clust;



function step() {
  d3.select('#restart').attr('disabled', null);
  clust.step();
  draw();
}

function init() {
  d3.select('#restart').attr('disabled', 'disabled');
  let N = parseInt(d3.select('#N')[0][0].value, 10);
  let K = parseInt(d3.select('#K')[0][0].value, 10);

  let mod = d3.select('input[name="type"]:checked').node().value
  if (mod === 'k-means')
    clust = new Kmeans(WIDTH, HEIGHT, N, K);
  else
    clust = new Minimax(WIDTH, HEIGHT, N);
}

function restart() {
  d3.select('#restart').attr('disabled', 'disabled');

  clust.restart();
}

function draw() {
  let circles = dotg.selectAll('circle')
    .data(clust.dots);
  circles.enter()
    .append('circle');
  circles.exit().remove();
  circles
    .transition()
    .duration(500)
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('fill', function(d) { return d.group ? d.group.color : '#ffffff'; })
    .attr('r', 5);

  if (clust.dots[0].group) {
    let l = lineg.selectAll('line')
      .data(clust.dots);
    let updateLine = function(lines) {
      lines
        .attr('x1', function(d) { return d.x; })
        .attr('y1', function(d) { return d.y; })
        .attr('x2', function(d) { return d.group.center.x; })
        .attr('y2', function(d) { return d.group.center.y; })
        .attr('stroke', function(d) { return d.group.color; });
    };
    updateLine(l.enter().append('line'));
    updateLine(l.transition().duration(500));
    l.exit().remove();
  } else {
    lineg.selectAll('line').remove();
  }

  let c = centerg.selectAll('path')
    .data(clust.groups);
  let updateCenters = function(centers) {
    centers
      .attr('transform', function(d) { return 'translate(' + d.center.x + ',' + d.center.y + ') rotate(45)';})
      .attr('fill', function(d,i) { return d.color; })
      .attr('stroke', '#aabbcc');
  };
  c.exit().remove();
  updateCenters(c.enter()
    .append('path')
    .attr('d', d3.svg.symbol().type('cross'))
    .attr('stroke', '#aabbcc'));
  updateCenters(c
    .transition()
    .duration(500));
}

init(); draw();
