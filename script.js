const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Iluminação mágica
const light = new THREE.PointLight(0x00ffcc, 2, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Tronco da flor
const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x007f5f });
const stem = new THREE.Mesh(stemGeometry, stemMaterial);
stem.position.y = -0.5;
scene.add(stem);

// Folhas
const leafGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

const leaves = [];
for (let i = 0; i < 2; i++) {
  const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
  leaf.position.set(i === 0 ? -0.3 : 0.3, -0.3, 0);
  leaves.push(leaf);
  scene.add(leaf);
}

// Pétalas
const petalGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const petalMaterial = new THREE.MeshStandardMaterial({ color: 0x6600ff, emissive: 0x3300ff });

const petals = [];
const numPetals = 5;
for (let i = 0; i < numPetals; i++) {
  const angle = (i / numPetals) * Math.PI * 2;
  const petal = new THREE.Mesh(petalGeometry, petalMaterial);
  petal.position.set(Math.cos(angle) * 0.3, 1, Math.sin(angle) * 0.3);
  petals.push(petal);
  scene.add(petal);
}

// Animação de nascimento
let growth = 0;
function animate() {
  requestAnimationFrame(animate);
  
  if (growth < 1) growth += 0.005;

  stem.scale.y = growth;
  stem.position.y = -0.5 + growth;

  leaves.forEach((leaf, i) => {
    leaf.scale.set(growth, growth, growth);
    leaf.rotation.z = Math.sin(Date.now() * 0.002 + i);
  });

  petals.forEach((petal, i) => {
    petal.scale.set(growth, growth, growth);
    petal.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
