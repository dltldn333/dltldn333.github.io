// three-model.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

let mixer;
let action;
let isHovered = false;

document.addEventListener('DOMContentLoaded', () => {
  console.log('[three-model] 실행됨');

  const container = document.getElementById('three-container');
  if (!container) {
    console.warn('#three-container 요소가 없음!');
    return;
  }

  // 기본 세팅
  const scene = new THREE.Scene();
  scene.background = null; // 밝은 배경

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 2.5;
  camera.position.y = 1;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 조명 추가
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(3, 5, 2);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  // 그림자 받는 바닥
  const floorGeo = new THREE.PlaneGeometry(20, 20);
  const floorMat = new THREE.ShadowMaterial({ opacity: 0.2 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.5;
  floor.receiveShadow = true;
  scene.add(floor);

  // 애니메이션 관련
  let mixer;
  const clock = new THREE.Clock();

  // GLB 모델 불러오기
  const loader = new GLTFLoader();
  loader.load('/assets/models/Excited_Walk.glb', (gltf) => {
    const model = gltf.scene;

    model.rotation.y = Math.PI * 1.7;
    model.position.y = -0.5;
    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;

        if (child.material.isMeshStandardMaterial) {
          child.material.metalness = 0.2;
          child.material.roughness = 0.4;
          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveIntensity = 0.6;
        }
      }
    });

    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      action = mixer.clipAction(gltf.animations[0]);
      action.play(); // 기본 실행
      action.paused = true; // 일단 정지된 상태에서 시작
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    if (mixer && !action.paused) {
      mixer.update(clock.getDelta());
    }
    renderer.render(scene, camera);
  }

  animate();

  const hoverTarget = document.querySelector('.cover-thumbnail');
  if (hoverTarget) {
    hoverTarget.addEventListener('mouseenter', () => {
      if (action) {
        action.reset(); // 프레임 0으로
        action.play(); // 실행 준비
        action.paused = false; // 재생 시작
      }
    });

    hoverTarget.addEventListener('mouseleave', () => {
      if (action) {
        action.stop(); // 완전히 멈춤
        action.reset(); // 처음으로 되돌림
      }
    });
  }

  // 리사이즈 대응
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
