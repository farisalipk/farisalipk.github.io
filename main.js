import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-10, 60, -290); // Initial camera position
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('forest_background.jpg');
scene.background = backgroundTexture;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Load forest floor model
const loader = new GLTFLoader();
let forestFloorModel;

loader.load('forest_model.glb', (gltf) => {
    forestFloorModel = gltf.scene;
    forestFloorModel.scale.set(60, 60, 60); // Adjust the scale as needed
    forestFloorModel.rotation.set(Math.PI / 1, 0, 0); // Rotate 90 degrees around the x-axis

    scene.add(forestFloorModel);

    // Load other models and arrange them across the forest floor
    loadModels();
});

// Function to load other models and arrange them across the forest floor
function loadModels() {
    const modelsToLoad = ['mealworms.glb', 'pupa.glb', 'beetle.glb'];

    modelsToLoad.forEach((model, index) => {
        loader.load(model, (gltf) => {
            const modelInstance = gltf.scene;
            if (index == 0) {
                modelInstance.scale.set(1.5, 1.5, 1.5)
                modelInstance.position.set((index - 1) * 10, -5, (index - 1) * 100);

            } else if (index == 1) {
                modelInstance.rotation.z += 8
                modelInstance.scale.set(4, 4, 4)
                modelInstance.position.set((index - 1) * 10, 0, (index - 1) * 100);

            } else {
                modelInstance.rotation.y += 4
                modelInstance.scale.set(7.5, 7.5, 7.5)
                modelInstance.position.set((index - 1) * 10, 0, (index - 1) * 100);

            }
            // Arrange models across the forest floor
            scene.add(modelInstance);
        });
    });
}

// Define camera positions for different life stages
const cameraPositions = [
    { x: -10, y: 65, z: -290 }, // Initial view overlooking the forest floor
    { x: -10, y: 8, z: -160 }, // Mealworm view
    { x: 10, y: 5, z: -40 }, // Pupa view
    { x: 20, y: 7, z: 140 }, // Beetle view
];

// Define descriptions for different life stages
const descriptions = [
    "Welcome to my mealworm project! Built in Three.js, this interactive website provides a firsthand view of each stage of a mealworm's life.",
    "The mealworm stage is the larval stage of the mealworm beetle. During this stage, the mealworm feeds voraciously on organic matter, such as grains, vegetables, and decaying plant material. It undergoes rapid growth, shedding its exoskeleton several times as it grows. Mealworms are an important food source for many animals and are commonly used as feed for reptiles, birds, and fish.",
    "The pupa stage is a transformative phase in the mealworm life cycle. After the mealworm has completed its larval growth, it enters the pupa stage, where it undergoes metamorphosis into its adult form. Inside the pupa, profound changes occur as the larval tissues are broken down and reorganized to form the adult structures of the beetle. This stage is marked by a period of dormancy, during which the pupa is encased in a protective cocoon.",
    "The adult stage of the mealworm beetle marks the culmination of its life cycle. Emerging from the pupal cocoon, the adult beetle is fully formed and ready to reproduce. Mealworm beetles are small, dark-colored insects with hard exoskeletons. They have six legs, antennae, and wings, though some species may be flightless. As adults, mealworm beetles mate and lay eggs, continuing the cycle of life."
];

const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
let currentViewIndex = 0;

nextButton.addEventListener('click', () => {
    currentViewIndex = (currentViewIndex + 1) % cameraPositions.length;
    animateCameraTo(cameraPositions[currentViewIndex]);
    showDescription(descriptions[currentViewIndex]);
});

prevButton.addEventListener('click', () => {
    currentViewIndex = (currentViewIndex - 1 + cameraPositions.length) % cameraPositions.length;
    animateCameraTo(cameraPositions[currentViewIndex]);
    showDescription(descriptions[currentViewIndex]);
});


// Function to animate camera to a given position
function animateCameraTo(position) {
    new TWEEN.Tween(camera.position)
        .to(position, 1000) // Adjust duration as needed
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
}


function showDescription(text) {
    const descriptionElement = document.getElementById('description-text');
    descriptionElement.textContent = text;
}




// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enablePan = true;

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
}

animate();
