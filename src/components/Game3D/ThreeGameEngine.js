import * as THREE from "three";
import { sound } from "../Game/soundEngine";
import { INTERACTABLES } from "../Game/gameData";

// 3D Citadel World Configuration
export const WORLD_3D = {
  size: 150,
  spawn: { x: 0, y: 0, z: 8 },
  landmarks: {
    citadel: { x: 0, z: -10, label: "Citadel Keep", icon: "🏰", id: "sarthak_avatar" },
    experience: { x: -48, z: -8, label: "War Council", icon: "⚔️", id: "bluestock_master" },
    projects: { x: 0, z: -48, label: "Arcane Forge", icon: "🔮", id: "proj_solvesphere" },
    skills: { x: 48, z: -8, label: "Skills Lair", icon: "💎", id: "skill_altar" },
    education: { x: -40, z: 38, label: "Grand Archive", icon: "📚", id: "archive_tome" },
    contact: { x: 40, z: 38, label: "Raven Eyrie", icon: "🦅", id: "raven_eyrie" },
  },
};

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
    this.scene.background = new THREE.Color(0x0a0f1d);
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.012);

    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 300);
    this.camera.position.set(0, 14, 24);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Camera follow offset & rotation
    this.cameraOffset = new THREE.Vector3(0, 8, 14);
    this.cameraYaw = 0;
    this.isDragging = false;
    this.prevMouseX = 0;

    // Player Soldier State
    this.player = {
      x: WORLD_3D.spawn.x,
      y: 0,
      z: WORLD_3D.spawn.z,
      rotY: Math.PI,
      speed: 12,
      runSpeed: 18,
      hp: 100,
      maxHp: 100,
      isMoving: false,
      isAttacking: false,
      attackTimer: 0,
      attackCooldown: 0,
      hitFlash: 0,
      stepCycle: 0,
    };

    // 2 3D Monsters Guarding Skills
    this.monsters = [
      {
        id: "monster_bug",
        name: "Bug Fiend",
        maxHp: 60,
        hp: 60,
        speed: 7.5,
        attackPower: 8,
        x: 43,
        y: 0,
        z: -12,
        rotY: 0,
        isDead: false,
        hitFlash: 0,
        attackCooldown: 0,
        type: "bug",
      },
      {
        id: "monster_drake",
        name: "Glitch Drake",
        maxHp: 80,
        hp: 80,
        speed: 8.5,
        attackPower: 12,
        x: 53,
        y: 1.5,
        z: -4,
        rotY: 0,
        isDead: false,
        hitFlash: 0,
        attackCooldown: 0,
        type: "drake",
      },
    ];

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

    // Attack: Space, J, F
    if (e.key === " " || k === "j" || k === "f") {
      this.attack();
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

  // 1. BUILD 3D WORLD ENVIRONMENT
  buildWorld() {
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.3);
    sunLight.position.set(40, 60, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    const d = 65;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.scene.add(sunLight);

    // Secondary blue atmospheric rim light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    rimLight.position.set(-40, 30, -40);
    this.scene.add(rimLight);

    // Stone Tiled Floor
    const floorGeo = new THREE.PlaneGeometry(WORLD_3D.size, WORLD_3D.size, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x131d2e,
      roughness: 0.85,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Center Courtyard Circular Dais
    const daisGeo = new THREE.CylinderGeometry(18, 19, 0.4, 32);
    const daisMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.2 });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.set(0, 0.2, -5);
    dais.receiveShadow = true;
    this.scene.add(dais);

    // Outer Perimeter Castle Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a2333, roughness: 0.9 });
    const halfSize = WORLD_3D.size / 2;
    const wallGeoH = new THREE.BoxGeometry(WORLD_3D.size, 8, 4);
    const wallGeoV = new THREE.BoxGeometry(4, 8, WORLD_3D.size);

    const wallNorth = new THREE.Mesh(wallGeoH, wallMat);
    wallNorth.position.set(0, 4, -halfSize);
    wallNorth.castShadow = true;
    this.scene.add(wallNorth);

    const wallSouth = new THREE.Mesh(wallGeoH, wallMat);
    wallSouth.position.set(0, 4, halfSize);
    wallSouth.castShadow = true;
    this.scene.add(wallSouth);

    const wallWest = new THREE.Mesh(wallGeoV, wallMat);
    wallWest.position.set(-halfSize, 4, 0);
    wallWest.castShadow = true;
    this.scene.add(wallWest);

    const wallEast = new THREE.Mesh(wallGeoV, wallMat);
    wallEast.position.set(halfSize, 4, 0);
    wallEast.castShadow = true;
    this.scene.add(wallEast);

    // Pillars with Flaming Braziers
    const pillarPositions = [
      { x: -14, z: -14 },
      { x: 14, z: -14 },
      { x: -14, z: 14 },
      { x: 14, z: 14 },
      { x: -38, z: -20 },
      { x: -38, z: 4 },
      { x: 38, z: -20 },
      { x: 38, z: 4 },
    ];

    this.brazierLights = [];
    pillarPositions.forEach((pos) => {
      const pillarGeo = new THREE.CylinderGeometry(1.1, 1.4, 6, 12);
      const pillar = new THREE.Mesh(pillarGeo, wallMat);
      pillar.position.set(pos.x, 3, pos.z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.scene.add(pillar);

      // Fire Bowl
      const bowlGeo = new THREE.CylinderGeometry(1.6, 0.8, 1, 12);
      const bowlMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6, roughness: 0.4 });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.position.set(pos.x, 6.2, pos.z);
      this.scene.add(bowl);

      // Brazier Fire Light
      const pLight = new THREE.PointLight(0xf59e0b, 1.8, 20);
      pLight.position.set(pos.x, 7.5, pos.z);
      this.scene.add(pLight);
      this.brazierLights.push(pLight);
    });

    // Build 3D Shrines & Landmark Monuments
    this.buildLandmarkMeshes();
  }

  buildLandmarkMeshes() {
    this.shrineMeshes = [];

    // 1. Citadel Keep (About Sarthak)
    const dais = new THREE.Mesh(
      new THREE.CylinderGeometry(4.5, 5, 1, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5, metalness: 0.4 })
    );
    dais.position.set(0, 0.5, -10);
    this.scene.add(dais);

    // Floating Hologram Core
    const holoCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, roughness: 0.2, wireframe: true })
    );
    holoCore.position.set(0, 3.2, -10);
    this.scene.add(holoCore);
    this.shrineMeshes.push({ mesh: holoCore, id: "sarthak_avatar", rotSpeed: 0.02 });

    // 2. War Council (Experience)
    const warTable = new THREE.Mesh(
      new THREE.BoxGeometry(7, 1.4, 4),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    warTable.position.set(-48, 0.7, -8);
    this.scene.add(warTable);
    const warBanner = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 5, 2.5),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x92400e })
    );
    warBanner.position.set(-48, 4, -8);
    this.scene.add(warBanner);
    this.shrineMeshes.push({ mesh: warBanner, id: "bluestock_master", rotSpeed: 0.01 });

    // 3. Arcane Forge (Featured Projects)
    const forgePedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 4, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.5, roughness: 0.5 })
    );
    forgePedestal.position.set(0, 0.6, -48);
    this.scene.add(forgePedestal);

    const forgeCrystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 0),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, wireframe: true })
    );
    forgeCrystal.position.set(0, 3.5, -48);
    this.scene.add(forgeCrystal);
    this.shrineMeshes.push({ mesh: forgeCrystal, id: "proj_solvesphere", rotSpeed: -0.02 });

    // 4. Skills Lair & Altar (East wing - Guarded by 2 Monsters)
    const altarBase = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 6, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.6, metalness: 0.4 })
    );
    altarBase.position.set(48, 0.6, -8);
    this.scene.add(altarBase);

    // Glowing Skill Relic Crystal
    this.skillCrystal = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.6, 0),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        roughness: 0.2,
        metalness: 0.5,
      })
    );
    this.skillCrystal.position.set(48, 3.5, -8);
    this.scene.add(this.skillCrystal);
    this.shrineMeshes.push({ mesh: this.skillCrystal, id: "skill_altar", rotSpeed: 0.025 });

    // Mystical Energy Shield around skills until monsters die
    const domeGeo = new THREE.SphereGeometry(7.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    this.shieldDomeMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    this.shieldDome = new THREE.Mesh(domeGeo, this.shieldDomeMat);
    this.shieldDome.position.set(48, 0, -8);
    this.scene.add(this.shieldDome);

    // 5. Grand Archive (Education)
    const archiveShelf = new THREE.Mesh(
      new THREE.BoxGeometry(6, 4.5, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x5b21b6, roughness: 0.8 })
    );
    archiveShelf.position.set(-40, 2.25, 38);
    this.scene.add(archiveShelf);
    this.shrineMeshes.push({ mesh: archiveShelf, id: "archive_tome", rotSpeed: 0 });

    // 6. Raven Eyrie (Contact)
    const ravenPerch = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.6, 5, 8),
      new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.6 })
    );
    ravenPerch.position.set(40, 2.5, 38);
    this.scene.add(ravenPerch);
    this.shrineMeshes.push({ mesh: ravenPerch, id: "raven_eyrie", rotSpeed: 0 });
  }

  // 2. BUILD 3D ARMORED SOLDIER WARRIOR
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

    // Helmet Plume / Crest
    const crestGeo = new THREE.BoxGeometry(0.15, 0.45, 0.9);
    const crest = new THREE.Mesh(crestGeo, goldTrimMat);
    crest.position.set(0, 3.4, 0);
    this.soldierGroup.add(crest);

    // Royal Cape
    const capeGeo = new THREE.PlaneGeometry(1.3, 1.9, 4, 4);
    this.capeMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // House blue
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

    // Round Knight Shield
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

    // Broadsword
    const swordBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 2.2, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 })
    );
    swordBlade.position.set(0, -0.8, 0.8);
    swordBlade.rotation.x = Math.PI / 4;

    const swordGuard = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.1, 0.15), goldTrimMat);
    swordGuard.position.set(0, 0.2, 0);
    swordBlade.add(swordGuard);
    this.rightArm.add(swordBlade);
    this.soldierGroup.add(this.rightArm);

    // 3D Curved Sword Slash Arc Mesh (Shown on attack)
    const slashGeo = new THREE.RingGeometry(1.6, 2.8, 16, 1, 0, Math.PI * 0.75);
    this.slashMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.slashMesh = new THREE.Mesh(slashGeo, this.slashMat);
    this.slashMesh.rotation.x = -Math.PI / 2;
    this.slashMesh.position.set(0, 1.4, 1.2);
    this.soldierGroup.add(this.slashMesh);

    this.scene.add(this.soldierGroup);
  }

  // 3. BUILD 2 3D MONSTERS (Bug Fiend & Glitch Drake)
  buildMonsters() {
    this.monsterMeshes = [];

    // Monster 1: 3D Bug Fiend
    const bugGroup = new THREE.Group();
    bugGroup.position.set(this.monsters[0].x, 0, this.monsters[0].z);

    const bugMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4, metalness: 0.5 });
    const bugAbdomen = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 8), bugMat);
    bugAbdomen.position.y = 1.3;
    bugAbdomen.scale.set(1, 0.8, 1.4);
    bugAbdomen.castShadow = true;
    bugGroup.add(bugAbdomen);

    // Glowing Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), eyeMat);
    eyeL.position.set(-0.5, 1.5, 1.4);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), eyeMat);
    eyeR.position.set(0.5, 1.5, 1.4);
    bugGroup.add(eyeL);
    bugGroup.add(eyeR);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x450a0a });
    for (let i = -1; i <= 1; i++) {
      const lLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.05, 1.8), legMat);
      lLeg.position.set(-1.4, 0.7, i * 0.8);
      lLeg.rotation.z = Math.PI / 4;
      bugGroup.add(lLeg);

      const rLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.05, 1.8), legMat);
      rLeg.position.set(1.4, 0.7, i * 0.8);
      rLeg.rotation.z = -Math.PI / 4;
      bugGroup.add(rLeg);
    }
    this.scene.add(bugGroup);
    this.monsterMeshes.push({ group: bugGroup, data: this.monsters[0], mat: bugMat });

    // Monster 2: 3D Glitch Drake (Cyber Dragon)
    const drakeGroup = new THREE.Group();
    drakeGroup.position.set(this.monsters[1].x, 1.5, this.monsters[1].z);

    const drakeMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.3, metalness: 0.6 });
    const drakeBody = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.2, 6), drakeMat);
    drakeBody.rotation.x = Math.PI / 2;
    drakeBody.castShadow = true;
    drakeGroup.add(drakeBody);

    // Wings
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const wingL = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.8), wingMat);
    wingL.position.set(-2, 0.6, 0);
    wingL.rotation.y = Math.PI / 8;
    drakeGroup.add(wingL);

    const wingR = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.8), wingMat);
    wingR.position.set(2, 0.6, 0);
    wingR.rotation.y = -Math.PI / 8;
    drakeGroup.add(wingR);

    this.scene.add(drakeGroup);
    this.monsterMeshes.push({ group: drakeGroup, data: this.monsters[1], mat: drakeMat, wingL, wingR });
  }

  // 4. COMBAT & ATTACK
  attack() {
    if (this.player.attackCooldown > 0) return;
    this.player.isAttacking = true;
    this.player.attackTimer = 0.18; // 180ms
    this.player.attackCooldown = 0.28;
    sound.playSlash();

    // Show 3D slash arc
    this.slashMat.opacity = 0.85;

    // Hitbox calculation in front of soldier
    const attackReach = 5.5;
    const forwardX = Math.sin(this.player.rotY);
    const forwardZ = Math.cos(this.player.rotY);
    const hitBoxPos = {
      x: this.player.x + forwardX * 3.2,
      z: this.player.z + forwardZ * 3.2,
    };

    // Check hit against 3D monsters
    this.monsters.forEach((m) => {
      if (m.isDead) return;
      const dist = Math.hypot(m.x - hitBoxPos.x, m.z - hitBoxPos.z);
      if (dist < attackReach) {
        const isCrit = Math.random() > 0.6;
        const dmg = isCrit ? 30 : 20;
        m.hp = Math.max(0, m.hp - dmg);
        m.hitFlash = 0.15;
        sound.playMonsterHit();

        // Knockback
        const angle = Math.atan2(m.z - this.player.z, m.x - this.player.x);
        m.x += Math.cos(angle) * 3.5;
        m.z += Math.sin(angle) * 3.5;

        // Death check
        if (m.hp <= 0) {
          m.isDead = true;
          sound.playMonsterDeath();
          this.onMonsterKill(m);

          // Check if both monsters slain
          const allDead = this.monsters.every((mon) => mon.isDead);
          if (allDead && !this.skillsUnlocked) {
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

  triggerInteraction() {
    if (!this.activeInteractable) return;

    if (this.activeInteractable.id === "skill_altar" && !this.skillsUnlocked) {
      sound.playClose();
      if (this.onLockedNotice) {
        this.onLockedNotice("⚔️ Slay both beasts first to unlock Sarthak's Technical Skills!");
      }
      return;
    }

    sound.playInteract();
    this.onInteract(this.activeInteractable);
  }

  interact() {
    this.triggerInteraction();
  }

  // 5. GAME UPDATE LOOP
  update(delta) {
    // Brazier Fire Light flicker
    const t = this.clock.getElapsedTime();
    this.brazierLights.forEach((light, i) => {
      light.intensity = 1.6 + Math.sin(t * 8 + i) * 0.4;
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
      // Relative movement based on camera angle
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
      this.player.stepCycle += delta * 12;

      // Clamp within castle grounds
      const bound = WORLD_3D.size / 2 - 4;
      this.player.x = Math.max(-bound, Math.min(bound, this.player.x));
      this.player.z = Math.max(-bound, Math.min(bound, this.player.z));

      this.onPlayerMove(this.player.x, this.player.z);
    } else {
      this.player.isMoving = false;
    }

    // Soldier Model Transforms & Running Animations
    this.soldierGroup.position.set(this.player.x, 0, this.player.z);
    this.soldierGroup.rotation.y = this.player.rotY;

    if (this.player.isMoving) {
      const legAngle = Math.sin(this.player.stepCycle) * 0.6;
      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;
      this.leftArm.rotation.x = -legAngle * 0.5;
      this.rightArm.rotation.x = legAngle * 0.5;
      this.cape.rotation.x = 0.35 + Math.sin(this.player.stepCycle * 2) * 0.15;
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.cape.rotation.x = 0.08 + Math.sin(t * 2) * 0.05;
      // Idle breathing
      this.soldierGroup.position.y = Math.sin(t * 3) * 0.05;
    }

    // Attack Slash Timer
    if (this.player.attackTimer > 0) {
      this.player.attackTimer -= delta;
      this.slashMat.opacity = Math.max(0, this.player.attackTimer / 0.18);
    } else {
      this.player.isAttacking = false;
      this.slashMat.opacity = 0;
    }
    if (this.player.attackCooldown > 0) this.player.attackCooldown -= delta;

    // Update 3D Monster AI & Meshes
    this.monsterMeshes.forEach(({ group, data, mat, wingL, wingR }) => {
      if (data.isDead) {
        group.visible = false;
        return;
      }
      group.visible = true;

      // Distance to soldier
      const dist = Math.hypot(this.player.x - data.x, this.player.z - data.z);

      // Aggro Chase AI (if soldier within 28 units)
      if (dist < 28) {
        const angle = Math.atan2(this.player.z - data.z, this.player.x - data.x);
        data.x += Math.cos(angle) * data.speed * delta;
        data.z += Math.sin(angle) * data.speed * delta;
        data.rotY = Math.PI / 2 - angle;

        // Attack soldier if close
        if (dist < 2.5 && data.attackCooldown <= 0) {
          data.attackCooldown = 1.0;
          this.player.hp = Math.max(10, this.player.hp - data.attackPower);
          sound.playMonsterHit();
        }
      }

      if (data.attackCooldown > 0) data.attackCooldown -= delta;

      // Update Mesh
      group.position.set(data.x, data.y, data.z);
      group.rotation.y = data.rotY;

      // Dragon Wing Flapping Animation
      if (wingL && wingR) {
        const flap = Math.sin(t * 12) * 0.5;
        wingL.rotation.z = flap;
        wingR.rotation.z = -flap;
      }

      // Hit Flash reaction
      if (data.hitFlash > 0) {
        data.hitFlash -= delta;
        mat.color.setHex(0xffffff);
      } else {
        mat.color.setHex(data.type === "bug" ? 0xdc2626 : 0x7c3aed);
      }
    });

    // 3D Third-Person Chase Camera Tracking
    const camTarget = new THREE.Vector3(this.player.x, 2, this.player.z);
    const rotatedOffset = this.cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const desiredCamPos = camTarget.clone().add(rotatedOffset);

    this.camera.position.lerp(desiredCamPos, 0.1);
    this.camera.lookAt(camTarget);

    // Check 3D Landmark Proximity for Interaction
    let closestLandmark = null;
    let minDistance = 7.5;

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
