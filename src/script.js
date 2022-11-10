import "./style.css";
import "./menu.js";


import * as THREE from 'three';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const table = [
  'docker', 'Docker', '60'     , 1, 1,
  'windows', 'Windows', '100'  , 2, 1,
  'linux', 'Linux', '80'         , 3, 1,
  'github', 'Git-Hub', '100'   , 4, 1,
  'git', 'Git', '100'            , 5, 1,

  'vs', 'Visual-Studio', '90'     , 1, 2,

  'pyCharm', 'PyCharm', '90'      , 1, 3,
  'eclipse', 'Eclipse', '90'      , 2, 3,
  'angular', 'Angular', '40'   , 3, 3,
  'vuejs', 'VueJS', '30'          , 4, 3,
  'aspdotnet', 'ASP.net', '90', 5, 3,

  'jee', 'JEE', '90', 1, 4,

  'flask', 'Flask', '20'        , 1, 5,
  'django', 'Django', '10'         , 2, 5,
  'symfony', 'Symfony', '25'     , 3, 5,
  'spring', 'Spring', '35'          , 4, 5,
  'matlab', 'MatLab', '80'          , 5, 5,

  'labview', 'LabView', '60'            , 7, 1,
  'simulink', 'SimuLink', '50'          , 7, 2,
  'arduino', 'Arduino', '20'            , 7, 3,
  'hibernate', 'HiberNate', '30'     , 7, 4,
  'phonegap', 'Phone-Gap', '6'         , 7, 5,

  'nativescript', 'Native-Script', '90', 8, 2,

  'firebase', 'FireBase', '30'         , 9, 3,

  'adria', 'Adria', '90'             , 10, 4,

  'xml', 'XML', '90'                    , 11, 1,
  'pascal', 'Pascal', '40'           , 11, 2,
  'scala', 'Scala', '6'               , 11, 3,
  'mongoDB', 'MongoDB', '8'            , 11, 4,
  'mariaDB', 'MariaDB', '40'             , 11, 5,

  'mockaroo', 'Mockaroo', '90'          , 13, 1,
  'stackOverflow', 'Stack-OverFlow', '90', 14, 1,
  'wordpress', 'WordPress', '65'       , 15, 1,
  'xampp', 'XAMPP', '90'                 , 16, 1,
  'workbench', 'WorkBench', '90'        , 17, 1,

  'canva', 'Canva', '90', 13, 2,

  'ai', 'AI', '50'                   , 13, 3,
  'pandas', 'Pandas', '57'             , 14, 3,
  'plotly', 'Plotly', '60'          , 15, 3, 
  'seaborn', 'SeaBorn', '8'          , 16, 3,
  'matplotlib', 'MatPlotLib', '28'  , 17, 3,

  'mircosoftCognitiveToolKit', 'Mircosoft CTK', '20', 17, 4,

  'mxnet', 'MXnet', '5'            , 13, 5,
  'scipy', 'Scipy', '7'          , 14, 5,
  'tflearn', 'TFlearn', '32'    , 15, 5,
  'ONNX', 'ONNX', '14'            , 16, 5,
  'perl', 'Perl', '10'          , 17, 5,

  'wolfram', 'Wolfram', '11'             , 9, 6,

  'openNN', 'openNN', '18'               , 8, 7,
  'autoML', 'auto-ML', '41'               , 9, 7,
  'beautifulsoup', 'Beautiful-Soup', '16' , 10, 7,

  'scrapy', 'ScraPy', '50'                 , 7, 8,
  'pyCaret', 'PyCaret', '20'           , 8, 8,
  'h2o', 'H2O', '10'                     , 9, 8,
  'tibco', 'Tibco', '10'                , 10, 8,
  'rapidminer', 'Rapid-Miner', '5'     , 11, 8,

  'sas', 'SAS', '8'                   , 6, 9,
  'datarobot', 'Data-Robot', '6'        , 7, 9,
  'knime', 'Knime', '15'               , 8, 9,
  'bottle', 'Bottle', '12'               , 9, 9,
  'cherrypy', 'CherryPy', '15'             , 10, 9,
  'dash', 'Dash', '16'                    , 11, 9,
  'tornado', 'Tornado', '15'             , 12, 9,

  'fastAPI', 'Fast-API', '25'             , 5, 10,
  'd3', 'D3', '15'                     , 6, 10,
  'animejs', 'ANIMEjs', '65'               , 7, 10,
  'backbonejs', 'BACKBONEjs', '32'     , 8, 10,
  'nodejs', 'NODEjs', '69'               , 9, 10,
  'nextjs', 'NEXTjs', '80'             , 10, 10,
  'solidity', 'Solidity', '54'           , 11, 10,
  'oracle', 'Oracle', '90'              , 12, 10,
  'uml', 'UML', '90'                      , 13, 10,

  'mysql', 'MySQL', '90'               , 4, 11,
  'merise', 'MERISE', '90'                , 5, 11,
  'python', 'Python', '90'               , 6, 11,
  'pyTorch', 'PyTorch', '70'              , 7, 11,
  'numpy', 'NumPy', '90'                 , 8, 11,
  'scikitLearn', 'ScikitLearn', '54'     , 9, 11,
  'tensorFlow', 'TensorFlow', '69'    , 10, 11,
  'keras', 'Keras', '59'                  , 11, 11,
  'R', 'R', '13'                        , 12, 11,
  'openCV', 'openCV', '80'                 , 13, 11,
  'caffe', 'Caffe', '80'                , 14, 11,
  
  'torch', 'Torch', '25'                   , 1, 7,
  'cntk', 'Cntk', '7'                     , 2, 7,
  'spark', 'Spark', '8'                   , 3, 7,
  'weka', 'Weka', '6'                     , 4, 7,
  'sparkMllib', 'SparkMllib', '7'         , 5, 7,
  'mlPack', 'MLPack', '13'             , 1, 8,
  'Jax', 'Jax', '18'                    , 2, 8,
  'paddlepaddle', 'Paddle-Paddle', '11', 3, 8,
  'ajax', 'AJAX', '90'                     , 4, 8,
  'Tailwind', 'Tailwind', '90'             , 1, 9,
  'bootstrap', 'Bootstrap', '90'           , 2, 9,
  'css', 'CSS', '90'                       , 3, 9,
  'html', 'HTML', '90'                     , 1, 10,
  'swift', 'Swift', '5'                   , 2, 10,
  'Cordova', 'Cordova', '40'               , 1, 11,
  
  'ionic', 'ionic', '50'                   , 13, 7,
  'xamarin', 'Xamarin', '30'               , 14, 7,
  'flutter', 'Flutter', '90'               , 15, 7,
  'reactNative', 'React-Native', '90'      , 16, 7,
  'android', 'Android', '90'               , 17, 7,
  'kotlin', 'Kotlin', '90'                 , 14, 8,
  'java', 'Java', '90'                     , 15, 8,
  'laravel', 'Laravel', '90'               , 16, 8,
  'mvc', 'MVC', '90'                       , 17, 8,
  'php', 'PHP', '90'                       , 15, 9,
  'dotnet', '.net', '90'                   , 16, 9,
  'Csharp', 'C#', '90'                     , 17, 9,
  'cpp', 'C++', '90'                       , 16, 10,
  'c', 'c', '90'                           , 17, 10,
  'react', 'ReactJS', '90'                  , 17, 11,

  'theano', 'Theano', '10'                 , 19, 5,
  'threejs', 'ThreeJS', '80'               , 18, 6,
  'gsap', 'Gsap', '80'                     , 19, 6,
  'jquery', 'Jquery', '90'                 , 20, 6,
  'javascript', 'JavaScript', '90'         , 19, 7
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
    details.className = 'animated-progress';
    details.innerHTML = table[ i + 1 ]+"<span></span>";
    details.lastChild.style.width = table[ i + 2 ]+"%";
    if(table[i + 2] > 60)
      details.lastChild.style.backgroundColor = "#0f0";
    else if(table[i + 2] > 40 && table[i + 2] <= 60)
      details.lastChild.style.backgroundColor = "#00f";
    else
      details.lastChild.style.backgroundColor = "#f00";
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

