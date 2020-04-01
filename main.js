import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

let camera;
let scene;
const parameters =
    {
      fill: true, // boolean (checkbox)
      rotation: 'No',
      w: '...', // dummy value, only type is important
      x: 0, y: 0, z: 0,
    };


const objects = [];


function setUpCamera() {
  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);
}


function createCube(isFilled, cubeSize) {
  let mesh;
  const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
  if (isFilled) {
    mesh = new THREE.Mesh(cubeGeo, cubeMat);
  } else mesh = new THREE.LineSegments(cubeGeo, cubeMat);

  return mesh;
}


function setUpTextureLoader(scene) {
  const planeSize = 40;

  const loader = new THREE.TextureLoader();
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -.5;
  scene.add(mesh);
}

function clearScene() {
  scene.remove(objects[0]);
}

function addToScene(mesh) {
  clearScene();
  objects[0] = mesh;
  scene.add(objects[0]);
}

function createSphere(isFilled, radius, coords) {
  let mesh;
  const sphereRadius = radius;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({color: '#cccac2'});
  if (isFilled) {
    mesh = new THREE.Mesh(sphereGeo, sphereMat);
  } else mesh = new THREE.LineSegments(sphereGeo, sphereMat);
  mesh.position.set(...coords);
  return mesh;
}


function createCone(isFilled, radius, height) {
  let mesh;
  const segments = 16;
  const geometry = new THREE.ConeBufferGeometry(radius, height, segments);
  const material = new THREE.MeshPhongMaterial({color: '#cccac2'});
  if (isFilled) {
    mesh = new THREE.Mesh(geometry, material);
  } else mesh = new THREE.LineSegments(geometry, material);
  return mesh;
}

function createCylinder(isFilled, radiusTop, radiusBottom, height) {
  console.log('cylinder');
  let mesh;
  const radialSegments = 12;
  const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments);
  const material = new THREE.MeshPhongMaterial({color: '#cccac2'});
  if (isFilled) {
    mesh = new THREE.Mesh(geometry, material);
  } else mesh = new THREE.LineSegments(geometry, material);
  return mesh;
}

function createSnowman(isFilled) {
  let item;
  const group = new THREE.Group();
  item = createSphere(isFilled, 3, [0, 3, 0]);
  group.add(item);
  item = createSphere(isFilled, 2, [0, 7, 0]);
  group.add(item);
  item = createSphere(isFilled, 1, [0, 9, 0]);
  group.add(item);
  item = createCylinder(isFilled, 1, 1, 1.8);
  item.position.set(0, 10.4, 0);
  group.add(item);
  item = createCylinder(isFilled, 0.09, 0.09, 7);
  item.position.set(0, 7, 0);
  item.rotation.x = 8;
  group.add(item);
  item = createCone(isFilled, 0.25, 1);
  item.position.set(1, 9, 0);
  item.rotation.z = 4.7;
  group.add(item);

  return group;
}

function createThorus(isFilled, radius, tubeRadius) {
  let mesh;
  const radialSegments = 24;
  const tubularSegments = 24;
  const geometry = new THREE.TorusBufferGeometry(radius, tubeRadius, radialSegments, tubularSegments);
  const material = new THREE.MeshPhongMaterial({color: '#cccac2'});
  if (isFilled) {
    mesh = new THREE.Mesh(geometry, material);
  } else mesh = new THREE.LineSegments(geometry, material);
  return mesh;
}

function createTree(isFilled) {
  let item;
  const group = new THREE.Group();
  item = createCylinder(isFilled, 1, 1, 2);
  group.add(item);
  item = createCone(isFilled, 2, 2);
  item.position.set(0, 2, 0);
  group.add(item);
  item = createCone(isFilled, 2, 2);
  item.position.set(0, 3, 0);
  group.add(item);
  item = createCone(isFilled, 2, 2);
  item.position.set(0, 4, 0);
  group.add(item);
  return group;
}


function setUpGui() {
  const gui = new GUI();
  gui.add(parameters, 'fill').name('Залить?');
  const rotationList = ['X', 'Y', 'Z', 'No'];
  gui.add(parameters, 'rotation', rotationList).name('Вращение').onChange((v) => {
    console.log(parameters.rotation);
  });

  function ListHandler(v) {
    switch (v) {
      case 'Cube':
        const cube = createCube(parameters.fill, 4);
        cube.position.set(5, 2, 0);
        addToScene(cube);
        break;
      case 'Sphere':
        const sphere = createSphere(parameters.fill, 3, [-3 - 1, 3 + 2, 0]);
        addToScene(sphere);
        break;
      case 'Snowman':
        const snowman = createSnowman(parameters.fill);
        addToScene(snowman);
        break;
      case 'Cone':
        const cone = createCone(parameters.fill, 3, 3);
        cone.position.set(0, 2, 0);
        addToScene(cone);
        break;
      case 'Cylinder':
        const cylinder = createCylinder(parameters.fill, 3, 3, 3);
        cylinder.position.set(0, 2, 0);
        addToScene(cylinder);
        break;
      case 'Thorus':
        const thorus = createThorus(parameters.fill, 3, 2);
        thorus.position.set(3, 5, 3);
        addToScene(thorus);
        break;
      case 'Tree':
        const tree = createTree(parameters.fill);
        tree.position.set(0, 1, 0);
        addToScene(tree);
    }
  }

  const stringList = ['Sphere', 'Cube', 'Snowman', 'Cone', 'Cylinder', 'Thorus', 'Tree'];
  gui.add(parameters, 'w', stringList).name('Список фигур').onChange(ListHandler);

  const folder1 = gui.addFolder('Coordinates');
  folder1.add(parameters, 'x').onChange((xCoord) => {
    // eslint-disable-next-line max-len
    objects.forEach((obj) => obj.position.set(xCoord, obj.position.y, obj.position.z));
  });
  folder1.add(parameters, 'y').onChange((yCoord) => {
    // eslint-disable-next-line max-len
    objects.forEach((obj) => obj.position.set(obj.position.x, yCoord, obj.position.z));
  });
  folder1.add(parameters, 'z').onChange((zCoord) => {
    // eslint-disable-next-line max-len
    objects.forEach((obj) => obj.position.set(obj.position.x, obj.position.y, zCoord));
  });
  folder1.close();
  gui.open();
}


function setUpCanvas() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const controls = new OrbitControls(camera, canvas); // позволяет вертеть камерой мышкой
  controls.target.set(0, 5, 0);
  controls.update();

  return renderer;
}


function setUpLight(scene) {
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 0);
  light.target.position.set(-5, 0, 0);
  scene.add(light);
  scene.add(light.target);
}


function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function updateRotation(obj, time) {
  switch (parameters.rotation) {
    case 'No':
      break;
    case 'X':
      obj.rotation.x = time;
      break;
    case 'Y':
      obj.rotation.y = time;
      break;
    case 'Z':
      obj.rotation.z = time;
      break;
  }
}

function main() {
  setUpCamera();
  setUpGui();
  const renderer = setUpCanvas();

  scene = new THREE.Scene();
  scene.background = new THREE.Color('black');
  setUpTextureLoader(scene);
  setUpLight(scene);

  const render = (time) => {
    time *= 0.01; // перевод в секунды
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      if (obj != null) {
        updateRotation(obj, time);
      }
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

main();
