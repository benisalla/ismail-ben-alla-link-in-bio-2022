import "./style.css";
import "./menu.js";


import * as THREE from 'three';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const table = [
  'docker', 'Docker', '1.00794', 1, 1,
  'windows', 'Windows', '4.002602', 18, 1,
  'linux', 'Linux', '6.941', 1, 2,
  'github', 'Git-Hub', '9.012182', 2, 2,
  'git', 'Git', '10.811', 13, 2,
  'vs', 'Visual-Studio', '12.0107', 14, 2,
  'pyCharm', 'PyCharm', '14.0067', 15, 2,
  'eclipse', 'Eclipse', '15.9994', 16, 2,
  'angular', 'Angular', '18.9984032', 17, 2,
  'vuejs', 'VueJS', '20.1797', 18, 2,
  'aspdotnet', 'ASP.net', '22.98976...', 1, 3,
  'jee', 'JEE', '24.305', 2, 3,
  'flask', 'Flask', '26.9815386', 13, 3,
  'django', 'Django', '28.0855', 14, 3,
  'symfony', 'Symfony', '30.973762', 15, 3,
  'spring', 'Spring', '32.065', 16, 3,
  'matlab', 'MatLab', '35.453', 17, 3,
  'labview', 'LabView', '39.948', 18, 3,
  'simulink', 'SimuLink', '39.948', 1, 4,
  'arduino', 'Arduino', '40.078', 2, 4,
  'hibernate', 'HiberNate', '44.955912', 3, 4,
  'phonegap', 'Phone-Gap', '47.867', 4, 4,
  'nativescript', 'Native-Script', '50.9415', 5, 4,
  'firebase', 'FireBase', '51.9961', 6, 4,
  'adria', 'Adria', '54.938045', 7, 4,
  'xml', 'XML', '55.845', 8, 4,
  'pascal', 'Pascal', '58.933195', 9, 4,
  'scala', 'Scala', '58.6934', 10, 4,
  'mongoDB', 'MongoDB', '63.546', 11, 4,
  'mariaDB', 'MariaDB', '65.38', 12, 4,
  'mockaroo', 'Mockaroo', '69.723', 13, 4,
  'stackOverflow', 'Stack-OverFlow', '72.63', 14, 4,
  'wordpress', 'WordPress', '74.9216', 15, 4,
  'xampp', 'XAMPP', '78.96', 16, 4,
  'workbench', 'WorkBench', '79.904', 17, 4,
  'canva', 'Canva', '83.798', 18, 4,
  'ai', 'AI', '85.4678', 1, 5,
  'pandas', 'Pandas', '87.62', 2, 5,
  'plotly', 'Plotly', '88.90585', 3, 5, 
  'seaborn', 'SeaBorn', '91.224', 4, 5,
  'matplotlib', 'MatPlotLib', '92.90628', 5, 5,
  'mircosoftCognitiveToolKit', 'Mircosoft CTK', '95.96', 6, 5,
  'mxnet', 'MXnet', '(98)', 7, 5,
  'scipy', 'Scipy', '101.07', 8, 5,
  'tflearn', 'TFlearn', '102.9055', 9, 5,
  'ONNX', 'ONNX', '106.42', 10, 5,
  'perl', 'Perl', '107.8682', 11, 5,
  'wolfram', 'Wolfram', '112.411', 12, 5,
  'openNN', 'openNN', '114.818', 13, 5,
  'autoML', 'auto-ML', '118.71', 14, 5,
  'beautifulsoup', 'Beautiful-Soup', '121.76', 15, 5,
  'scrapy', 'ScraPy', '127.6', 16, 5,
  'pyCaret', 'PyCaret', '126.90447', 17, 5,
  'h2o', 'H2O', '131.293', 18, 5,
  'tibco', 'Tibco', '132.9054', 1, 6,
  'rapidminer', 'Rapid-Miner', '132.9054', 2, 6,
  'sas', 'SAS', '138.90547', 4, 9,
  'datarobot', 'Data-Robot', '140.116', 5, 9,
  'knime', 'Knime', '140.90765', 6, 9,
  'bottle', 'Bottle', '144.242', 7, 9,
  'cherrypy', 'CherryPy', '(145)', 8, 9,
  'dash', 'Dash', '150.36', 9, 9,
  'tornado', 'Tornado', '151.964', 10, 9,
  'fastAPI', 'Fast-API', '157.25', 11, 9,
  'd3', 'D3', '158.92535', 12, 9,
  'animejs', 'ANIMEjs', '162.5', 13, 9,
  'backbonejs', 'BACKBONEjs', '164.93032', 14, 9,
  'nodejs', 'NODEjs', '167.259', 15, 9,
  'nextjs', 'NEXTjs', '168.93421', 16, 9,
  'solidity', 'Solidity', '173.054', 17, 9,
  'oracle', 'Oracle', '174.9668', 18, 9,
  'uml', 'UML', '178.49', 4, 6,
  'mysql', 'MySQL', '180.94788', 5, 6,
  'merise', 'MERISE', '183.84', 6, 6,
  'python', 'Python', '186.207', 7, 6,
  'pyTorch', 'PyTorch', '190.23', 8, 6,
  'numpy', 'NumPy', '192.217', 9, 6,
  'scikitLearn', 'ScikitLearn', '195.084', 10, 6,
  'tensorFlow', 'TensorFlow', '196.966569', 11, 6,
  'keras', 'Keras', '200.59', 12, 6,
  'R', 'R', '204.3833', 13, 6,
  'openCV', 'openCV', '207.2', 14, 6,
  'caffe', 'Caffe', '208.9804', 15, 6,
  'theano', 'Theano', '(209)', 16, 6,
  'torch', 'Torch', '(210)', 17, 6,
  'cntk', 'Cntk', '(222)', 18, 6,
  'spark', 'Spark', '(223)', 1, 7,
  'weka', 'Weka', '(226)', 2, 7,
  'sparkMllib', 'SparkMllib', '(227)', 4, 10,
  'mlPack', 'MLPack', '232.03806', 5, 10,
  'Jax', 'Jax', '231.0588', 6, 10,
  'paddlepaddle', 'Paddle-Paddle', '238.02891', 7, 10,
  'ajax', 'AJAX', '(237)', 8, 10,
  'Tailwind', 'Tailwind', '(244)', 9, 10,
  'bootstrap', 'Bootstrap', '(243)', 10, 10,
  'css', 'CSS', '(247)', 11, 10,
  'html', 'HTML', '(247)', 12, 10,
  'swift', 'Swift', '(251)', 13, 10,
  'Cordova', 'Cordova', '(252)', 14, 10,
  'ionic', 'ionic', '(257)', 15, 10,
  'xamarin', 'Xamarin', '(258)', 16, 10,
  'flutter', 'Flutter', '(259)', 17, 10,
  'reactNative', 'React-Native', '(262)', 18, 10,
  'android', 'Android', '(267)', 4, 7,
  'kotlin', 'Kotlin', '(268)', 5, 7,
  'java', 'Java', '(271)', 6, 7,
  'laravel', 'Laravel', '(272)', 7, 7,
  'mvc', 'MVC', '(270)', 8, 7,
  'php', 'PHP', '(276)', 9, 7,
  'dotnet', '.net', '(281)', 10, 7,
  'Csharp', 'C#', '(280)', 11, 7,
  'cpp', 'C++', '(285)', 12, 7,
  'c', 'c', '(286)', 13, 7,
  'react', 'ReactJS', '(289)', 14, 7,
  'threejs', 'ThreeJS', '(290)', 15, 7,
  'gsap', 'Gsap', '(293)', 16, 7,
  'jquery', 'Jquery', '(294)', 17, 7,
  'javascript', 'JavaScript', '(294)', 18, 7
];

let camera, scene, renderer;
let controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 3000;

  scene = new THREE.Scene();

  // table

  for ( let i = 0; i < table.length; i += 5 ) {

    const element = document.createElement( 'div' );
    element.className = 'element';
    element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

    const number = document.createElement( 'div' );
    number.className = 'number';
    number.textContent = ( i / 5 ) + 1;
    element.appendChild( number );

    const symbol = document.createElement( 'img' );
    symbol.className = 'symbol';
    symbol.src = require("./images/logos/"+table[i]+".png");
    element.appendChild( symbol );

    const details = document.createElement( 'div' );
    details.className = 'details';
    details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
    element.appendChild( details );

    const objectCSS = new CSS3DObject( element );
    objectCSS.position.x = Math.random() * 4000 - 2000;
    objectCSS.position.y = Math.random() * 4000 - 2000;
    objectCSS.position.z = Math.random() * 4000 - 2000;
    scene.add( objectCSS );

    objects.push( objectCSS );

    //

    const object = new THREE.Object3D();
    object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
    object.position.y = - ( table[ i + 4 ] * 180 ) + 990;

    targets.table.push( object );

  }

  // sphere

  const vector = new THREE.Vector3();

  for ( let i = 0, l = objects.length; i < l; i ++ ) {

    const phi = Math.acos( - 1 + ( 2 * i ) / l );
    const theta = Math.sqrt( l * Math.PI ) * phi;

    const object = new THREE.Object3D();

    object.position.setFromSphericalCoords( 800, phi, theta );

    vector.copy( object.position ).multiplyScalar( 2 );

    object.lookAt( vector );

    targets.sphere.push( object );

  }

  // helix

  for ( let i = 0, l = objects.length; i < l; i ++ ) {

    const theta = i * 0.175 + Math.PI;
    const y = - ( i * 8 ) + 450;

    const object = new THREE.Object3D();

    object.position.setFromCylindricalCoords( 900, theta, y );

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt( vector );

    targets.helix.push( object );

  }

  // grid

  for ( let i = 0; i < objects.length; i ++ ) {

    const object = new THREE.Object3D();

    object.position.x = ( ( i % 5 ) * 400 ) - 800;
    object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
    object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

    targets.grid.push( object );

  }

  //
  renderer = new CSS3DRenderer();
  document.getElementById( 'container' ).appendChild( renderer.domElement );
  renderer.setSize( window.innerWidth, window.innerHeight );


  //

  controls = new TrackballControls( camera, renderer.domElement );
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener( 'change', render );

  const buttonTable = document.getElementById( 'table' );
  buttonTable.addEventListener( 'click', function () {

    transform( targets.table, 2000 );

  } );

  const buttonSphere = document.getElementById( 'sphere' );
  buttonSphere.addEventListener( 'click', function () {

    transform( targets.sphere, 2000 );

  } );

  const buttonHelix = document.getElementById( 'helix' );
  buttonHelix.addEventListener( 'click', function () {

    transform( targets.helix, 2000 );

  } );

  const buttonGrid = document.getElementById( 'grid' );
  buttonGrid.addEventListener( 'click', function () {

    transform( targets.grid, 2000 );

  } );

  transform( targets.table, 2000 );

  //

  window.addEventListener( 'resize', onWindowResize );

}

function transform( targets, duration ) {

  TWEEN.removeAll();

  for ( let i = 0; i < objects.length; i ++ ) {

    const object = objects[ i ];
    const target = targets[ i ];

    new TWEEN.Tween( object.position )
      .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

    new TWEEN.Tween( object.rotation )
      .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

  }

  new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

function animate() {

  requestAnimationFrame( animate );

  TWEEN.update();

  controls.update();

}

function render() {

  renderer.render( scene, camera );

}
