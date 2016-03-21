import Cluster from './cluster';

export default class Kmeans extends Cluster {
  constructor(width, height, N, K) {
    super(width, height, N);
    for (let i = 0; i < K; i++) {
      let g = {
        dots: [],
        color: 'hsl(' + (i * 360 / K) + ',100%,50%)',
        center: {
          x: Math.random() * width,
          y: Math.random() * height
        },
        init: {
          center: {}
        }
      };
      g.init.center = {
        x: g.center.x,
        y: g.center.y
      };
      this.groups.push(g);
    }
  }
  step() {
    this.updateCenter();
    this.updateGroups();
  }
  updateCenter() {
    this.groups.forEach(function(group, i) {
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
  }
  updateGroups() {
    let self = this;
    this.groups.forEach(function(g) { g.dots = []; });
    this.dots.forEach(function(dot) {
      // find the nearest group
      let min = Infinity;
      let group;
      self.groups.forEach(function(g) {
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
  restart() {
    this.groups.forEach(function(g) {
      g.dots = [];
      g.center.x = g.init.center.x;
      g.center.y = g.init.center.y;
    });

    for (let i = 0; i < this.dots.length; i++) {
      let dot = this.dots[i];
      this.dots[i] = {
        x: dot.init.x,
        y: dot.init.y,
        group: undefined,
        init: dot.init
      };
    }
  }
}
