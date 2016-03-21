import Cluster from './cluster';

export default class Minimax extends Cluster {
  constructor(width, height, N) {
    super(width, height, N);
    this.addNewNode(this.dots[0].x, this.dots[0].y);
    this.maxDistances = [];
    this.isReady = false;
  }
  addNewNode(_x, _y) {
    let i = this.groups.length;
    let g = {
      dots: [],
      color: 'hsl(' + (i * 360 / 15) + ',100%,50%)',
      center: {
        x: _x,
        y: _y
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
  step() {
    if (!this.isReady) this.updateCenter();
    if (this.isReady)  this.updateGroups();
  }
  updateCenter() {
    let self = this;

    let maxDot;
    let max = -Infinity;
    this.dots.forEach((dot) => {
      let min = Infinity;

      this.groups.forEach(function(g) {
        let d = Math.sqrt(Math.pow(g.center.x - dot.x, 2) + Math.pow(g.center.y - dot.y, 2));
        if (d < min) {
          min = d;
        }
      });

      if (min > max) {
        max = min
        maxDot = dot;
      }
    });

    let ave = this.maxsAverage();
    if (max > ave) {
      this.addNewNode(maxDot.x, maxDot.y);
      this.maxDistances.push(max);
    } else {
      this.isReady = true;
    }
  }
  maxsAverage() {
    let sum = 0;
    this.maxDistances.forEach(function(s) {
      sum += s;
    });
    return sum / (this.maxDistances.length + 2);
  }
  updateGroups() {
    console.log('ttt');
    let self = this;
    this.groups.forEach(function(g) { g.dots = []; });
    this.dots.forEach(function(dot) {
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
    this.isReady = false;
    this.maxDistances = [];
    let one = this.groups[0];
    this.groups = [];
    this.groups.push(one);
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
