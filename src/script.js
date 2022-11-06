import "./style.css";
import "./menu.js";


import * as THREE from 'three';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const table = [
  'docker', 'Docker', '1.00794'     , 1, 1,
  'windows', 'Windows', '4.002602'  , 2, 1,
  'linux', 'Linux', '6.941'         , 3, 1,
  'github', 'Git-Hub', '9.012182'   , 4, 1,
  'git', 'Git', '10.811'            , 5, 1,

  'vs', 'Visual-Studio', '12.0107'     , 1, 2,

  'pyCharm', 'PyCharm', '14.0067'      , 1, 3,
  'eclipse', 'Eclipse', '15.9994'      , 2, 3,
  'angular', 'Angular', '18.9984032'   , 3, 3,
  'vuejs', 'VueJS', '20.1797'          , 4, 3,
  'aspdotnet', 'ASP.net', '22.98976...', 5, 3,

  'jee', 'JEE', '24.305', 1, 4,

  'flask', 'Flask', '26.9815386'        , 1, 5,
  'django', 'Django', '28.0855'         , 2, 5,
  'symfony', 'Symfony', '30.973762'     , 3, 5,
  'spring', 'Spring', '32.065'          , 4, 5,
  'matlab', 'MatLab', '35.453'          , 5, 5,

  'labview', 'LabView', '39.948'            , 7, 1,
  'simulink', 'SimuLink', '39.948'          , 7, 2,
  'arduino', 'Arduino', '40.078'            , 7, 3,
  'hibernate', 'HiberNate', '44.955912'     , 7, 4,
  'phonegap', 'Phone-Gap', '47.867'         , 7, 5,

  'nativescript', 'Native-Script', '50.9415', 8, 2,

  'firebase', 'FireBase', '51.9961'         , 9, 3,

  'adria', 'Adria', '54.938045'             , 10, 4,

  'xml', 'XML', '55.845'                    , 11, 1,
  'pascal', 'Pascal', '58.933195'           , 11, 2,
  'scala', 'Scala', '58.6934'               , 11, 3,
  'mongoDB', 'MongoDB', '63.546'            , 11, 4,
  'mariaDB', 'MariaDB', '65.38'             , 11, 5,

  'mockaroo', 'Mockaroo', '69.723'          , 13, 1,
  'stackOverflow', 'Stack-OverFlow', '72.63', 14, 1,
  'wordpress', 'WordPress', '74.9216'       , 15, 1,
  'xampp', 'XAMPP', '78.96'                 , 16, 1,
  'workbench', 'WorkBench', '79.904'        , 17, 1,

  'canva', 'Canva', '83.798', 13, 2,

  'ai', 'AI', '85.4678'                   , 13, 3,
  'pandas', 'Pandas', '87.62'             , 14, 3,
  'plotly', 'Plotly', '88.90585'          , 15, 3, 
  'seaborn', 'SeaBorn', '91.224'          , 16, 3,
  'matplotlib', 'MatPlotLib', '92.90628'  , 17, 3,

  'mircosoftCognitiveToolKit', 'Mircosoft CTK', '95.96', 17, 4,

  'mxnet', 'MXnet', '(98)'            , 13, 5,
  'scipy', 'Scipy', '101.07'          , 14, 5,
  'tflearn', 'TFlearn', '102.9055'    , 15, 5,
  'ONNX', 'ONNX', '106.42'            , 16, 5,
  'perl', 'Perl', '107.8682'          , 17, 5,

  'wolfram', 'Wolfram', '112.411'             , 9, 6,

  'openNN', 'openNN', '114.818'               , 8, 7,
  'autoML', 'auto-ML', '118.71'               , 9, 7,
  'beautifulsoup', 'Beautiful-Soup', '121.76' , 10, 7,

  'scrapy', 'ScraPy', '127.6'                 , 7, 8,
  'pyCaret', 'PyCaret', '126.90447'           , 8, 8,
  'h2o', 'H2O', '131.293'                     , 9, 8,
  'tibco', 'Tibco', '132.9054'                , 10, 8,
  'rapidminer', 'Rapid-Miner', '132.9054'     , 11, 8,

  'sas', 'SAS', '138.90547'                   , 6, 9,
  'datarobot', 'Data-Robot', '140.116'        , 7, 9,
  'knime', 'Knime', '140.90765'               , 8, 9,
  'bottle', 'Bottle', '144.242'               , 9, 9,
  'cherrypy', 'CherryPy', '(145)'             , 10, 9,
  'dash', 'Dash', '150.36'                    , 11, 9,
  'tornado', 'Tornado', '151.964'             , 12, 9,

  'fastAPI', 'Fast-API', '157.25'             , 5, 10,
  'd3', 'D3', '158.92535'                     , 6, 10,
  'animejs', 'ANIMEjs', '162.5'               , 7, 10,
  'backbonejs', 'BACKBONEjs', '164.93032'     , 8, 10,
  'nodejs', 'NODEjs', '167.259'               , 9, 10,
  'nextjs', 'NEXTjs', '168.93421'             , 10, 10,
  'solidity', 'Solidity', '173.054'           , 11, 10,
  'oracle', 'Oracle', '174.9668'              , 12, 10,
  'uml', 'UML', '178.49'                      , 13, 10,

  'mysql', 'MySQL', '180.94788'               , 4, 11,
  'merise', 'MERISE', '183.84'                , 5, 11,
  'python', 'Python', '186.207'               , 6, 11,
  'pyTorch', 'PyTorch', '190.23'              , 7, 11,
  'numpy', 'NumPy', '192.217'                 , 8, 11,
  'scikitLearn', 'ScikitLearn', '195.084'     , 9, 11,
  'tensorFlow', 'TensorFlow', '196.966569'    , 10, 11,
  'keras', 'Keras', '200.59'                  , 11, 11,
  'R', 'R', '204.3833'                        , 12, 11,
  'openCV', 'openCV', '207.2'                 , 13, 11,
  'caffe', 'Caffe', '208.9804'                , 14, 11,
  
  'torch', 'Torch', '(210)'                   , 1, 7,
  'cntk', 'Cntk', '(222)'                     , 2, 7,
  'spark', 'Spark', '(223)'                   , 3, 7,
  'weka', 'Weka', '(226)'                     , 4, 7,
  'sparkMllib', 'SparkMllib', '(227)'         , 5, 7,
  'mlPack', 'MLPack', '232.03806'             , 1, 8,
  'Jax', 'Jax', '231.0588'                    , 2, 8,
  'paddlepaddle', 'Paddle-Paddle', '238.02891', 3, 8,
  'ajax', 'AJAX', '(237)'                     , 4, 8,
  'Tailwind', 'Tailwind', '(244)'             , 1, 9,
  'bootstrap', 'Bootstrap', '(243)'           , 2, 9,
  'css', 'CSS', '(247)'                       , 3, 9,
  'html', 'HTML', '(247)'                     , 1, 10,
  'swift', 'Swift', '(251)'                   , 2, 10,
  'Cordova', 'Cordova', '(252)'               , 1, 11,
  
  'ionic', 'ionic', '(257)'                   , 13, 7,
  'xamarin', 'Xamarin', '(258)'               , 14, 7,
  'flutter', 'Flutter', '(259)'               , 15, 7,
  'reactNative', 'React-Native', '(262)'      , 16, 7,
  'android', 'Android', '(267)'               , 17, 7,
  'kotlin', 'Kotlin', '(268)'                 , 14, 8,
  'java', 'Java', '(271)'                     , 15, 8,
  'laravel', 'Laravel', '(272)'               , 16, 8,
  'mvc', 'MVC', '(270)'                       , 17, 8,
  'php', 'PHP', '(276)'                       , 15, 9,
  'dotnet', '.net', '(281)'                   , 16, 9,
  'Csharp', 'C#', '(280)'                     , 17, 9,
  'cpp', 'C++', '(285)'                       , 16, 10,
  'c', 'c', '(286)'                           , 17, 10,
  'react', 'ReactJS', '(289)'                  , 17, 11,

  'theano', 'Theano', '(209)'                 , 19, 5,
  'threejs', 'ThreeJS', '(290)'               , 18, 6,
  'gsap', 'Gsap', '(293)'                     , 19, 6,
  'jquery', 'Jquery', '(294)'                 , 20, 6,
  'javascript', 'JavaScript', '(294)'         , 19, 7
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
