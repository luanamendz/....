const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);

// Luz ambiente + luz direcional
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Tronco (caule)
const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x007f5f });
const stem = new THREE.Mesh(stemGeometry, stemMaterial);
stem.position.y = -0.5;
scene.add(stem);

// Folhas (achatadas, verdes)
const leafGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
const leftLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
const rightLeaf = new THREE.Mesh(leafGeometry, leafMaterial);

leftLeaf.scale.set(1.2, 0.5, 0.8);
rightLeaf.scale.set(1.2, 0.5, 0.8);

leftLeaf.position.set(-0.4, -0.3, 0);
rightLeaf.position.set(0.4, -0.3, 0);

scene.add(leftLeaf);
scene.add(rightLeaf);

// Pétalas alongadas
const petalGeometry = new THREE.ConeGeometry(0.1, 0.5, 32);
const petalMaterial = new THREE.MeshStandardMaterial({
  color: 0x6600ff,
  emissive: 0x3300ff,
  metalness: 0.3,
  roughness: 0.2,
});

const petals = [];
const petalCount = 6;
const radius = 0.4;

for (let i = 0; i < petalCount; i++) {
  const angle = (i / petalCount) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const petal = new THREE.Mesh(petalGeometry, petalMaterial);
  petal.position.set(x, 1, z);
  petal.rotation.x = Math.PI / 2;
  petal.lookAt(0, 1, 0); // faz olhar para o centro
  petals.push(petal);
  scene.add(petal);
}

// Animação suave de crescimento e abertura
let growth = 0;

function animate() {
  requestAnimationFrame(animate);

  if (growth < 1) {
    growth += 0.01;
  }

  // Faz tudo crescer suavemente
  stem.scale.y = growth;
  stem.position.y = -0.5 + growth;

  leftLeaf.scale.set(1.2 * growth, 0.5 * growth, 0.8 * growth);
  rightLeaf.scale.set(1.2 * growth, 0.5 * growth, 0.8 * growth);

  petals.forEach((petal, index) => {
    petal.scale.set(growth, growth, growth);
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
