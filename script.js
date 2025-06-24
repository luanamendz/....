const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);

// Luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Caule
const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x007f5f });
const stem = new THREE.Mesh(stemGeometry, stemMaterial);
stem.position.y = 0;
scene.add(stem);

// Folhas
const leafShape = new THREE.Shape();
leafShape.absellipse(0, 0, 0.3, 0.15, 0, Math.PI * 2, false, 0);

const leafGeometry = new THREE.ExtrudeGeometry(leafShape, { depth: 0.05, bevelEnabled: false });
const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

const leftLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
leftLeaf.position.set(-0.4, -0.5, 0);
leftLeaf.rotation.set(0, 0, Math.PI / 4);

const rightLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
rightLeaf.position.set(0.4, -0.5, 0);
rightLeaf.rotation.set(0, 0, -Math.PI / 4);

scene.add(leftLeaf);
scene.add(rightLeaf);

// 🌸 Pétalas - usando LatheGeometry pra gerar curvatura
const points = [];
points.push(new THREE.Vector2(0, 0));
points.push(new THREE.Vector2(0.1, 0));
points.push(new THREE.Vector2(0.2, 0.3));
points.push(new THREE.Vector2(0, 0.6));

const petalGeometry = new THREE.LatheGeometry(points, 32);
const petalMaterial = new THREE.MeshStandardMaterial({
  color: 0x6600ff,
  emissive: 0x3300ff,
  metalness: 0.5,
  roughness: 0.3,
  side: THREE.DoubleSide,
});

const petals = [];
const petalCount = 6;
const radius = 0.5;

for (let i = 0; i < petalCount; i++) {
  const angle = (i / petalCount) * Math.PI * 2;
  const petal = new THREE.Mesh(petalGeometry, petalMaterial);
  petal.position.set(Math.cos(angle) * radius, 1, Math.sin(angle) * radius);
  petal.lookAt(0, 1.2, 0);
  petals.push(petal);
  scene.add(petal);
}

// Miolo da flor
const centerGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const centerMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: 0xffee00,
});
const center = new THREE.Mesh(centerGeometry, centerMaterial);
center.position.y = 1;
scene.add(center);

// Animação de crescimento
let growth = 0;

function animate() {
  requestAnimationFrame(animate);

  if (growth < 1) growth += 0.01;

  stem.scale.y = growth;
  stem.position.y = -1 + growth;

  leftLeaf.scale.set(growth, growth, growth);
  rightLeaf.scale.set(growth, growth, growth);

  petals.forEach((petal) => {
    petal.scale.set(growth, growth, growth);
  });

  center.scale.set(growth, growth, growth);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
