const canvas = document.getElementById('dfsCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const width = canvas.clientWidth;
  const height = (width * 3) / 4;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.height = height + 'px';
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

const nodes = Array.from({ length: 12 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 12;
  return {
    id: i,
    x: 400 + 250 * Math.cos(angle),
    y: 300 + 250 * Math.sin(angle)
  };
});

const edges = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [4, 7],
  [5, 8],
  [6, 9],
  [6, 10],
  [10, 11]
];

let dfsOrder = [];
let visitedSet = new Set();
let currentPoint = null;

function drawGraph(current = null) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 간선
  edges.forEach(([from, to]) => {
    const a = nodes[from];
    const b = nodes[to];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = '#8fd4ff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 노드
  nodes.forEach((node, index) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = dfsOrder.includes(index)
      ? index === current
        ? '#00aaff'
        : '#33ccffaa'
      : 'rgba(255,255,255,0.2)';
    ctx.fill();
    ctx.strokeStyle = '#00b0ff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(index, node.x, node.y);
  });

  // 빛나는 점
  if (currentPoint) {
    ctx.beginPath();
    ctx.arc(currentPoint.x, currentPoint.y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function movePoint(from, to, callback) {
  const a = nodes[from];
  const b = nodes[to];
  const duration = 600;
  const frames = 30;
  let frame = 0;

  function animate() {
    const t = frame / frames;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    currentPoint = { x, y };
    drawGraph();
    frame++;
    if (frame <= frames) {
      requestAnimationFrame(animate);
    } else {
      currentPoint = null;
      callback();
    }
  }
  animate();
}

function dfs(start) {
  const stack = [start];
  dfsOrder = [];
  visitedSet.clear();

  function step() {
    if (stack.length === 0) return;
    const current = stack.pop();
    if (visitedSet.has(current)) {
      setTimeout(step, 150);
      return;
    }

    visitedSet.add(current);
    dfsOrder.push(current);
    drawGraph(current);

    const next = edges
      .filter(([from]) => from === current)
      .map(([_, to]) => to)
      .reverse()
      .filter((to) => !visitedSet.has(to));

    stack.push(...next);

    if (dfsOrder.length > 1) {
      const from = dfsOrder[dfsOrder.length - 2];
      const to = dfsOrder[dfsOrder.length - 1];
      movePoint(from, to, () => setTimeout(step, 150));
    } else {
      setTimeout(step, 150);
    }
  }

  step();
}

document.getElementById('startBtn').addEventListener('click', () => {
  dfsOrder = [];
  currentPoint = null;
  visitedSet.clear();
  dfs(0);
});

window.addEventListener('resize', () => {
  resizeCanvas();
  drawGraph();
});

resizeCanvas();
drawGraph();
