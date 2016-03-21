export default class Cluster {
  constructor(width, height, N) {
    this.groups = [];
    this.dots = [];

    for (let i = 0; i < N; i++) {
      let dot ={
        x: Math.random() * width,
        y: Math.random() * height,
        group: undefined
      };
      dot.init = {
        x: dot.x,
        y: dot.y,
        group: dot.group
      };
      this.dots.push(dot);
    }
  }
}
