"use client"
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import GlbModle from '../models/gltf/LittlestTokyo.glb'
// 定义 Draco 解码器路径常量
const DRACO_DECODER_PATH = "/jsm/libs/draco/gltf/";
const ThreeExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mixer: THREE.AnimationMixer;
    const clock = new THREE.Clock();

    const container = containerRef.current!;
    const stats = Stats();
    container.appendChild(stats.dom);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffff01);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(5, 2, 20);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(GlbModle, (gltf) => {
      const model = gltf.scene;
      model.position.set(1, 1, 0);
      model.scale.set(0.01, 0.01, 0.01);
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();

      renderer.setAnimationLoop(animate);
    });

    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
      const delta = clock.getDelta();
      mixer.update(delta);
      controls.update();
      stats.update();
      renderer.render(scene, camera);
    }

    return () => {
      window.removeEventListener('resize', onWindowResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div className='w-full h-full' ref={containerRef} />;
};

export default ThreeExample;
