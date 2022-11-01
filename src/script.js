import "./style.css";
import "./menu.js";


import * as THREE from 'three';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const table = [
  'H', 'docker', '1.00794', 1, 1,
  'He', 'windows', '4.002602', 18, 1,
  'Li', 'linux', '6.941', 1, 2,
  'Be', 'github', '9.012182', 2, 2,
  'B', 'git', '10.811', 13, 2,
  'C', 'vs', '12.0107', 14, 2,
  'N', 'pycharm', '14.0067', 15, 2,
  'O', 'eclipse', '15.9994', 16, 2,
  'F', 'angular', '18.9984032', 17, 2,
  'Ne', 'vuejs', '20.1797', 18, 2,
  'Na', 'aspdotnet', '22.98976...', 1, 3,
  'Mg', 'jee', '24.305', 2, 3,
  'Al', 'flask', '26.9815386', 13, 3,
  'Si', 'django', '28.0855', 14, 3,
  'P', 'symfony', '30.973762', 15, 3,
  'S', 'spring', '32.065', 16, 3,
  'Cl', 'matlab', '35.453', 17, 3,
  'Ar', 'labview', '39.948', 18, 3,
  'K', 'simulink', '39.948', 1, 4,
  'Ca', 'arduino', '40.078', 2, 4,
  'Sc', 'hibernate', '44.955912', 3, 4,
  'Ti', 'phonegap', '47.867', 4, 4,
  'V', 'nativescript', '50.9415', 5, 4,
  'Cr', 'firebase', '51.9961', 6, 4,
  'Mn', 'adria', '54.938045', 7, 4,
  'Fe', 'xml', '55.845', 8, 4,
  'Co', '', '58.933195', 9, 4,
  'Ni', '', '58.6934', 10, 4,
  'Cu', '', '63.546', 11, 4,
  'Zn', '', '65.38', 12, 4,
  'Ga', '', '69.723', 13, 4,
  'Ge', '', '72.63', 14, 4,
  'As', '', '74.9216', 15, 4,
  'Se', '', '78.96', 16, 4,
  'Br', '', '79.904', 17, 4,
  'Kr', '', '83.798', 18, 4,
  'Rb', '', '85.4678', 1, 5,
  'Sr', 'pandas', '87.62', 2, 5,
  'Y', 'plotly', '88.90585', 3, 5,
  'Zr', 'seaborn', '91.224', 4, 5,
  'Nb', 'matplotlib', '92.90628', 5, 5,
  'Mo', 'matconvnet', '95.96', 6, 5,
  'Tc', 'mxnet', '(98)', 7, 5,
  'Ru', 'scipy', '101.07', 8, 5,
  'Rh', 'tflearn', '102.9055', 9, 5,
  'Pd', 'tensorflowlayer', '106.42', 10, 5,
  'Ag', 'perl', '107.8682', 11, 5,
  'Cd', 'wolfram', '112.411', 12, 5,
  'In', 'openNN', '114.818', 13, 5,
  'Sn', 'autoML', '118.71', 14, 5,
  'Sb', 'beautifulsoup', '121.76', 15, 5,
  'Te', 'scrapy', '127.6', 16, 5,
  'I', 'pyCaret', '126.90447', 17, 5,
  'Xe', 'h2o', '131.293', 18, 5,
  'Cs', 'tibco', '132.9054', 1, 6,
  'Ba', 'rapidminer', '132.9054', 2, 6,
  'La', 'sas', '138.90547', 4, 9,
  'Ce', 'datarobot', '140.116', 5, 9,
  'Pr', 'knime', '140.90765', 6, 9,
  'Nd', 'bottle', '144.242', 7, 9,
  'Pm', 'cherrypy', '(145)', 8, 9,
  'Sm', 'dash', '150.36', 9, 9,
  'Eu', 'tornado', '151.964', 10, 9,
  'Gd', 'fastApi', '157.25', 11, 9,
  'Tb', 'd3', '158.92535', 12, 9,
  'Dy', 'animejs', '162.5', 13, 9,
  'Ho', 'backbone', '164.93032', 14, 9,
  'Er', 'nodejs', '167.259', 15, 9,
  'Tm', 'nextjs', '168.93421', 16, 9,
  'Yb', 'solidity', '173.054', 17, 9,
  'Lu', 'oracle', '174.9668', 18, 9,
  'Hf', 'uml', '178.49', 4, 6,
  'Ta', 'mysql', '180.94788', 5, 6,
  'W', 'merise', '183.84', 6, 6,
  'Re', 'python', '186.207', 7, 6,
  'Os', 'pyTorch ', '190.23', 8, 6,
  'Ir', 'numpy', '192.217', 9, 6,
  'Pt', 'scikitLearn', '195.084', 10, 6,
  'Au', 'tensorFlow', '196.966569', 11, 6,
  'Hg', 'keras', '200.59', 12, 6,
  'Tl', 'R', '204.3833', 13, 6,
  'Pb', 'openCV', '207.2', 14, 6,
  'Bi', 'caffe', '208.9804', 15, 6,
  'Po', 'theano', '(209)', 16, 6,
  'At', 'torch', '(210)', 17, 6,
  'Rn', 'cntk', '(222)', 18, 6,
  'Fr', 'spark', '(223)', 1, 7,
  'Ra', 'weka', '(226)', 2, 7,
  'Ac', 'sparkMllib', '(227)', 4, 10,
  'Th', 'mlPack', '232.03806', 5, 10,
  'Pa', 'jax', '231.0588', 6, 10,
  'U', 'paddlepaddle', '238.02891', 7, 10,
  'Np', 'ajax', '(237)', 8, 10,
  'Pu', 'Tailwind', '(244)', 9, 10,
  'Am', 'bootstrap', '(243)', 10, 10,
  'Cm', 'css', '(247)', 11, 10,
  'Bk', 'html', '(247)', 12, 10,
  'Cf', 'swift', '(251)', 13, 10,
  'Es', 'apacheCordova', '(252)', 14, 10,
  'Fm', 'ionic', '(257)', 15, 10,
  'Md', 'xamarin', '(258)', 16, 10,
  'No', 'fluter', '(259)', 17, 10,
  'Lr', 'reactNative', '(262)', 18, 10,
  'Rf', 'android', '(267)', 4, 7,
  'Db', 'kotlin', '(268)', 5, 7,
  'Sg', 'java', '(271)', 6, 7,
  'Bh', 'laravel', '(272)', 7, 7,
  'Hs', 'mvc', '(270)', 8, 7,
  'Mt', 'php', '(276)', 9, 7,
  'Ds', 'dotnet', '(281)', 10, 7,
  'Rg', 'c#', '(280)', 11, 7,
  'Cn', 'cpp', '(285)', 12, 7,
  'Nh', 'c', '(286)', 13, 7,
  'Fl', 'react', '(289)', 14, 7,
  'Mc', 'threejs', '(290)', 15, 7,
  'Lv', 'gsap', '(293)', 16, 7,
  'Ts', 'jquery', '(294)', 17, 7,
  'Og', 'javascript', '(294)', 18, 7
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
    symbol.src = require("./images/logos/javascript.png");
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
