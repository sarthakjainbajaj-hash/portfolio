import * as THREE from "three";
import { sound } from "../Game/soundEngine";
import { INTERACTABLES } from "../Game/gameData";

// Expanded 3D Citadel World Configuration
export const WORLD_3D = {
  size: 260,
  spawn: { x: 0, y: 0, z: 8 },
  landmarks: {
    citadel: { x: 0, z: -10, label: "Citadel Keep", icon: "🏰", id: "sarthak_avatar" },
    experience: { x: -88, z: -15, label: "War Council", icon: "⚔️", id: "bluestock_master" },
    projects: { x: 0, z: -88, label: "Arcane Forge", icon: "🔮", id: "proj_solvesphere" },
    skills: { x: 88, z: -15, label: "Skills Lair", icon: "💎", id: "skill_altar" },
    education: { x: -75, z: 75, label: "Grand Archive", icon: "📚", id: "archive_tome" },
    contact: { x: 75, z: 75, label: "Raven Eyrie", icon: "🦅", id: "raven_eyrie" },
  },
};

// 26 Diverse Roaming Enemies across 4 Archetypes
export const INITIAL_MONSTERS = [
  // 2 Elite Guardians guarding the Skills Altar (East wing: x: 88, z: -15)
  { id: "guardian_bug", name: "Altar Bug Fiend", maxHp: 90, hp: 90, speed: 8.0, attackPower: 10, x: 82, y: 0, z: -18, type: "bug", isGuardian: true },
  { id: "guardian_drake", name: "Altar Glitch Drake", maxHp: 110, hp: 110, speed: 9.0, attackPower: 14, x: 94, y: 1.5, z: -10, type: "drake", isGuardian: true },

  // 6 Frost Wights in the snowy North (z: -45 to -115)
  { id: "wight_1", name: "Frost Wight Stalker", maxHp: 50, hp: 50, speed: 9.5, attackPower: 8, x: -35, y: 0, z: -60, type: "wight" },
  { id: "wight_2", name: "Frost Wight Hunter", maxHp: 55, hp: 55, speed: 9.0, attackPower: 8, x: 35, y: 0, z: -65, type: "wight" },
  { id: "wight_3", name: "Ice Walker", maxHp: 65, hp: 65, speed: 8.5, attackPower: 10, x: -15, y: 0, z: -105, type: "wight" },
  { id: "wight_4", name: "Glacial Revenant", maxHp: 70, hp: 70, speed: 8.0, attackPower: 12, x: 20, y: 0, z: -110, type: "wight" },
  { id: "wight_5", name: "Frost Wight Scout", maxHp: 45, hp: 45, speed: 10.0, attackPower: 7, x: -55, y: 0, z: -85, type: "wight" },
  { id: "wight_6", name: "Northern Wight", maxHp: 50, hp: 50, speed: 9.2, attackPower: 8, x: 55, y: 0, z: -85, type: "wight" },

  // 6 Bug Fiends in the Western Wilderness (x: -40 to -115, z: -40 to 40)
  { id: "bug_1", name: "Syntax Bug", maxHp: 45, hp: 45, speed: 8.0, attackPower: 6, x: -65, y: 0, z: -35, type: "bug" },
  { id: "bug_2", name: "Memory Leak Bug", maxHp: 60, hp: 60, speed: 7.5, attackPower: 9, x: -105, y: 0, z: -10, type: "bug" },
  { id: "bug_3", name: "NullPointer Fiend", maxHp: 50, hp: 50, speed: 8.5, attackPower: 7, x: -80, y: 0, z: 25, type: "bug" },
  { id: "bug_4", name: "Deadlock Crawler", maxHp: 65, hp: 65, speed: 7.0, attackPower: 10, x: -110, y: 0, z: 35, type: "bug" },
  { id: "bug_5", name: "Race Condition Bug", maxHp: 40, hp: 40, speed: 10.5, attackPower: 6, x: -45, y: 0, z: -5, type: "bug" },
  { id: "bug_6", name: "Stack Overflow Fiend", maxHp: 75, hp: 75, speed: 7.2, attackPower: 11, x: -95, y: 0, z: -40, type: "bug" },

  // 6 Glitch Drakes flying above Eastern Peaks (x: 40 to 115, z: -60 to 45)
  { id: "drake_1", name: "Glitch Wyvern", maxHp: 70, hp: 70, speed: 9.0, attackPower: 10, x: 60, y: 1.5, z: -45, type: "drake" },
  { id: "drake_2", name: "Fire Sprite Drake", maxHp: 65, hp: 65, speed: 9.5, attackPower: 9, x: 105, y: 1.5, z: -35, type: "drake" },
  { id: "drake_3", name: "Cinder Drake", maxHp: 80, hp: 80, speed: 8.5, attackPower: 12, x: 70, y: 1.5, z: 15, type: "drake" },
  { id: "drake_4", name: "Crimson Wyrm", maxHp: 85, hp: 85, speed: 8.8, attackPower: 13, x: 110, y: 1.5, z: 25, type: "drake" },
  { id: "drake_5", name: "Volt Wyvern", maxHp: 60, hp: 60, speed: 10.0, attackPower: 8, x: 45, y: 1.5, z: 35, type: "drake" },
  { id: "drake_6", name: "Ash Dragon", maxHp: 95, hp: 95, speed: 8.0, attackPower: 14, x: 95, y: 1.5, z: -60, type: "drake" },

  // 6 Shadow Wraiths in the Southern Ancient Ruins (z: 40 to 115)
  { id: "wraith_1", name: "Void Phantom", maxHp: 55, hp: 55, speed: 8.5, attackPower: 9, x: -40, y: 1.2, z: 65, type: "wraith" },
  { id: "wraith_2", name: "Shadow Sorcerer", maxHp: 60, hp: 60, speed: 8.0, attackPower: 11, x: 40, y: 1.2, z: 65, type: "wraith" },
  { id: "wraith_3", name: "Nether Shade", maxHp: 50, hp: 50, speed: 9.0, attackPower: 8, x: 0, y: 1.2, z: 95, type: "wraith" },
  { id: "wraith_4", name: "Crypt Spectre", maxHp: 65, hp: 65, speed: 8.2, attackPower: 10, x: -65, y: 1.2, z: 105, type: "wraith" },
  { id: "wraith_5", name: "Abyssal Horror", maxHp: 80, hp: 80, speed: 7.5, attackPower: 13, x: 65, y: 1.2, z: 105, type: "wraith" },
  { id: "wraith_6", name: "Eclipse Banshee", maxHp: 55, hp: 55, speed: 9.5, attackPower: 9, x: 15, y: 1.2, z: 75, type: "wraith" },
];

export class ThreeGameEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.houseTheme = options.houseTheme || "stark";
    this.onInteract = options.onInteract || (() => {});
    this.onMonsterKill = options.onMonsterKill || (() => {});
    this.onSkillsUnlocked = options.onSkillsUnlocked || (() => {});
    this.onPlayerMove = options.onPlayerMove || (() => {});
    this.onRadarUpdate = options.onRadarUpdate || null;
    this.onPromptChange = options.onPromptChange || null;
    this.onHpChange = options.onHpChange || null;
    this.onLockedNotice = options.onLockedNotice || null;
    this.prevActiveInteractable = null;
    this.prevPlayerHp = 100;
    this.miniMapTimer = 0;

    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    // Core Three.js Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d19);
    this.scene.fog = new THREE.FogExp2(0x090d19, 0.007);

    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 450);
    this.camera.position.set(0, 14, 24);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Camera follow offset & rotation
    this.cameraOffset = new THREE.Vector3(0, 8, 15);
    this.cameraYaw = 0;
    this.isDragging = false;
    this.prevMouseX = 0;

    // Player Soldier State
    this.player = {
      x: WORLD_3D.spawn.x,
      y: 0,
      z: WORLD_3D.spawn.z,
      rotY: Math.PI,
      speed: 13,
      runSpeed: 20,
      hp: 100,
      maxHp: 100,
      isMoving: false,
      isAttacking: false,
      isSpinAttacking: false,
      attackTimer: 0,
      attackCooldown: 0,
      spinTimer: 0,
      hitFlash: 0,
      stepCycle: 0,
    };

    // Deep clone monster roster with runtime properties
    this.monsters = INITIAL_MONSTERS.map((m) => ({
      ...m,
      rotY: Math.random() * Math.PI * 2,
      isDead: false,
      hitFlash: 0,
      attackCooldown: Math.random() * 1.5,
      wanderTimer: Math.random() * 3,
      wanderAngle: Math.random() * Math.PI * 2,
      originX: m.x,
      originZ: m.z,
    }));

    this.skillsUnlocked = false;
    this.keys = {};
    this.clock = new THREE.Clock();
    this.particles = [];
    this.floatingTexts = [];
    this.activeInteractable = null;

    // Bindings
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.loop = this.loop.bind(this);

    this.buildWorld();
    this.buildSoldier();
    this.buildMonsters();
    this.initEvents();

    this.isRunning = true;
    this.animId = requestAnimationFrame(this.loop);
  }

  initEvents() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.container.addEventListener("pointerdown", this.handlePointerDown);
    window.addEventListener("pointermove", this.handlePointerMove);
    window.addEventListener("pointerup", this.handlePointerUp);
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    this.container.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerup", this.handlePointerUp);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }

  handleResize() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  handleKeyDown(e) {
    const k = e.key.toLowerCase();
    this.keys[k] = true;

    // Standard Attack: Space, J, F
    if (e.key === " " || k === "j" || k === "f") {
      this.attack();
    }

    // Special Whirlwind Spin Attack: Q, K
    if (k === "q" || k === "k") {
      this.spinAttack();
    }

    // Interact: E or Enter
    if (k === "e" || e.key === "Enter") {
      this.triggerInteraction();
    }
  }

  handleKeyUp(e) {
    this.keys[e.key.toLowerCase()] = false;
  }

  handlePointerDown(e) {
    if (e.button === 0) {
      this.isDragging = true;
      this.prevMouseX = e.clientX;
    } else if (e.button === 2) {
      // Right-click performs spin attack
      this.spinAttack();
    }
  }

  handlePointerMove(e) {
    if (this.isDragging) {
      const deltaX = e.clientX - this.prevMouseX;
      this.prevMouseX = e.clientX;
      this.cameraYaw -= deltaX * 0.006;
    }
  }

  handlePointerUp() {
    this.isDragging = false;
  }

  setJoystickInput(dx, dy) {
    this.joystickInput = { dx, dy };
  }

  // 1. BUILD EXPANDED 3D WORLD ENVIRONMENT (260x260)
  buildWorld() {
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    sunLight.position.set(70, 90, 70);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 280;
    const d = 140;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.scene.add(sunLight);

    // Rim light for atmospheric edge highlights
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rimLight.position.set(-70, 50, -70);
    this.scene.add(rimLight);

    // Large Stone Tiled Ground (260x260)
    const floorGeo = new THREE.PlaneGeometry(WORLD_3D.size, WORLD_3D.size, 48, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111928,
      roughness: 0.88,
      metalness: 0.12,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Cobblestone Highway Roads connecting Citadel to each Landmark
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 });
    
    // North Road to Projects
    const roadN = new THREE.Mesh(new THREE.PlaneGeometry(6, 90), roadMat);
    roadN.rotation.x = -Math.PI / 2;
    roadN.position.set(0, 0.05, -50);
    roadN.receiveShadow = true;
    this.scene.add(roadN);

    // South Road to Grand Gates
    const roadS = new THREE.Mesh(new THREE.PlaneGeometry(6, 90), roadMat);
    roadS.rotation.x = -Math.PI / 2;
    roadS.position.set(0, 0.05, 45);
    roadS.receiveShadow = true;
    this.scene.add(roadS);

    // West Road to War Council
    const roadW = new THREE.Mesh(new THREE.PlaneGeometry(90, 6), roadMat);
    roadW.rotation.x = -Math.PI / 2;
    roadW.position.set(-45, 0.05, -12);
    roadW.receiveShadow = true;
    this.scene.add(roadW);

    // East Road to Skills Lair
    const roadE = new THREE.Mesh(new THREE.PlaneGeometry(90, 6), roadMat);
    roadE.rotation.x = -Math.PI / 2;
    roadE.position.set(45, 0.05, -12);
    roadE.receiveShadow = true;
    this.scene.add(roadE);

    // Center Courtyard Circular Dais
    const daisGeo = new THREE.CylinderGeometry(20, 21, 0.4, 32);
    const daisMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.25 });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.set(0, 0.2, -5);
    dais.receiveShadow = true;
    this.scene.add(dais);

    // Outer Fortress Castle Walls at Boundary (±130)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a2333, roughness: 0.9 });
    const halfSize = WORLD_3D.size / 2;
    const wallGeoH = new THREE.BoxGeometry(WORLD_3D.size, 10, 5);
    const wallGeoV = new THREE.BoxGeometry(5, 10, WORLD_3D.size);

    const wallNorth = new THREE.Mesh(wallGeoH, wallMat);
    wallNorth.position.set(0, 5, -halfSize);
    wallNorth.castShadow = true;
    this.scene.add(wallNorth);

    const wallSouth = new THREE.Mesh(wallGeoH, wallMat);
    wallSouth.position.set(0, 5, halfSize);
    wallSouth.castShadow = true;
    this.scene.add(wallSouth);

    const wallWest = new THREE.Mesh(wallGeoV, wallMat);
    wallWest.position.set(-halfSize, 5, 0);
    wallWest.castShadow = true;
    this.scene.add(wallWest);

    const wallEast = new THREE.Mesh(wallGeoV, wallMat);
    wallEast.position.set(halfSize, 5, 0);
    wallEast.castShadow = true;
    this.scene.add(wallEast);

    // 4 Corner Great Watchtowers with Beacon Fires
    const cornerPositions = [
      { x: -halfSize + 4, z: -halfSize + 4 },
      { x: halfSize - 4, z: -halfSize + 4 },
      { x: -halfSize + 4, z: halfSize - 4 },
      { x: halfSize - 4, z: halfSize - 4 },
    ];

    this.brazierLights = [];

    cornerPositions.forEach((pos) => {
      const towerGeo = new THREE.CylinderGeometry(4.5, 5.5, 20, 16);
      const tower = new THREE.Mesh(towerGeo, wallMat);
      tower.position.set(pos.x, 10, pos.z);
      tower.castShadow = true;
      tower.receiveShadow = true;
      this.scene.add(tower);

      // Beacon Fire Top
      const bBowl = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 1.2, 1.5, 12), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      bBowl.position.set(pos.x, 20.5, pos.z);
      this.scene.add(bBowl);

      const bLight = new THREE.PointLight(0xf59e0b, 2.5, 45);
      bLight.position.set(pos.x, 22, pos.z);
      this.scene.add(bLight);
      this.brazierLights.push(bLight);
    });

    // 16 Flaming Pillars along the Great Roads
    const pillarPositions = [
      { x: -16, z: -16 }, { x: 16, z: -16 }, { x: -16, z: 16 }, { x: 16, z: 16 },
      { x: -45, z: -20 }, { x: -45, z: -4 }, { x: -75, z: -20 }, { x: -75, z: -4 },
      { x: 45, z: -20 }, { x: 45, z: -4 }, { x: 75, z: -20 }, { x: 75, z: -4 },
      { x: -6, z: -45 }, { x: 6, z: -45 }, { x: -6, z: -75 }, { x: 6, z: -75 },
    ];

    pillarPositions.forEach((pos) => {
      const pillarGeo = new THREE.CylinderGeometry(1.2, 1.5, 7, 12);
      const pillar = new THREE.Mesh(pillarGeo, wallMat);
      pillar.position.set(pos.x, 3.5, pos.z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.scene.add(pillar);

      // Fire Bowl
      const bowlGeo = new THREE.CylinderGeometry(1.6, 0.8, 1, 12);
      const bowlMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6, roughness: 0.4 });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.position.set(pos.x, 7.2, pos.z);
      this.scene.add(bowl);

      // Fire Point Light
      const pLight = new THREE.PointLight(0xf59e0b, 2.0, 24);
      pLight.position.set(pos.x, 8.5, pos.z);
      this.scene.add(pLight);
      this.brazierLights.push(pLight);
    });

    // 36 Procedural 3D Pine & Winter Trees across the Wilderness
    const treePositions = [
      // North-West Woods
      { x: -30, z: -40 }, { x: -50, z: -55 }, { x: -70, z: -60 }, { x: -20, z: -75 },
      { x: -60, z: -95 }, { x: -90, z: -70 }, { x: -110, z: -90 }, { x: -40, z: -110 },
      // North-East Woods
      { x: 30, z: -40 }, { x: 50, z: -55 }, { x: 70, z: -60 }, { x: 20, z: -75 },
      { x: 60, z: -95 }, { x: 90, z: -70 }, { x: 110, z: -90 }, { x: 40, z: -110 },
      // South-West Forest
      { x: -35, z: 35 }, { x: -55, z: 50 }, { x: -95, z: 55 }, { x: -25, z: 85 },
      { x: -85, z: 95 }, { x: -105, z: 75 }, { x: -50, z: 105 }, { x: -115, z: 105 },
      // South-East Grove
      { x: 35, z: 35 }, { x: 55, z: 50 }, { x: 95, z: 55 }, { x: 25, z: 85 },
      { x: 85, z: 95 }, { x: 105, z: 75 }, { x: 50, z: 105 }, { x: 115, z: 105 },
      // Outer perimeter outliers
      { x: -110, z: 0 }, { x: 110, z: 0 }, { x: 0, z: -115 }, { x: 0, z: 115 },
    ];

    const trunkGeo = new THREE.CylinderGeometry(0.6, 0.9, 4.5, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.8 });
    const snowFoliageMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.7 });

    treePositions.forEach((pos, idx) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(pos.x, 0, pos.z);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 2.25;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Tiered Cone Foliage
      const isNorthern = pos.z < 0;
      const mat = isNorthern ? snowFoliageMat : foliageMat;

      const cone1 = new THREE.Mesh(new THREE.ConeGeometry(3.5, 5, 8), mat);
      cone1.position.y = 5.5;
      cone1.castShadow = true;
      treeGroup.add(cone1);

      const cone2 = new THREE.Mesh(new THREE.ConeGeometry(2.6, 4.5, 8), mat);
      cone2.position.y = 8.5;
      cone2.castShadow = true;
      treeGroup.add(cone2);

      const cone3 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.5, 8), mat);
      cone3.position.y = 11.2;
      cone3.castShadow = true;
      treeGroup.add(cone3);

      this.scene.add(treeGroup);
    });

    // Build 3D Shrines & Landmark Monuments
    this.buildLandmarkMeshes();
  }

  buildLandmarkMeshes() {
    this.shrineMeshes = [];

    // 1. Citadel Keep (About Sarthak)
    const dais = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 6.2, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5, metalness: 0.4 })
    );
    dais.position.set(0, 0.6, -10);
    this.scene.add(dais);

    // Floating Hologram Core
    const holoCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.8, 0),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, roughness: 0.2, wireframe: true })
    );
    holoCore.position.set(0, 4.0, -10);
    this.scene.add(holoCore);
    this.shrineMeshes.push({ mesh: holoCore, id: "sarthak_avatar", rotSpeed: 0.02 });

    // 2. War Council (Experience) - West wing at (-88, -15)
    const warTable = new THREE.Mesh(
      new THREE.BoxGeometry(8, 1.5, 4.5),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    warTable.position.set(-88, 0.75, -15);
    this.scene.add(warTable);
    const warBanner = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 6, 3),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x92400e })
    );
    warBanner.position.set(-88, 4.5, -15);
    this.scene.add(warBanner);
    this.shrineMeshes.push({ mesh: warBanner, id: "bluestock_master", rotSpeed: 0.01 });

    // 3. Arcane Forge (Featured Projects) - North wing at (0, -88)
    const forgePedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(4.5, 5.2, 1.5, 12),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.5, roughness: 0.5 })
    );
    forgePedestal.position.set(0, 0.75, -88);
    this.scene.add(forgePedestal);

    const forgeCrystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.2, 0),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, wireframe: true })
    );
    forgeCrystal.position.set(0, 4.5, -88);
    this.scene.add(forgeCrystal);
    this.shrineMeshes.push({ mesh: forgeCrystal, id: "proj_solvesphere", rotSpeed: -0.02 });

    // 4. Skills Lair & Altar - East wing at (88, -15) (Guarded by Elite Monsters)
    const altarBase = new THREE.Mesh(
      new THREE.CylinderGeometry(6, 7, 1.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.6, metalness: 0.4 })
    );
    altarBase.position.set(88, 0.7, -15);
    this.scene.add(altarBase);

    // Glowing Skill Relic Crystal
    this.skillCrystal = new THREE.Mesh(
      new THREE.DodecahedronGeometry(2.0, 0),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        roughness: 0.2,
        metalness: 0.5,
      })
    );
    this.skillCrystal.position.set(88, 4.2, -15);
    this.scene.add(this.skillCrystal);
    this.shrineMeshes.push({ mesh: this.skillCrystal, id: "skill_altar", rotSpeed: 0.025 });

    // Mystical Energy Barrier Dome around skills until guardians die
    const domeGeo = new THREE.SphereGeometry(9.0, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    this.shieldDomeMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    this.shieldDome = new THREE.Mesh(domeGeo, this.shieldDomeMat);
    this.shieldDome.position.set(88, 0, -15);
    this.scene.add(this.shieldDome);

    // 5. Grand Archive (Education) - South-West at (-75, 75)
    const archiveShelf = new THREE.Mesh(
      new THREE.BoxGeometry(7, 5, 2),
      new THREE.MeshStandardMaterial({ color: 0x5b21b6, roughness: 0.8 })
    );
    archiveShelf.position.set(-75, 2.5, 75);
    this.scene.add(archiveShelf);
    this.shrineMeshes.push({ mesh: archiveShelf, id: "archive_tome", rotSpeed: 0 });

    // 6. Raven Eyrie (Contact) - South-East at (75, 75)
    const ravenPerch = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 2.0, 6, 8),
      new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.6 })
    );
    ravenPerch.position.set(75, 3.0, 75);
    this.scene.add(ravenPerch);
    this.shrineMeshes.push({ mesh: ravenPerch, id: "raven_eyrie", rotSpeed: 0 });
  }

  // 2. BUILD 3D ARMORED SOLDIER WARRIOR WITH ADVANCED COMBAT ANIMATIONS
  buildSoldier() {
    this.soldierGroup = new THREE.Group();
    this.soldierGroup.position.set(this.player.x, 0, this.player.z);

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Steel plate
      metalness: 0.8,
      roughness: 0.3,
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gold trim
      metalness: 0.7,
      roughness: 0.3,
    });

    // Torso / Cuirass
    const torsoGeo = new THREE.BoxGeometry(1.4, 1.7, 0.9);
    const torso = new THREE.Mesh(torsoGeo, armorMat);
    torso.position.y = 1.75;
    torso.castShadow = true;
    this.soldierGroup.add(torso);

    // Knight Helmet
    const headGeo = new THREE.SphereGeometry(0.55, 12, 12);
    const head = new THREE.Mesh(headGeo, armorMat);
    head.position.y = 2.9;
    head.castShadow = true;
    this.soldierGroup.add(head);

    // Glowing Visor
    const visorGeo = new THREE.BoxGeometry(0.7, 0.14, 0.2);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 2.9, 0.46);
    this.soldierGroup.add(visor);

    // Helmet Crest
    const crestGeo = new THREE.BoxGeometry(0.15, 0.45, 0.9);
    const crest = new THREE.Mesh(crestGeo, goldTrimMat);
    crest.position.set(0, 3.4, 0);
    this.soldierGroup.add(crest);

    // Royal Cape
    const capeGeo = new THREE.PlaneGeometry(1.3, 1.9, 4, 4);
    this.capeMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      side: THREE.DoubleSide,
      roughness: 0.8,
    });
    this.cape = new THREE.Mesh(capeGeo, this.capeMat);
    this.cape.position.set(0, 1.7, -0.52);
    this.soldierGroup.add(this.cape);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.4, 1.2, 0.45);
    this.leftLeg = new THREE.Mesh(legGeo, armorMat);
    this.leftLeg.position.set(-0.38, 0.6, 0);
    this.leftLeg.castShadow = true;
    this.soldierGroup.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, armorMat);
    this.rightLeg.position.set(0.38, 0.6, 0);
    this.rightLeg.castShadow = true;
    this.soldierGroup.add(this.rightLeg);

    // Arms & Weapons
    const armGeo = new THREE.BoxGeometry(0.35, 1.1, 0.35);

    // Left Arm + Shield
    this.leftArm = new THREE.Mesh(armGeo, armorMat);
    this.leftArm.position.set(-1.0, 1.75, 0);
    this.leftArm.castShadow = true;

    const shieldGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.12, 16);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.rotation.z = Math.PI / 2;
    shield.position.set(-0.25, -0.2, 0.2);

    const shieldRim = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.06, 8, 16), goldTrimMat);
    shield.add(shieldRim);
    this.leftArm.add(shield);
    this.soldierGroup.add(this.leftArm);

    // Right Arm + Broadsword
    this.rightArm = new THREE.Mesh(armGeo, armorMat);
    this.rightArm.position.set(1.0, 1.75, 0);
    this.rightArm.castShadow = true;

    const swordBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 2.3, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 })
    );
    swordBlade.position.set(0, -0.8, 0.8);
    swordBlade.rotation.x = Math.PI / 4;

    const swordGuard = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.1, 0.15), goldTrimMat);
    swordGuard.position.set(0, 0.2, 0);
    swordBlade.add(swordGuard);
    this.rightArm.add(swordBlade);
    this.soldierGroup.add(this.rightArm);

    // 3D Curved Light Slash Arc Mesh
    const slashGeo = new THREE.RingGeometry(1.8, 3.2, 16, 1, 0, Math.PI * 0.75);
    this.slashMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.slashMesh = new THREE.Mesh(slashGeo, this.slashMat);
    this.slashMesh.rotation.x = -Math.PI / 2;
    this.slashMesh.position.set(0, 1.4, 1.5);
    this.soldierGroup.add(this.slashMesh);

    // 3D Whirlwind Spin Shockwave Ring (For Special Q Attack)
    const spinGeo = new THREE.RingGeometry(2.0, 8.5, 32);
    this.spinMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.spinMesh = new THREE.Mesh(spinGeo, this.spinMat);
    this.spinMesh.rotation.x = -Math.PI / 2;
    this.spinMesh.position.set(0, 0.3, 0);
    this.soldierGroup.add(this.spinMesh);

    this.scene.add(this.soldierGroup);
  }

  // 3. BUILD 26 3D MONSTERS WITH 4 DISTINCT ARCHETYPES AND 3D HEALTH BARS
  buildMonsters() {
    this.monsterMeshes = [];

    this.monsters.forEach((data) => {
      const group = new THREE.Group();
      group.position.set(data.x, data.y, data.z);

      let mat;
      let wingL = null;
      let wingR = null;
      let legs = [];
      let orbs = [];

      // ARCHETYPE 1: BUG FIEND / CORRUPTED CRAWLER
      if (data.type === "bug") {
        mat = new THREE.MeshStandardMaterial({
          color: data.isGuardian ? 0x991b1b : 0xdc2626,
          roughness: 0.4,
          metalness: 0.5,
        });
        const bugAbdomen = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 8), mat);
        bugAbdomen.position.y = 1.2;
        bugAbdomen.scale.set(1, 0.8, 1.4);
        bugAbdomen.castShadow = true;
        group.add(bugAbdomen);

        // Glowing Eyes
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), eyeMat);
        eyeL.position.set(-0.45, 1.4, 1.3);
        const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), eyeMat);
        eyeR.position.set(0.45, 1.4, 1.3);
        group.add(eyeL);
        group.add(eyeR);

        // 4 Scuttling Legs
        const legMat = new THREE.MeshStandardMaterial({ color: 0x450a0a });
        [-0.8, 0.8].forEach((lx) => {
          [-0.5, 0.5].forEach((lz) => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.0, 0.2), legMat);
            leg.position.set(lx, 0.5, lz);
            group.add(leg);
            legs.push(leg);
          });
        });
      }

      // ARCHETYPE 2: GLITCH DRAKE / FIRE WYVERN
      else if (data.type === "drake") {
        mat = new THREE.MeshStandardMaterial({
          color: data.isGuardian ? 0x581c87 : 0x7c3aed,
          roughness: 0.3,
          metalness: 0.6,
        });
        const drakeBody = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.2, 8), mat);
        drakeBody.rotation.x = Math.PI / 2;
        drakeBody.position.y = 1.6;
        drakeBody.castShadow = true;
        group.add(drakeBody);

        // Long Spiny Tail
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 2.5, 6), mat);
        tail.rotation.x = Math.PI / 3;
        tail.position.set(0, 1.2, -2.4);
        group.add(tail);

        // Glowing Purple/Orange Eyes
        const drakeEyeMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
        const dEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), drakeEyeMat);
        dEyeL.position.set(-0.4, 1.9, 1.2);
        const dEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), drakeEyeMat);
        dEyeR.position.set(0.4, 1.9, 1.2);
        group.add(dEyeL);
        group.add(dEyeR);

        // Flapping Wings
        const wingMat = new THREE.MeshStandardMaterial({
          color: 0x9333ea,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        wingL = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.8), wingMat);
        wingL.position.set(-2, 1.8, 0);
        wingL.rotation.y = Math.PI / 8;
        group.add(wingL);

        wingR = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.8), wingMat);
        wingR.position.set(2, 1.8, 0);
        wingR.rotation.y = -Math.PI / 8;
        group.add(wingR);
      }

      // ARCHETYPE 3: FROST WIGHT / ICE WALKER
      else if (data.type === "wight") {
        mat = new THREE.MeshStandardMaterial({
          color: 0xe0f2fe,
          roughness: 0.6,
          metalness: 0.3,
        });
        const skull = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), mat);
        skull.position.y = 2.4;
        group.add(skull);

        // Glowing Ice Eyes
        const wEyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const wEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), wEyeMat);
        wEyeL.position.set(-0.25, 2.45, 0.55);
        const wEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), wEyeMat);
        wEyeR.position.set(0.25, 2.45, 0.55);
        group.add(wEyeL);
        group.add(wEyeR);

        // Skeletal Ribcage & Spine
        const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.4, 6), mat);
        spine.position.y = 1.4;
        group.add(spine);

        // 2 Bony Legs
        [-0.3, 0.3].forEach((lx) => {
          const wLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.1, 0.25), mat);
          wLeg.position.set(lx, 0.55, 0);
          group.add(wLeg);
          legs.push(wLeg);
        });
      }

      // ARCHETYPE 4: SHADOW WRAITH / VOID PHANTOM
      else if (data.type === "wraith") {
        mat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          roughness: 0.9,
        });
        // Hooded Robe Cone
        const robe = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.6, 8), mat);
        robe.position.y = 1.4;
        group.add(robe);

        // Glowing Crimson/Magenta Core
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
        const voidCore = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), coreMat);
        voidCore.position.set(0, 2.1, 0.2);
        group.add(voidCore);

        // Orbiting Void Orbs
        const orbMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
        for (let o = 0; o < 3; o++) {
          const orb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), orbMat);
          group.add(orb);
          orbs.push(orb);
        }
      }

      // 3D Health Bar Canvas Sprite above monster head
      const hpBgMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
      const hpFillMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
      const hpBg = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.3), hpBgMat);
      hpBg.position.y = data.type === "drake" ? 3.5 : 3.0;
      const hpFill = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.22), hpFillMat);
      hpFill.position.set(0, 0, 0.01);
      hpBg.add(hpFill);
      group.add(hpBg);

      this.scene.add(group);
      this.monsterMeshes.push({
        group,
        data,
        mat,
        wingL,
        wingR,
        legs,
        orbs,
        hpBg,
        hpFill,
      });
    });
  }

  // 4. COMBAT & ATTACKS
  attack() {
    if (this.player.attackCooldown > 0) return;
    this.player.isAttacking = true;
    this.player.attackTimer = 0.2;
    this.player.attackCooldown = 0.25;
    sound.playSlash();

    // Show 3D slash arc
    this.slashMat.opacity = 0.9;
    this.slashMat.color.setHex(0x38bdf8);

    // Hitbox calculation in front of soldier
    const attackReach = 6.0;
    const forwardX = Math.sin(this.player.rotY);
    const forwardZ = Math.cos(this.player.rotY);
    const hitBoxPos = {
      x: this.player.x + forwardX * 3.5,
      z: this.player.z + forwardZ * 3.5,
    };

    this.checkHit(hitBoxPos, attackReach, 25, 4.0);
  }

  // Special 360 Whirlwind Spin Attack (Key Q or K)
  spinAttack() {
    if (this.player.spinTimer > 0) return;
    this.player.isSpinAttacking = true;
    this.player.spinTimer = 0.35;
    this.player.attackCooldown = 0.4;
    sound.playSlash();

    // Show expanding golden whirlwind shockwave ring
    this.spinMat.opacity = 0.85;
    this.spinMesh.scale.set(0.2, 0.2, 0.2);

    // AOE Hit: Hits all enemies within 9.0 radius
    this.checkHit({ x: this.player.x, z: this.player.z }, 9.0, 45, 6.0);
  }

  checkHit(centerPos, reach, baseDamage, knockbackForce) {
    this.monsters.forEach((m) => {
      if (m.isDead) return;
      const dist = Math.hypot(m.x - centerPos.x, m.z - centerPos.z);
      if (dist < reach) {
        const isCrit = Math.random() > 0.6;
        const dmg = isCrit ? Math.round(baseDamage * 1.5) : baseDamage;
        m.hp = Math.max(0, m.hp - dmg);
        m.hitFlash = 0.18;
        sound.playMonsterHit();

        // Knockback physics
        const angle = Math.atan2(m.z - this.player.z, m.x - this.player.x);
        m.x += Math.cos(angle) * knockbackForce;
        m.z += Math.sin(angle) * knockbackForce;

        // Death check
        if (m.hp <= 0) {
          m.isDead = true;
          sound.playMonsterDeath();
          this.onMonsterKill(m);

          // Spawn death explosion particles
          this.spawnDeathParticles(m.x, m.y + 1.5, m.z, m.type);

          // Check if guardians slain to unlock skills
          const guardiansDead = this.monsters.filter((mon) => mon.isGuardian).every((mon) => mon.isDead);
          if (guardiansDead && !this.skillsUnlocked) {
            this.skillsUnlocked = true;
            sound.playFanfare();
            if (this.shieldDome) {
              this.scene.remove(this.shieldDome);
            }
            this.onSkillsUnlocked();
          }
        }
      }
    });
  }

  spawnDeathParticles(x, y, z, type) {
    const count = 18;
    const colors = {
      bug: 0xef4444,
      drake: 0xa855f7,
      wight: 0x38bdf8,
      wraith: 0xf43f5e,
    };
    const col = colors[type] || 0xf59e0b;

    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(0.18, 4, 4);
      const mat = new THREE.MeshBasicMaterial({ color: col });
      const p = new THREE.Mesh(geo, mat);
      p.position.set(x, y, z);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const spd = Math.random() * 8 + 3;
      const vx = spd * Math.sin(phi) * Math.cos(theta);
      const vy = spd * Math.cos(phi) + 3;
      const vz = spd * Math.sin(phi) * Math.sin(theta);

      this.scene.add(p);
      this.particles.push({ mesh: p, vx, vy, vz, life: 0.6, maxLife: 0.6 });
    }
  }

  triggerInteraction() {
    if (!this.activeInteractable) return;

    if (this.activeInteractable.id === "skill_altar" && !this.skillsUnlocked) {
      sound.playClose();
      if (this.onLockedNotice) {
        this.onLockedNotice("⚔️ Slay the 2 Elite Altar Guardians to unlock Sarthak's Technical Skills!");
      }
      return;
    }

    sound.playInteract();
    this.onInteract(this.activeInteractable);
  }

  interact() {
    this.triggerInteraction();
  }

  // 5. MAIN GAME LOOP & ANIMATION UPDATE
  update(delta) {
    const t = this.clock.getElapsedTime();

    // Brazier Fire Light flicker
    this.brazierLights.forEach((light, i) => {
      light.intensity = 2.0 + Math.sin(t * 9 + i * 2) * 0.5;
    });

    // Rotate holographic landmarks
    this.shrineMeshes.forEach((s) => {
      if (s.rotSpeed !== 0) s.mesh.rotation.y += s.rotSpeed;
    });

    // Soldier Input & Movement
    let moveX = 0;
    let moveZ = 0;

    if (this.keys["w"] || this.keys["arrowup"]) moveZ -= 1;
    if (this.keys["s"] || this.keys["arrowdown"]) moveZ += 1;
    if (this.keys["a"] || this.keys["arrowleft"]) moveX -= 1;
    if (this.keys["d"] || this.keys["arrowright"]) moveX += 1;

    // Joystick input integration
    if (this.joystickInput) {
      moveX = this.joystickInput.dx;
      moveZ = this.joystickInput.dy;
    }

    const isSprint = this.keys["shift"];
    const speed = isSprint ? this.player.runSpeed : this.player.speed;

    if (Math.abs(moveX) > 0.1 || Math.abs(moveZ) > 0.1) {
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);

      const moveVec = new THREE.Vector3()
        .addScaledVector(forward, -moveZ)
        .addScaledVector(right, moveX)
        .normalize();

      this.player.x += moveVec.x * speed * delta;
      this.player.z += moveVec.z * speed * delta;

      // Face movement direction
      this.player.rotY = Math.atan2(moveVec.x, moveVec.z);
      this.player.isMoving = true;
      this.player.stepCycle += delta * 13;

      // Clamp within expanded castle grounds
      const bound = WORLD_3D.size / 2 - 5;
      this.player.x = Math.max(-bound, Math.min(bound, this.player.x));
      this.player.z = Math.max(-bound, Math.min(bound, this.player.z));

      this.onPlayerMove(this.player.x, this.player.z);
    } else {
      this.player.isMoving = false;
    }

    // Soldier Transforms & Animations
    this.soldierGroup.position.set(this.player.x, 0, this.player.z);

    if (this.player.spinTimer > 0) {
      // 360 Whirlwind Spin Animation
      this.soldierGroup.rotation.y += delta * 28;
    } else {
      this.soldierGroup.rotation.y = this.player.rotY;
    }

    // Running limb swinging animation
    if (this.player.isMoving) {
      const legAngle = Math.sin(this.player.stepCycle) * 0.65;
      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;
      this.leftArm.rotation.x = -legAngle * 0.5;
      this.rightArm.rotation.x = legAngle * 0.5;
      this.cape.rotation.x = 0.4 + Math.sin(this.player.stepCycle * 2) * 0.15;
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;
      this.cape.rotation.x = 0.08 + Math.sin(t * 2) * 0.05;
      this.soldierGroup.position.y = Math.sin(t * 3) * 0.05;
    }

    // Light Attack Slash animation
    if (this.player.attackTimer > 0) {
      this.player.attackTimer -= delta;
      this.slashMat.opacity = Math.max(0, this.player.attackTimer / 0.2);
      this.rightArm.rotation.x = -Math.PI / 4 + (1 - this.player.attackTimer / 0.2) * (Math.PI / 2);
    } else {
      this.player.isAttacking = false;
      this.slashMat.opacity = 0;
    }
    if (this.player.attackCooldown > 0) this.player.attackCooldown -= delta;

    // Whirlwind Spin Animation
    if (this.player.spinTimer > 0) {
      this.player.spinTimer -= delta;
      const progress = 1 - this.player.spinTimer / 0.35;
      this.spinMat.opacity = Math.max(0, 1 - progress);
      const s = 0.3 + progress * 1.4;
      this.spinMesh.scale.set(s, s, s);
      this.rightArm.rotation.x = -Math.PI / 2;
    } else {
      this.player.isSpinAttacking = false;
      this.spinMat.opacity = 0;
    }

    // Update Particles
    for (let pIdx = this.particles.length - 1; pIdx >= 0; pIdx--) {
      const p = this.particles[pIdx];
      p.life -= delta;
      p.mesh.position.x += p.vx * delta;
      p.mesh.position.y += p.vy * delta;
      p.mesh.position.z += p.vz * delta;
      p.vy -= 9.8 * delta; // Gravity
      p.mesh.scale.setScalar(p.life / p.maxLife);

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(pIdx, 1);
      }
    }

    // Update 26 3D Monsters AI & Meshes
    this.monsterMeshes.forEach(({ group, data, mat, wingL, wingR, legs, orbs, hpBg, hpFill }) => {
      if (data.isDead) {
        group.visible = false;
        return;
      }
      group.visible = true;

      // Distance to soldier
      const dist = Math.hypot(this.player.x - data.x, this.player.z - data.z);

      // Aggro Chase AI (within 32 units)
      if (dist < 32) {
        const angle = Math.atan2(this.player.z - data.z, this.player.x - data.x);
        data.x += Math.cos(angle) * data.speed * delta;
        data.z += Math.sin(angle) * data.speed * delta;
        data.rotY = Math.PI / 2 - angle;

        // Attack soldier if in close melee range
        if (dist < 2.8 && data.attackCooldown <= 0) {
          data.attackCooldown = 1.1;
          this.player.hp = Math.max(10, this.player.hp - data.attackPower);
          sound.playMonsterHit();
        }
      } else {
        // Idle wandering in patrol zone
        data.wanderTimer -= delta;
        if (data.wanderTimer <= 0) {
          data.wanderTimer = Math.random() * 4 + 2;
          data.wanderAngle = Math.random() * Math.PI * 2;
        }
        data.x += Math.cos(data.wanderAngle) * (data.speed * 0.3) * delta;
        data.z += Math.sin(data.wanderAngle) * (data.speed * 0.3) * delta;
        data.rotY = Math.PI / 2 - data.wanderAngle;

        // Return if wandered too far from origin
        const dOrigin = Math.hypot(data.x - data.originX, data.z - data.originZ);
        if (dOrigin > 25) {
          data.wanderAngle = Math.atan2(data.originZ - data.z, data.originX - data.x);
        }
      }

      if (data.attackCooldown > 0) data.attackCooldown -= delta;

      // Update Group Transforms
      let floatY = data.y;
      if (data.type === "drake") {
        floatY += Math.sin(t * 4 + data.x) * 0.4;
      } else if (data.type === "wraith") {
        floatY += Math.sin(t * 3 + data.z) * 0.35;
      }

      group.position.set(data.x, floatY, data.z);
      group.rotation.y = data.rotY;

      // Animation: Flapping Drake Wings
      if (wingL && wingR) {
        const flapRate = dist < 32 ? 18 : 10;
        const flap = Math.sin(t * flapRate) * 0.6;
        wingL.rotation.z = flap;
        wingR.rotation.z = -flap;
      }

      // Animation: Scuttling Bug / Marching Wight Legs
      if (legs && legs.length > 0) {
        const stepRate = t * 14;
        legs.forEach((leg, lIdx) => {
          leg.rotation.x = Math.sin(stepRate + lIdx * Math.PI) * 0.5;
        });
      }

      // Animation: Orbiting Wraith Orbs
      if (orbs && orbs.length > 0) {
        orbs.forEach((orb, oIdx) => {
          const oAngle = t * 4 + (oIdx * (Math.PI * 2)) / 3;
          orb.position.set(Math.cos(oAngle) * 1.6, 1.8 + Math.sin(t * 3 + oIdx) * 0.3, Math.sin(oAngle) * 1.6);
        });
      }

      // 3D Health Bar Billboard (Faces camera)
      if (hpBg && hpFill) {
        hpBg.lookAt(this.camera.position);
        const hpPct = Math.max(0, data.hp / data.maxHp);
        hpFill.scale.x = hpPct;
        hpFill.position.x = (hpPct - 1) * 1.15;
        // Color shifts from green to yellow to red
        if (hpPct > 0.5) {
          hpFill.material.color.setHex(0x22c55e);
        } else if (hpPct > 0.25) {
          hpFill.material.color.setHex(0xeab308);
        } else {
          hpFill.material.color.setHex(0xef4444);
        }
      }

      // Hit Flash reaction
      if (data.hitFlash > 0) {
        data.hitFlash -= delta;
        mat.color.setHex(0xffffff);
      } else {
        if (data.type === "bug") mat.color.setHex(data.isGuardian ? 0x991b1b : 0xdc2626);
        else if (data.type === "drake") mat.color.setHex(data.isGuardian ? 0x581c87 : 0x7c3aed);
        else if (data.type === "wight") mat.color.setHex(0xe0f2fe);
        else if (data.type === "wraith") mat.color.setHex(0x0f172a);
      }
    });

    // 3D Third-Person Chase Camera Tracking
    const camTarget = new THREE.Vector3(this.player.x, 2, this.player.z);
    const rotatedOffset = this.cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const desiredCamPos = camTarget.clone().add(rotatedOffset);

    this.camera.position.lerp(desiredCamPos, 0.1);
    this.camera.lookAt(camTarget);

    // Check Landmark Proximity for Interaction
    let closestLandmark = null;
    let minDistance = 8.5;

    for (const [key, val] of Object.entries(WORLD_3D.landmarks)) {
      const dist = Math.hypot(this.player.x - val.x, this.player.z - val.z);
      if (dist < minDistance) {
        const item = INTERACTABLES.find((i) => i.id === val.id);
        if (item) closestLandmark = item;
      }
    }
    this.activeInteractable = closestLandmark;

    if (this.onPromptChange && this.activeInteractable !== this.prevActiveInteractable) {
      this.prevActiveInteractable = this.activeInteractable;
      this.onPromptChange(this.activeInteractable);
    }

    if (this.onHpChange && this.player.hp !== this.prevPlayerHp) {
      this.prevPlayerHp = this.player.hp;
      this.onHpChange(this.player.hp, this.player.maxHp);
    }

    // Mini-map Radar Broadcast (12 times per sec)
    this.miniMapTimer += delta;
    if (this.miniMapTimer >= 0.08) {
      this.miniMapTimer = 0;
      if (this.onRadarUpdate) {
        this.onRadarUpdate({
          player: { x: this.player.x, z: this.player.z, rotY: this.player.rotY, hp: this.player.hp },
          monsters: this.monsters.map((m) => ({
            id: m.id,
            name: m.name,
            x: m.x,
            z: m.z,
            hp: m.hp,
            maxHp: m.maxHp,
            isDead: m.isDead,
            type: m.type,
            isGuardian: m.isGuardian,
          })),
        });
      }
    }
  }

  loop() {
    if (!this.isRunning) return;
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.update(delta);
    this.renderer.render(this.scene, this.camera);
    this.animId = requestAnimationFrame(this.loop);
  }
}
