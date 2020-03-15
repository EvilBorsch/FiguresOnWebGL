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


function createCube(isFilled) {
  clearScene();
  let mesh;
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
  if (isFilled) {
    mesh = new THREE.Mesh(cubeGeo, cubeMat);
  } else mesh = new THREE.LineSegments(cubeGeo, cubeMat);
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  objects[0] = mesh;
  scene.add(objects[0]);
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


function createSphere(isFilled) {
  let mesh;
  clearScene();
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
  if (isFilled) {
    mesh = new THREE.Mesh(sphereGeo, sphereMat);
  } else mesh = new THREE.LineSegments(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  objects[0] = mesh;
  scene.add(objects[0]);
}

function createSnowman(isFilled) {
  clearScene();
  let item;
  const group = new THREE.Group();


  let itemGeometry = new THREE.SphereGeometry(4.5, 10);
  let wireframe = new THREE.MeshPhongMaterial({color: '#CA8'});
  if (isFilled) {
    item = new THREE.Mesh(itemGeometry, wireframe);
  } else {
    item = new THREE.LineSegments(wireframe);
  }
  group.add(item);

  itemGeometry = new THREE.SphereGeometry(3, 10);
  wireframe = new THREE.MeshPhongMaterial({color: '#CA8'});
  if (isFilled) {
    item = new THREE.Mesh(itemGeometry, wireframe);
  } else {
    item = new THREE.LineSegments(wireframe);
  }
  item.position.y = 6;
  group.add(item);

  itemGeometry = new THREE.SphereGeometry(1.5, 10);
  wireframe = new THREE.MeshPhongMaterial({color: '#CA8'});
  if (isFilled) {
    item = new THREE.Mesh(itemGeometry, wireframe);
  } else {
    item = new THREE.LineSegments(wireframe);
  }
  item.position.y = 5.5 + 4.3;
  group.add(item);

  itemGeometry = new THREE.SphereGeometry(0.2, 5);
  wireframe = new THREE.MeshPhongMaterial({color: '#CA8'});
  if (isFilled) {
    item = new THREE.Mesh(itemGeometry, wireframe);
  } else {
    item = new THREE.LineSegments(wireframe);
  }
  item.position.y = 5.5 + 4.3 + 0.5;
  item.position.z = 1.3;
  group.add(item);

  itemGeometry = new THREE.SphereGeometry(2, 50);
  wireframe = new THREE.MeshPhongMaterial({color: '#CA8'});
  if (isFilled) {
    item = new THREE.Mesh(itemGeometry, wireframe);
  } else {
    item = new THREE.LineSegments(wireframe);
  }
  item.position.x = -0.7;
  item.position.y = 5.5 + 4.3 + 0.5;
  item.position.z = 1;
  group.add(item);
  objects[0] = group;
  scene.add(objects[0]);
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
        createCube(parameters.fill);
        break;
      case 'Sphere':
        createSphere(parameters.fill);
        break;
      case 'Snowman':
        createSnowman(parameters.fill);
        break;
    }
  }

  const stringList = ['Sphere', 'Cube', 'Snowman'];
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
