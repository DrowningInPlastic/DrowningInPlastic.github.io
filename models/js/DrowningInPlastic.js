// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let rain;
let rainGeo;

//add material name here first
let newMaterial, Standard, newStandard, pointsMaterial;

let SkyboxTexture, SkyboxMaterial, refractorySkybox;


const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
//scene.background = new THREE.Color( 0x8FBCD4 );
  createSkybox();
  createCamera();
  createControls();
  createLights();
  createMaterials();
  loadModels();
  createRenderer();
  createRain();

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createSkybox(){

SkyboxTexture = new THREE.CubeTextureLoader()
  					.setPath( 'textures/forest-skyboxes/Brudslojan/' )
  					.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
//SkyboxTexture.encoding = THREE.sRGBEncoding;
SkyboxTexture.mapping = THREE.CubeRefractionMapping;
//other mappings to try:
/*
THREE.UVMapping
THREE.CubeReflectionMapping
THREE.CubeRefractionMapping
THREE.EquirectangularReflectionMapping
THREE.EquirectangularRefractionMapping
THREE.CubeUVReflectionMapping
THREE.CubeUVRefractionMapping
*/


scene.background = SkyboxTexture;

}




function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 10000 );
  camera.position.set( 505, 304, 405);

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}


function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );

  const directionalLight = new THREE.DirectionalLight( 0xffffff );
				directionalLight.position.set( 1, - 0.5, - 1 );
				scene.add( directionalLight );


  scene.add( ambientLight, mainLight, directionalLight );

}

function createMaterials(){

     let diffuseColor = "#9E4300";
     newMaterial = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );

     Standard = new THREE.MeshStandardMaterial( { color: "#9E4300", skinning: true} );

     const loadTexture = new THREE.TextureLoader();
     const texture = loadTexture.load("textures/Material_baseColor.jpeg", function(texture) {

     });
    // mesh = new THREE.Mesh(Position2, SkyboxMa);
  //   mesh.rotation.x = - Math.PI / 2.2;
  //   mesh.rotation.y = 0;
     //mesh.recieveShadow = true;
     //mesh.castShadow = true;
    // scene.add( mesh );
     // set the "color space" of the texture
       texture.encoding = THREE.sRGBEncoding;
       texture.repeat.set(1,1);
       // reduce blurring at glancing angles
       texture.anisotropy = 16;

     const imgTexture = new THREE.TextureLoader().load( "textures/Material_baseColor.jpeg" );
     				imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
     				imgTexture.anisotropy = 16;


   SkyboxMaterial = new THREE.MeshBasicMaterial( {
     color: 0xffffff,
     opacity: 0.5,
     transparent: true,
      envMap: scene.background
    } );


   newStandard = new THREE.MeshPhongMaterial( {
										map: texture,
										bumpMap: texture,
										//bumpScale: 1,
										//color: diffuseColor,
										//metalness: 0.5,
									//	roughness: 0.1,
										envMap: SkyboxTexture,
                    //displacementMap: imgTexture,
                    //displacementScale: 1,
                    refractionRatio: 0.,
                    reflectivity: 0.6,
                    specular: 0x222222,
					          //shininess: 100,
                    skinning: true
									} );



   refractorySkybox = new THREE.MeshPhongMaterial( {
										//map: imgTexture,
										//bumpMap: imgTexture,
										//bumpScale: 1,
										//color: diffuseColor,
										//metalness: 0.5,
										//roughness: 0.1,
										envMap: SkyboxTexture,
                    //displacementMap: imgTexture,
                    //displacementScale: 1,
                    refractionRatio: 0.98,
                    reflectivity: 0.9,
                    //specular: 0x222222,
					          //shininess: 100,
                    skinning: true
									} );

    pointsMaterial = new THREE.PointsMaterial( {//for rain
      color: diffuseColor,
      sizeAttenuation: true,
      size: 0.1
    } );



}


function loadModels() {

  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  //function onLoad() {}

  const onLoad = ( gltf, position, material) => {

    //const model = gltf.scene.children[ 0 ];
    //model.position.copy( position );

  /* const animation = gltf.animations[ 0 ];

    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    const action = mixer.clipAction( animation );
    action.play();
    */
    //var newMesh = new THREE.MESH()

    let object = gltf.scene;
    //stand in material for now
    //var material = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );

    object.traverse((child) => {
                       if (child.isMesh) {
                      child.material = material;
                      child.position.copy( position );
                  }
                 });
                   scene.add(object);

    //scene.add(object );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const Position2 = new THREE.Vector3( -40,0,0 );
  loader.load( 'models/corn_field_lowres/scene.gltf', gltf => onLoad( gltf, Position2, newStandard), onProgress, onError );

  const Position3 = new THREE.Vector3( -4.6,3.7,6 );
  loader.load( 'models/newbottle.glb', gltf => onLoad( gltf, Position3, SkyboxMaterial), onProgress, onError );

  const Position4 = new THREE.Vector3( .3,0,-2 );
  loader.load( 'models/deerskulls.glb', gltf => onLoad( gltf, Position4, refractorySkybox), onProgress, onError );
  //const storkPosition = new THREE.Vector3( 0, -2.5, -10 );
  //loader.load( 'models/Stork.glb', gltf => onLoad( gltf, storkPosition ), onProgress, onError );

}

function createRain(){

  rainGeo = new THREE.Geometry();
  for(let i=0;i<6000;i++) {
    rain = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    rain.velocity = 0;
    rain.acceleration = 0.02;
    rainGeo.vertices.push(rain);
  }

  let sprite = new THREE.TextureLoader().load( 'textures/rain.png' );
  let rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: sprite
  });

  rain = new THREE.Points(rainGeo,rainMaterial);
  scene.add(rain);
  animate();
}

function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;



  container.appendChild( renderer.domElement );

}

function update() {

  const delta = clock.getDelta();

  // /*for ( const mixer of mixers ) {
  //
  //   mixer.update( delta );
  // }
  // */

}

function render() {


  renderer.render( scene, camera );

}

function animate() {

  rainGeo.vertices.forEach(p => {
    p.velocity += p.acceleration
    p.y -= p.velocity;

    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });
  rainGeo.verticesNeedUpdate = true;
  rain.rotation.y +=0.002;


  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
