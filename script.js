const scene = new THREE.Scene();

// Fundo estilo galaxy
const loaderBG = new THREE.CubeTextureLoader();
const textureBG = loaderBG.load([
  'https://threejs.org/examples/textures/cube/space/px.jpg',
  'https://threejs.org/examples/textures/cube/space/nx.jpg',
  'https://threejs.org/examples/textures/cube/space/py.jpg',
  'https://threejs.org/examples/textures/cube/space/ny.jpg',
  'https://threejs.org/examples/textures/cube/space/pz.jpg',
  'https://threejs.org/examples/textures/cube/space/nz.jpg'
]);
scene.background = textureBG;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);

// Luz suave
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x66ccff, 2, 100);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Carregar flor
const gltfLoader = new THREE.GLTFLoader();
let flower;

gltfLoader.load('models/flower.glb', (gltf) => {
  flower = gltf.scene;
  flower.scale.set(0.001, 0.001, 0.001); // começa bem pequena
  scene.add(flower);
}, undefined, (error) => {
  console.error(error);
});

// Animação de crescimento
function animate() {
  requestAnimationFrame(animate);

  if (flower && flower.scale.x < 1) {
    flower.scale.x += 0.01;
    flower.scale.y += 0.01;
    flower.scale.z += 0.01;
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
