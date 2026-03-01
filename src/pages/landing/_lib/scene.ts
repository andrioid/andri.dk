import * as THREE from "three";

const MONITOR_GREEN = 0x33ff33;
const ROOM_WIDTH = 5.5;
const ROOM_HEIGHT = 3;
const ROOM_DEPTH = 4.5;

// Desk positioning constants
const DESK_HEIGHT = 0.75;
const DESK_TOP_WIDTH = 2.6;
const DESK_TOP_DEPTH = 0.85;
const DESK_TOP_THICK = 0.05;
const DESK_Z = -ROOM_DEPTH / 2 + DESK_TOP_DEPTH / 2 + 0.15;

function smoothstep(t: number): number {
	return t * t * (3 - 2 * t);
}

export interface SceneAPI {
	cleanup(): void;
	zoomToScreen(onComplete: () => void): void;
	zoomOut(onComplete: () => void): void;
	getScreenRect(): {
		left: number;
		top: number;
		width: number;
		height: number;
	} | null;
}

export function createScene(
	canvas: HTMLCanvasElement,
	isMobile: boolean,
): SceneAPI {
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.1;

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x2a2235);
	// Depth fog for atmosphere
	scene.fog = new THREE.FogExp2(0x2a2235, 0.04);

	// Camera — 45deg off-angle from the right, looking across the desk
	const camera = new THREE.PerspectiveCamera(
		48,
		window.innerWidth / window.innerHeight,
		0.1,
		50,
	);
	const idlePos = new THREE.Vector3(2.0, 1.6, 1.6);
	const idleLookAt = new THREE.Vector3(-0.3, 0.9, -1.0);
	camera.position.copy(idlePos);
	camera.lookAt(idleLookAt);

	const currentLookAt = idleLookAt.clone();
	const targetLookAt = idleLookAt.clone();

	// Zoom state machine
	let zoomState: "idle" | "zooming-in" | "terminal" | "zooming-out" = "idle";
	let zoomProgress = 0;
	let zoomCallback: (() => void) | null = null;
	const ZOOM_SPEED = 0.025;
	let zoomPos = new THREE.Vector3();
	let zoomLookAt = new THREE.Vector3();
	let screenMeshRef: THREE.Mesh | null = null;

	buildRoom(scene);
	buildWindow(scene);
	buildDesk(scene);
	buildAmstrad(scene);
	buildDeskLamp(scene);
	buildCoffeeMug(scene);
	buildDeskMouse(scene);
	buildPlant(scene);
	buildFloppyDisks(scene);
	buildWallDecorations(scene);
	buildChair(scene);
	buildFloorPlant(scene);
	setupLights(scene);

	// Find screen mesh and compute zoom target
	scene.traverse((obj) => {
		if (
			obj.name === "interactive" &&
			obj instanceof THREE.Mesh &&
			obj.userData.screenCenter
		) {
			screenMeshRef = obj;
			const center = obj.userData.screenCenter as THREE.Vector3;
			zoomLookAt.copy(center);
			// Position camera ~0.4 units in front of the screen
			zoomPos.set(center.x, center.y, center.z + 0.4);
		}
	});

	// Mouse tracking
	const mouse = { x: 0, y: 0 };
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	// Raycaster for interactive objects
	const raycaster = new THREE.Raycaster();
	const rayMouse = new THREE.Vector2();
	let hoveredObj: THREE.Object3D | null = null;

	// Collect interactive meshes for raycasting
	const interactives: THREE.Mesh[] = [];
	scene.traverse((obj) => {
		if (obj.name === "interactive" && obj instanceof THREE.Mesh) {
			interactives.push(obj);
		}
	});

	// Tooltip element
	const tooltip = document.createElement("div");
	tooltip.style.cssText = `
		position: fixed;
		padding: 4px 10px;
		font-family: "Source Code Pro Variable", monospace;
		font-size: 13px;
		color: #59b4ff;
		background: rgba(6, 4, 14, 0.7);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(89, 180, 255, 0.2);
		border-radius: 4px;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.15s ease;
		z-index: 20;
		white-space: nowrap;
	`;
	document.body.appendChild(tooltip);

	function setHovered(obj: THREE.Object3D | null) {
		if (hoveredObj === obj) return;

		// Reset previous
		if (hoveredObj instanceof THREE.Mesh) {
			const mat = hoveredObj.material;
			if (mat instanceof THREE.MeshStandardMaterial) {
				mat.emissive.setHex(0x000000);
			}
		}

		hoveredObj = obj;

		// Highlight new
		if (obj instanceof THREE.Mesh) {
			const mat = obj.material;
			if (mat instanceof THREE.MeshStandardMaterial) {
				mat.emissive.setHex(0x1a3050);
				mat.emissiveIntensity = 0.5;
			}
			canvas.style.cursor = "pointer";
			tooltip.textContent = obj.userData.label ?? "";
			tooltip.style.opacity = "1";
		} else {
			canvas.style.cursor = "";
			tooltip.style.opacity = "0";
		}
	}

	let mouseDirty = false;
	let lastMoveTime = 0;
	const MOUSE_THROTTLE_MS = 60;

	function onMouseMove(e: MouseEvent) {
		const now = performance.now();
		if (now - lastMoveTime < MOUSE_THROTTLE_MS) return;
		lastMoveTime = now;

		mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
		mouse.y = (e.clientY / window.innerHeight) * 2 - 1;

		rayMouse.set(mouse.x, -mouse.y);
		mouseDirty = true;

		// Position tooltip near cursor, clamped to viewport
		const tx = Math.min(e.clientX + 14, window.innerWidth - 120);
		const ty = Math.min(e.clientY - 8, window.innerHeight - 30);
		tooltip.style.left = `${tx}px`;
		tooltip.style.top = `${ty}px`;
	}
	window.addEventListener("mousemove", onMouseMove, { passive: true });

	function onClick(e: MouseEvent) {
		if (!hoveredObj || zoomState !== "idle") return;
		if (!hoveredObj.userData.screenCenter) return;

		const target = e.target as HTMLElement;
		if (target !== canvas) return;

		// Screen click: zoom in on desktop, skip on mobile
		if (!isMobile) {
			canvas.dispatchEvent(new CustomEvent("zoom-to-screen"));
		}
	}
	window.addEventListener("click", onClick);

	function onResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	window.addEventListener("resize", onResize);

	// Animation state
	let cursorMaterial: THREE.MeshBasicMaterial | null = null;

	// Find cursor material in scene
	scene.traverse((obj) => {
		if (obj.name === "crt-cursor" && obj instanceof THREE.Mesh) {
			cursorMaterial = obj.material as THREE.MeshBasicMaterial;
		}
	});

	const clock = new THREE.Clock();

	// Cache animated objects to avoid traversing every frame
	const scanlines: THREE.Mesh[] = [];
	const steamWisps: THREE.Mesh[] = [];
	scene.traverse((obj) => {
		if (obj instanceof THREE.Mesh) {
			if (obj.name === "crt-scanline") scanlines.push(obj);
			if (obj.name === "steam-wisp") steamWisps.push(obj);
		}
	});

	// Temp vectors for zoom lerp (avoid allocation in hot loop)
	const lerpPosA = new THREE.Vector3();
	const lerpPosB = new THREE.Vector3();

	function animate() {
		requestAnimationFrame(animate);
		const elapsed = clock.getElapsedTime();

		// Zoom animation
		if (zoomState === "zooming-in") {
			zoomProgress = Math.min(1, zoomProgress + ZOOM_SPEED);
			const t = smoothstep(zoomProgress);
			lerpPosA.copy(idlePos).lerp(zoomPos, t);
			lerpPosB.copy(idleLookAt).lerp(zoomLookAt, t);
			camera.position.copy(lerpPosA);
			currentLookAt.copy(lerpPosB);
			camera.lookAt(currentLookAt);
			if (zoomProgress >= 1) {
				zoomState = "terminal";
				zoomCallback?.();
				zoomCallback = null;
			}
		} else if (zoomState === "zooming-out") {
			zoomProgress = Math.min(1, zoomProgress + ZOOM_SPEED);
			const t = smoothstep(zoomProgress);
			lerpPosA.copy(zoomPos).lerp(idlePos, t);
			lerpPosB.copy(zoomLookAt).lerp(idleLookAt, t);
			camera.position.copy(lerpPosA);
			currentLookAt.copy(lerpPosB);
			camera.lookAt(currentLookAt);
			if (zoomProgress >= 1) {
				zoomState = "idle";
				zoomCallback?.();
				zoomCallback = null;
			}
		} else if (zoomState === "idle") {
			// Mouse parallax — subtle sway (only when idle)
			if (!prefersReducedMotion) {
				targetLookAt.x = idleLookAt.x + mouse.x * 0.08;
				targetLookAt.y = idleLookAt.y - mouse.y * 0.04;
				currentLookAt.lerp(targetLookAt, 0.03);
				camera.lookAt(currentLookAt);
			}
		}

		// Raycast only when idle and mouse has moved
		if (zoomState === "idle" && mouseDirty) {
			mouseDirty = false;
			raycaster.setFromCamera(rayMouse, camera);
			const hits = raycaster.intersectObjects(interactives, false);
			setHovered(hits.length > 0 ? hits[0].object : null);
		} else if (zoomState !== "idle") {
			setHovered(null);
		}

		// Cursor blink + scanline — hide during terminal state
		if (cursorMaterial) {
			if (zoomState === "terminal") {
				cursorMaterial.opacity = 0;
			} else {
				cursorMaterial.opacity =
					Math.floor(elapsed * 2) % 2 === 0 ? 1 : 0;
			}
		}

		// CRT scanline sweep — skip during terminal
		for (const obj of scanlines) {
			if (zoomState === "terminal") {
				(obj.material as THREE.MeshBasicMaterial).opacity = 0;
			} else {
				(obj.material as THREE.MeshBasicMaterial).opacity = 0.06;
				const monY = obj.userData.monY as number;
				const monH = obj.userData.monH as number;
				const cycle = (elapsed * 0.3) % 1;
				obj.position.y = monY - monH / 2 + cycle * monH;
			}
		}

		// Steam animation
		for (const obj of steamWisps) {
			const mat = obj.material as THREE.MeshBasicMaterial;
			const offset = obj.userData.delay ?? 0;
			const t = ((elapsed + offset) % 2.5) / 2.5;
			obj.position.y = obj.userData.baseY + t * 0.12;
			obj.scale.x = 1 + t * 0.8;
			mat.opacity = t < 0.2 ? t * 5 * 0.2 : (1 - t) * 0.25;
		}

		renderer.render(scene, camera);
	}

	animate();

	function zoomToScreen(onComplete: () => void) {
		if (zoomState !== "idle") return;
		zoomState = "zooming-in";
		zoomProgress = 0;
		zoomCallback = onComplete;
	}

	function zoomOut(onComplete: () => void) {
		if (zoomState !== "terminal") return;
		zoomState = "zooming-out";
		zoomProgress = 0;
		zoomCallback = onComplete;
	}

	function getScreenRect() {
		if (!screenMeshRef) return null;
		const sw = screenMeshRef.userData.scrW as number;
		const sh = screenMeshRef.userData.scrH as number;
		const center = screenMeshRef.userData.screenCenter as THREE.Vector3;

		// Project 4 corners to pixel space
		const w = renderer.domElement.clientWidth;
		const h = renderer.domElement.clientHeight;
		const corners = [
			new THREE.Vector3(center.x - sw / 2, center.y - sh / 2, center.z),
			new THREE.Vector3(center.x + sw / 2, center.y - sh / 2, center.z),
			new THREE.Vector3(center.x + sw / 2, center.y + sh / 2, center.z),
			new THREE.Vector3(center.x - sw / 2, center.y + sh / 2, center.z),
		];

		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const c of corners) {
			c.project(camera);
			const px = ((c.x + 1) / 2) * w;
			const py = ((1 - c.y) / 2) * h;
			minX = Math.min(minX, px);
			minY = Math.min(minY, py);
			maxX = Math.max(maxX, px);
			maxY = Math.max(maxY, py);
		}

		return {
			left: minX,
			top: minY,
			width: maxX - minX,
			height: maxY - minY,
		};
	}

	function cleanup() {
		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("click", onClick);
		window.removeEventListener("resize", onResize);
		tooltip.remove();
		renderer.dispose();
	}

	return { cleanup, zoomToScreen, zoomOut, getScreenRect };
}

function createWallTexture(w: number, h: number): THREE.CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d")!;

	// Flat white-ish base
	ctx.fillStyle = "#ede9e3";
	ctx.fillRect(0, 0, w, h);

	// Very faint horizontal brick lines — painted-over brick look
	ctx.strokeStyle = "rgba(190, 182, 172, 0.25)";
	ctx.lineWidth = 1;

	const brickH = 24;
	const brickW = 52;

	for (let row = 0; row < h / brickH; row++) {
		const y = row * brickH;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
		ctx.stroke();

		const offset = row % 2 === 0 ? 0 : brickW / 2;
		for (let x = offset; x < w; x += brickW) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x, y + brickH);
			ctx.stroke();
		}
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	return texture;
}

function buildRoom(scene: THREE.Scene) {
	const halfW = ROOM_WIDTH / 2;
	const halfD = ROOM_DEPTH / 2;

	// White brick walls
	const backBrickTex = createWallTexture(512, 256);
	backBrickTex.repeat.set(4, 2);
	const wallMat = new THREE.MeshStandardMaterial({
		map: backBrickTex,
		color: 0xf0ece6,
		roughness: 0.85,
		metalness: 0,
	});

	const backWall = new THREE.Mesh(
		new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_HEIGHT),
		wallMat,
	);
	backWall.position.set(0, ROOM_HEIGHT / 2, -halfD);
	backWall.receiveShadow = true;
	scene.add(backWall);

	const sideBrickTex = createWallTexture(512, 256);
	sideBrickTex.repeat.set(3, 2);
	const sideWallMat = new THREE.MeshStandardMaterial({
		map: sideBrickTex,
		color: 0xeae5de,
		roughness: 0.85,
		metalness: 0,
	});

	const leftWall = new THREE.Mesh(
		new THREE.PlaneGeometry(ROOM_DEPTH, ROOM_HEIGHT),
		sideWallMat,
	);
	leftWall.position.set(-halfW, ROOM_HEIGHT / 2, 0);
	leftWall.rotation.y = Math.PI / 2;
	leftWall.receiveShadow = true;
	scene.add(leftWall);

	const rightWall = new THREE.Mesh(
		new THREE.PlaneGeometry(ROOM_DEPTH, ROOM_HEIGHT),
		sideWallMat.clone(),
	);
	rightWall.position.set(halfW, ROOM_HEIGHT / 2, 0);
	rightWall.rotation.y = -Math.PI / 2;
	rightWall.receiveShadow = true;
	scene.add(rightWall);

	// Ceiling — off-white
	const ceilingMat = new THREE.MeshStandardMaterial({
		color: 0xf5f2ed,
		roughness: 0.95,
	});
	const ceiling = new THREE.Mesh(
		new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_DEPTH),
		ceilingMat,
	);
	ceiling.rotation.x = Math.PI / 2;
	ceiling.position.y = ROOM_HEIGHT;
	scene.add(ceiling);

	// Floor — warm hardwood with plank texture
	const floorCanvas = document.createElement("canvas");
	floorCanvas.width = 512;
	floorCanvas.height = 512;
	const fctx = floorCanvas.getContext("2d")!;

	// Base wood color
	fctx.fillStyle = "#6b5040";
	fctx.fillRect(0, 0, 512, 512);

	// Plank lines
	const plankW = 80;
	fctx.strokeStyle = "rgba(40, 25, 15, 0.3)";
	fctx.lineWidth = 2;
	for (let x = 0; x < 512; x += plankW) {
		fctx.beginPath();
		fctx.moveTo(x, 0);
		fctx.lineTo(x, 512);
		fctx.stroke();
	}

	// Subtle grain lines
	fctx.strokeStyle = "rgba(90, 60, 35, 0.15)";
	fctx.lineWidth = 1;
	for (let i = 0; i < 60; i++) {
		const y = Math.random() * 512;
		const xStart = Math.random() * 512;
		const len = 40 + Math.random() * 120;
		fctx.beginPath();
		fctx.moveTo(xStart, y);
		fctx.lineTo(xStart + len, y + (Math.random() - 0.5) * 4);
		fctx.stroke();
	}

	const floorTexture = new THREE.CanvasTexture(floorCanvas);
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(3, 3);

	const floorMat = new THREE.MeshStandardMaterial({
		map: floorTexture,
		roughness: 0.6,
		metalness: 0.02,
	});

	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_DEPTH),
		floorMat,
	);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = 0;
	floor.receiveShadow = true;
	scene.add(floor);

	// Baseboard — warm wood
	const baseboardMat = new THREE.MeshStandardMaterial({
		color: 0x8b7355,
		roughness: 0.7,
	});

	// Back baseboard
	const bbBack = new THREE.Mesh(
		new THREE.BoxGeometry(ROOM_WIDTH, 0.1, 0.03),
		baseboardMat,
	);
	bbBack.position.set(0, 0.05, -halfD + 0.015);
	scene.add(bbBack);

	// Side baseboards
	const bbLeft = new THREE.Mesh(
		new THREE.BoxGeometry(0.03, 0.1, ROOM_DEPTH),
		baseboardMat,
	);
	bbLeft.position.set(-halfW + 0.015, 0.05, 0);
	scene.add(bbLeft);

	const bbRight = new THREE.Mesh(
		new THREE.BoxGeometry(0.03, 0.1, ROOM_DEPTH),
		baseboardMat,
	);
	bbRight.position.set(halfW - 0.015, 0.05, 0);
	scene.add(bbRight);
}

function buildWindow(scene: THREE.Scene) {
	const halfD = ROOM_DEPTH / 2;

	// Window position — right side of back wall
	const winX = 1.2;
	const winY = 1.8;
	const winW = 1.4;
	const winH = 1.3;

	// Window frame — dark wood
	const frameMat = new THREE.MeshStandardMaterial({
		color: 0x3a2a1a,
		roughness: 0.7,
		metalness: 0.05,
	});
	const frameThick = 0.06;

	// Outer frame edges
	const frameTop = new THREE.Mesh(
		new THREE.BoxGeometry(winW + frameThick * 2, frameThick, 0.08),
		frameMat,
	);
	frameTop.position.set(
		winX,
		winY + winH / 2 + frameThick / 2,
		-halfD + 0.04,
	);
	frameTop.castShadow = true;
	scene.add(frameTop);

	const frameBot = new THREE.Mesh(
		new THREE.BoxGeometry(winW + frameThick * 2, frameThick, 0.08),
		frameMat,
	);
	frameBot.position.set(
		winX,
		winY - winH / 2 - frameThick / 2,
		-halfD + 0.04,
	);
	scene.add(frameBot);

	const frameLeft = new THREE.Mesh(
		new THREE.BoxGeometry(frameThick, winH, 0.08),
		frameMat,
	);
	frameLeft.position.set(
		winX - winW / 2 - frameThick / 2,
		winY,
		-halfD + 0.04,
	);
	scene.add(frameLeft);

	const frameRight = new THREE.Mesh(
		new THREE.BoxGeometry(frameThick, winH, 0.08),
		frameMat,
	);
	frameRight.position.set(
		winX + winW / 2 + frameThick / 2,
		winY,
		-halfD + 0.04,
	);
	scene.add(frameRight);

	// Crossbars
	const crossH = new THREE.Mesh(
		new THREE.BoxGeometry(winW, 0.04, 0.06),
		frameMat,
	);
	crossH.position.set(winX, winY, -halfD + 0.05);
	scene.add(crossH);

	const crossV = new THREE.Mesh(
		new THREE.BoxGeometry(0.04, winH, 0.06),
		frameMat,
	);
	crossV.position.set(winX, winY, -halfD + 0.05);
	scene.add(crossV);

	// Window sill
	const sillMat = new THREE.MeshStandardMaterial({
		color: 0x4a3828,
		roughness: 0.65,
	});
	const sill = new THREE.Mesh(
		new THREE.BoxGeometry(winW + 0.3, 0.04, 0.15),
		sillMat,
	);
	sill.position.set(winX, winY - winH / 2 - frameThick, -halfD + 0.08);
	sill.castShadow = true;
	scene.add(sill);

	// Sky — time-based gradient via canvas texture
	const skyCanvas = document.createElement("canvas");
	skyCanvas.width = 512;
	skyCanvas.height = 512;
	const sctx = skyCanvas.getContext("2d")!;

	// Night sky
	const grad = sctx.createLinearGradient(0, 0, 0, 512);
	grad.addColorStop(0, "#060a1f");
	grad.addColorStop(0.3, "#0e1430");
	grad.addColorStop(0.7, "#141a3a");
	grad.addColorStop(1, "#1a2248");

	sctx.fillStyle = grad;
	sctx.fillRect(0, 0, 512, 512);

	// Stars
	sctx.fillStyle = "#ffffff";
	for (let i = 0; i < 50; i++) {
		const sx = Math.random() * 512;
		const sy = Math.random() * 380;
		const sr = Math.random() * 1.5 + 0.3;
		sctx.beginPath();
		sctx.arc(sx, sy, sr, 0, Math.PI * 2);
		sctx.globalAlpha = 0.4 + Math.random() * 0.6;
		sctx.fill();
	}
	sctx.globalAlpha = 1;

	// Moon
	sctx.fillStyle = "#ffeedd";
	sctx.beginPath();
	sctx.arc(380, 80, 25, 0, Math.PI * 2);
	sctx.fill();
	// Crescent shadow
	sctx.fillStyle = "#0e1430";
	sctx.beginPath();
	sctx.arc(370, 75, 22, 0, Math.PI * 2);
	sctx.fill();
	// Subtle moonlight glow
	const moonGlow = sctx.createRadialGradient(380, 80, 20, 380, 80, 100);
	moonGlow.addColorStop(0, "rgba(200, 220, 255, 0.08)");
	moonGlow.addColorStop(1, "rgba(200, 220, 255, 0)");
	sctx.fillStyle = moonGlow;
	sctx.fillRect(0, 0, 512, 512);

	const skyTexture = new THREE.CanvasTexture(skyCanvas);
	const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture });
	const sky = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), skyMat);
	sky.position.set(winX, winY, -halfD + 0.005);
	scene.add(sky);
}

function buildDesk(scene: THREE.Scene) {
	const deskMat = new THREE.MeshStandardMaterial({
		color: 0x8b6240,
		roughness: 0.55,
		metalness: 0.03,
	});

	// Desktop surface
	const deskTop = new THREE.Mesh(
		new THREE.BoxGeometry(DESK_TOP_WIDTH, DESK_TOP_THICK, DESK_TOP_DEPTH),
		deskMat,
	);
	deskTop.position.set(0, DESK_HEIGHT, DESK_Z);
	deskTop.castShadow = true;
	deskTop.receiveShadow = true;
	scene.add(deskTop);

	// Desk front panel
	const frontMat = new THREE.MeshStandardMaterial({
		color: 0x6b4a28,
		roughness: 0.6,
	});
	const frontPanel = new THREE.Mesh(
		new THREE.BoxGeometry(DESK_TOP_WIDTH, 0.06, 0.02),
		frontMat,
	);
	frontPanel.position.set(
		0,
		DESK_HEIGHT - DESK_TOP_THICK / 2 - 0.03,
		DESK_Z + DESK_TOP_DEPTH / 2,
	);
	scene.add(frontPanel);

	// Desk legs
	const legMat = new THREE.MeshStandardMaterial({
		color: 0x5a3a18,
		roughness: 0.7,
	});
	const legH = DESK_HEIGHT - DESK_TOP_THICK / 2 - 0.06;
	const legGeo = new THREE.BoxGeometry(0.06, legH, 0.06);

	const legPositions = [
		[
			-DESK_TOP_WIDTH / 2 + 0.08,
			legH / 2,
			DESK_Z - DESK_TOP_DEPTH / 2 + 0.08,
		],
		[
			DESK_TOP_WIDTH / 2 - 0.08,
			legH / 2,
			DESK_Z - DESK_TOP_DEPTH / 2 + 0.08,
		],
		[
			-DESK_TOP_WIDTH / 2 + 0.08,
			legH / 2,
			DESK_Z + DESK_TOP_DEPTH / 2 - 0.08,
		],
		[
			DESK_TOP_WIDTH / 2 - 0.08,
			legH / 2,
			DESK_Z + DESK_TOP_DEPTH / 2 - 0.08,
		],
	] as const;

	for (const [x, y, z] of legPositions) {
		const leg = new THREE.Mesh(legGeo, legMat);
		leg.position.set(x, y, z);
		leg.castShadow = true;
		scene.add(leg);
	}

	// Side panel (left) — gives the desk some substance
	const sidePanelMat = new THREE.MeshStandardMaterial({
		color: 0x6b4a28,
		roughness: 0.6,
	});
	const sidePanel = new THREE.Mesh(
		new THREE.BoxGeometry(0.02, legH, DESK_TOP_DEPTH - 0.04),
		sidePanelMat,
	);
	sidePanel.position.set(-DESK_TOP_WIDTH / 2 + 0.05, legH / 2, DESK_Z);
	scene.add(sidePanel);
}

function buildAmstrad(scene: THREE.Scene) {
	const baseY = DESK_HEIGHT + DESK_TOP_THICK / 2;

	// The CPC 6128 has a separate keyboard unit that sits in front of the monitor
	const baseMat = new THREE.MeshStandardMaterial({
		color: 0x4a4a4a,
		roughness: 0.5,
		metalness: 0.08,
	});

	// Monitor riser / base block (the monitor sits on this) — pushed back
	const riserW = 0.5;
	const riserH = 0.04;
	const riserD = 0.32;
	const riser = new THREE.Mesh(
		new THREE.BoxGeometry(riserW, riserH, riserD),
		baseMat,
	);
	riser.position.set(0, baseY + riserH / 2, DESK_Z - 0.22);
	riser.castShadow = true;
	scene.add(riser);

	// Keyboard unit — positioned where a user would type
	const kbW = 0.52;
	const kbH = 0.025;
	const kbD = 0.18;
	const kbZ = DESK_Z + 0.2;

	const kbMat = new THREE.MeshStandardMaterial({
		color: 0x3a3a3a,
		roughness: 0.5,
		metalness: 0.08,
	});
	const keyboard = new THREE.Mesh(
		new THREE.BoxGeometry(kbW, kbH, kbD),
		kbMat,
	);
	keyboard.position.set(0, baseY + kbH / 2, kbZ);
	keyboard.rotation.x = -0.04;
	keyboard.castShadow = true;
	scene.add(keyboard);

	// Floppy drive slot on the right side of keyboard
	const slotMat = new THREE.MeshStandardMaterial({
		color: 0x2a2a2a,
		roughness: 0.3,
	});
	const slot = new THREE.Mesh(
		new THREE.BoxGeometry(0.1, 0.004, 0.015),
		slotMat,
	);
	slot.position.set(0.18, baseY + kbH + 0.001, kbZ - kbD / 2 + 0.03);
	scene.add(slot);

	// Keyboard keys — lighter keys on dark body for contrast
	const keyMat = new THREE.MeshStandardMaterial({
		color: 0x5a5a5a,
		roughness: 0.35,
		metalness: 0.05,
	});
	const keyLightMat = new THREE.MeshStandardMaterial({
		color: 0x707070,
		roughness: 0.3,
		metalness: 0.05,
	});
	const keyGeo = new THREE.BoxGeometry(1, 1, 1);

	// 5 rows of keys with tighter spacing to fill the keyboard body
	const keyRows = [
		{ keys: 14, width: 0.48, mat: keyLightMat },
		{ keys: 14, width: 0.48, mat: keyMat },
		{ keys: 13, width: 0.46, mat: keyMat },
		{ keys: 12, width: 0.44, mat: keyMat },
		{ keys: 10, width: 0.38, mat: keyMat },
	];

	const rowSpacing = 0.03;
	const keyH = 0.008;
	const keyD = 0.02;
	const firstRowZ = kbZ + kbD / 2 - 0.025;

	for (let row = 0; row < keyRows.length; row++) {
		const { keys: keysInRow, width: rowWidth, mat } = keyRows[row];
		const keyW = rowWidth / keysInRow - 0.004;

		for (let k = 0; k < keysInRow; k++) {
			const key = new THREE.Mesh(keyGeo, mat);
			key.scale.set(keyW, keyH, keyD);
			const x = -rowWidth / 2 + (k + 0.5) * (rowWidth / keysInRow);
			const z = firstRowZ - row * rowSpacing;
			key.position.set(x, baseY + kbH + keyH / 2, z);
			scene.add(key);
		}
	}

	// Space bar — wider, in the center of the bottom row area
	const spaceBar = new THREE.Mesh(keyGeo, keyMat);
	spaceBar.scale.set(0.18, 0.006, 0.02);
	spaceBar.position.set(0, baseY + kbH + 0.003, firstRowZ - 5 * rowSpacing);
	scene.add(spaceBar);

	// Monitor — CRT sitting on the riser
	const monitorMat = new THREE.MeshStandardMaterial({
		color: 0x3c3c3c,
		roughness: 0.45,
		metalness: 0.08,
	});

	const monW = 0.55;
	const monH = 0.44;
	const monD = 0.38;

	// Main monitor body
	const monitor = new THREE.Mesh(
		new THREE.BoxGeometry(monW, monH, monD),
		monitorMat,
	);
	const monZ = DESK_Z - 0.22;
	const monY = baseY + riserH + monH / 2;
	monitor.position.set(0, monY, monZ);
	monitor.castShadow = true;
	scene.add(monitor);

	// Slight bevel — a second darker box inset on the front face
	const bezelMat = new THREE.MeshStandardMaterial({
		color: 0x2a2a2a,
		roughness: 0.3,
	});
	const bezel = new THREE.Mesh(
		new THREE.BoxGeometry(monW - 0.04, monH - 0.04, 0.01),
		bezelMat,
	);
	bezel.position.set(0, monY, monZ + monD / 2 + 0.005);
	scene.add(bezel);

	// CRT screen
	const screenCanvas = document.createElement("canvas");
	screenCanvas.width = 512;
	screenCanvas.height = 384;
	const ctx = screenCanvas.getContext("2d")!;

	// Dark CRT background with slight green tinge
	ctx.fillStyle = "#050a05";
	ctx.fillRect(0, 0, 512, 384);

	// CRT vignette
	const vignette = ctx.createRadialGradient(256, 192, 100, 256, 192, 280);
	vignette.addColorStop(0, "rgba(0,0,0,0)");
	vignette.addColorStop(1, "rgba(0,0,0,0.4)");
	ctx.fillStyle = vignette;
	ctx.fillRect(0, 0, 512, 384);

	// "READY." text
	ctx.font = "bold 22px monospace";
	ctx.fillStyle = "#33ff33";
	ctx.textBaseline = "middle";
	ctx.fillText("Amstrad 128K Microcomputer  (v3)", 30, 40);
	ctx.fillText("©1985 Amstrad Consumer Electronics plc", 30, 70);
	ctx.fillText("       and Locomotive Software Ltd.", 30, 95);
	ctx.fillText("BASIC 1.1", 30, 130);
	ctx.fillText("Ready", 30, 175);

	// Scanline overlay
	ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
	for (let i = 0; i < 384; i += 3) {
		ctx.fillRect(0, i, 512, 1);
	}

	// Phosphor glow effect
	const glow = ctx.createRadialGradient(256, 192, 50, 256, 192, 300);
	glow.addColorStop(0, "rgba(51, 255, 51, 0.03)");
	glow.addColorStop(1, "rgba(51, 255, 51, 0)");
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, 512, 384);

	const screenTexture = new THREE.CanvasTexture(screenCanvas);
	const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });

	const scrW = monW - 0.1;
	const scrH = monH - 0.12;
	const screenMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(scrW, scrH),
		screenMat,
	);
	screenMesh.position.set(0, monY, monZ + monD / 2 + 0.011);
	screenMesh.name = "interactive";
	screenMesh.userData.label = "click to open terminal";
	screenMesh.userData.screenCenter = new THREE.Vector3(
		0,
		monY,
		monZ + monD / 2 + 0.011,
	);
	screenMesh.userData.scrW = scrW;
	screenMesh.userData.scrH = scrH;
	scene.add(screenMesh);

	// Blinking cursor — positioned on the line below "Ready" text
	// Canvas: "Ready" at y=175, next line at ~y=200 on 384px canvas
	// X: left margin at x=30 on 512px canvas
	const cursorMat = new THREE.MeshBasicMaterial({
		color: MONITOR_GREEN,
		transparent: true,
		opacity: 1,
	});
	const cursor = new THREE.Mesh(
		new THREE.PlaneGeometry(0.012, 0.018),
		cursorMat,
	);
	cursor.name = "crt-cursor";
	// Map canvas coords to 3D: x=30/512 -> screen left edge, y=200/384 -> below "Ready"
	const cursorScreenX = (30 / 512 - 0.5) * scrW;
	const cursorScreenY = -(200 / 384 - 0.5) * scrH;
	cursor.position.set(
		cursorScreenX,
		monY + cursorScreenY,
		monZ + monD / 2 + 0.012,
	);
	scene.add(cursor);

	// "ANDRI CPC 6128" label below screen
	const labelCanvas = document.createElement("canvas");
	labelCanvas.width = 256;
	labelCanvas.height = 32;
	const lctx = labelCanvas.getContext("2d")!;
	lctx.fillStyle = "#3c3c3c";
	lctx.fillRect(0, 0, 256, 32);
	lctx.font = "bold 12px monospace";
	lctx.fillStyle = "#777777";
	lctx.textAlign = "center";
	lctx.textBaseline = "middle";
	lctx.fillText("ANDRI  GT 65  MONITEUR", 128, 16);

	const labelTexture = new THREE.CanvasTexture(labelCanvas);
	const labelMat = new THREE.MeshBasicMaterial({ map: labelTexture });
	const label = new THREE.Mesh(
		new THREE.PlaneGeometry(0.28, 0.025),
		labelMat,
	);
	label.position.set(0, monY - monH / 2 + 0.025, monZ + monD / 2 + 0.011);
	scene.add(label);

	// Power LED
	const ledMat = new THREE.MeshBasicMaterial({
		color: 0xff3333,
	});
	const led = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 8), ledMat);
	led.position.set(0.2, monY - monH / 2 + 0.025, monZ + monD / 2 + 0.012);
	scene.add(led);

	// Animated scanline — a thin bright bar that sweeps down the screen
	const scanlineMat = new THREE.MeshBasicMaterial({
		color: MONITOR_GREEN,
		transparent: true,
		opacity: 0.06,
	});
	const scanline = new THREE.Mesh(
		new THREE.PlaneGeometry(scrW, 0.008),
		scanlineMat,
	);
	scanline.name = "crt-scanline";
	scanline.position.set(0, monY, monZ + monD / 2 + 0.013);
	scanline.userData = { monY, monH: scrH };
	scene.add(scanline);

	// Power cable — runs from back of monitor down to the floor
	const cableMat = new THREE.MeshStandardMaterial({
		color: 0x1a1a1a,
		roughness: 0.8,
	});
	const cablePoints = [
		new THREE.Vector3(0, monY - monH / 4, monZ - monD / 2),
		new THREE.Vector3(0.05, baseY - 0.02, monZ - monD / 2 - 0.1),
		new THREE.Vector3(0.08, 0.05, monZ - monD / 2 - 0.15),
		new THREE.Vector3(0.1, 0.01, monZ - monD / 2 - 0.2),
	];
	const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
	const cableGeo = new THREE.TubeGeometry(cableCurve, 16, 0.005, 6, false);
	const cable = new THREE.Mesh(cableGeo, cableMat);
	cable.castShadow = true;
	scene.add(cable);

	// Desk mat under the keyboard area
	const deskMatMaterial = new THREE.MeshStandardMaterial({
		color: 0x2a2a2a,
		roughness: 0.9,
		metalness: 0,
	});
	const deskMat = new THREE.Mesh(
		new THREE.BoxGeometry(0.8, 0.006, 0.5),
		deskMatMaterial,
	);
	deskMat.position.set(0, baseY + 0.003, DESK_Z + 0.05);
	deskMat.receiveShadow = true;
	scene.add(deskMat);
}

function buildDeskLamp(scene: THREE.Scene) {
	const baseY = DESK_HEIGHT + DESK_TOP_THICK / 2;
	const lampX = -0.95;
	const lampZ = DESK_Z - 0.15;

	// Lamp base
	const baseMat = new THREE.MeshStandardMaterial({
		color: 0xc4944a,
		roughness: 0.3,
		metalness: 0.6,
	});
	const base = new THREE.Mesh(
		new THREE.CylinderGeometry(0.06, 0.08, 0.02, 16),
		baseMat,
	);
	base.position.set(lampX, baseY + 0.01, lampZ);
	base.castShadow = true;
	scene.add(base);

	// Lamp arm
	const armMat = new THREE.MeshStandardMaterial({
		color: 0xb0843a,
		roughness: 0.35,
		metalness: 0.5,
	});
	const arm = new THREE.Mesh(
		new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8),
		armMat,
	);
	arm.position.set(lampX, baseY + 0.19, lampZ);
	// Slight tilt
	arm.rotation.z = 0.15;
	arm.rotation.x = -0.1;
	scene.add(arm);

	// Lamp shade — cone
	const shadeMat = new THREE.MeshStandardMaterial({
		color: 0xd4a44a,
		roughness: 0.4,
		metalness: 0.3,
		side: THREE.DoubleSide,
	});
	const shade = new THREE.Mesh(
		new THREE.ConeGeometry(0.08, 0.07, 16, 1, true),
		shadeMat,
	);
	shade.position.set(lampX + 0.05, baseY + 0.37, lampZ - 0.03);
	shade.rotation.z = 0.15;
	shade.rotation.x = Math.PI + 0.2;
	shade.castShadow = true;
	scene.add(shade);

	// Warm bulb glow inside shade
	const bulbMat = new THREE.MeshBasicMaterial({
		color: 0xffe8a0,
	});
	const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), bulbMat);
	bulb.position.set(lampX + 0.05, baseY + 0.35, lampZ - 0.03);
	scene.add(bulb);
}

function buildCoffeeMug(scene: THREE.Scene) {
	const baseY = DESK_HEIGHT + DESK_TOP_THICK / 2;
	const mugX = 0.85;
	const mugZ = DESK_Z + 0.15;

	// Mug body — black with "RTFM" text
	const mugCanvas = document.createElement("canvas");
	mugCanvas.width = 256;
	mugCanvas.height = 128;
	const mctx = mugCanvas.getContext("2d")!;

	// Black mug base
	mctx.fillStyle = "#1a1a1a";
	mctx.fillRect(0, 0, 256, 128);

	// "RTFM" text — pure white, bold, centered
	mctx.font = "bold 48px monospace";
	mctx.fillStyle = "#ffffff";
	mctx.textAlign = "center";
	mctx.textBaseline = "middle";
	mctx.fillText("RTFM", 128, 64);

	const mugTexture = new THREE.CanvasTexture(mugCanvas);

	const mugMat = new THREE.MeshStandardMaterial({
		map: mugTexture,
		roughness: 0.25,
		metalness: 0.02,
	});

	// Open-ended cylinder — ~30% larger than before
	const mugR1 = 0.045;
	const mugR2 = 0.038;
	const mugH = 0.1;
	const mug = new THREE.Mesh(
		new THREE.CylinderGeometry(mugR1, mugR2, mugH, 24, 1, true),
		mugMat,
	);
	mug.position.set(mugX, baseY + mugH / 2, mugZ);
	mug.castShadow = true;
	scene.add(mug);

	// Mug bottom
	const bottomMat = new THREE.MeshStandardMaterial({
		color: 0x1a1a1a,
		roughness: 0.3,
	});
	const bottom = new THREE.Mesh(
		new THREE.CircleGeometry(mugR2, 24),
		bottomMat,
	);
	bottom.rotation.x = Math.PI / 2;
	bottom.position.set(mugX, baseY + 0.001, mugZ);
	scene.add(bottom);

	// Coffee surface inside
	const coffeeMat = new THREE.MeshStandardMaterial({
		color: 0x3a1f0a,
		roughness: 0.2,
		metalness: 0.05,
	});
	const coffee = new THREE.Mesh(
		new THREE.CircleGeometry(mugR1 - 0.003, 24),
		coffeeMat,
	);
	coffee.rotation.x = -Math.PI / 2;
	coffee.position.set(mugX, baseY + mugH - 0.005, mugZ);
	scene.add(coffee);

	// Handle — black, scaled up
	const handleMat = new THREE.MeshStandardMaterial({
		color: 0x1a1a1a,
		roughness: 0.25,
	});
	const handle = new THREE.Mesh(
		new THREE.TorusGeometry(0.032, 0.007, 8, 16, Math.PI),
		handleMat,
	);
	handle.position.set(mugX + 0.06, baseY + mugH / 2, mugZ);
	handle.rotation.y = Math.PI / 2;
	scene.add(handle);

	// Steam wisps — adjusted for taller mug
	const steamMat = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.15,
		side: THREE.DoubleSide,
	});

	for (let i = 0; i < 3; i++) {
		const wisp = new THREE.Mesh(
			new THREE.PlaneGeometry(0.01, 0.04),
			steamMat.clone(),
		);
		wisp.name = "steam-wisp";
		const wispBaseY = baseY + mugH + 0.005;
		wisp.position.set(mugX + (i - 1) * 0.015, wispBaseY, mugZ);
		// Face toward camera (roughly 45deg from right)
		wisp.rotation.y = -0.7;
		wisp.userData = { baseY: wispBaseY, delay: i * 0.8 };
		scene.add(wisp);
	}
}

function buildDeskMouse(scene: THREE.Scene) {
	const baseY = DESK_HEIGHT + DESK_TOP_THICK / 2;
	// Position to the right of the keyboard
	const mouseX = 0.5;
	const mouseZ = DESK_Z + 0.2;

	const bodyMat = new THREE.MeshStandardMaterial({
		color: 0x1a1a1a,
		roughness: 0.3,
		metalness: 0.05,
	});

	// Main body — flat base
	const bodyW = 0.06;
	const bodyH = 0.02;
	const bodyD = 0.1;
	const body = new THREE.Mesh(
		new THREE.BoxGeometry(bodyW, bodyH, bodyD),
		bodyMat,
	);
	body.position.set(mouseX, baseY + bodyH / 2, mouseZ);
	body.castShadow = true;
	scene.add(body);

	// Rounded top shell — black
	const shellMat = new THREE.MeshStandardMaterial({
		color: 0x222222,
		roughness: 0.25,
		metalness: 0.05,
	});
	const shell = new THREE.Mesh(
		new THREE.SphereGeometry(0.034, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
		shellMat,
	);
	shell.scale.set(0.88, 0.55, 1.5);
	shell.position.set(mouseX, baseY + bodyH, mouseZ);
	shell.castShadow = true;
	scene.add(shell);

	// Mouse button divider line
	const dividerMat = new THREE.MeshStandardMaterial({
		color: 0x333333,
		roughness: 0.4,
	});
	const divider = new THREE.Mesh(
		new THREE.BoxGeometry(0.001, 0.006, 0.035),
		dividerMat,
	);
	divider.position.set(mouseX, baseY + bodyH + 0.006, mouseZ - 0.015);
	scene.add(divider);

	// Scroll wheel
	const wheelMat = new THREE.MeshStandardMaterial({
		color: 0x444444,
		roughness: 0.5,
		metalness: 0.1,
	});
	const wheel = new THREE.Mesh(
		new THREE.CylinderGeometry(0.005, 0.005, 0.012, 8),
		wheelMat,
	);
	wheel.position.set(mouseX, baseY + bodyH + 0.01, mouseZ - 0.018);
	wheel.rotation.z = Math.PI / 2;
	scene.add(wheel);

	// Mouse cable
	const cableMat = new THREE.MeshStandardMaterial({
		color: 0x1a1a1a,
		roughness: 0.8,
	});
	const cablePoints = [
		new THREE.Vector3(mouseX, baseY + bodyH / 2, mouseZ - bodyD / 2),
		new THREE.Vector3(mouseX - 0.06, baseY + 0.005, mouseZ - 0.12),
		new THREE.Vector3(mouseX - 0.15, baseY + 0.003, mouseZ - 0.2),
		new THREE.Vector3(0.15, baseY + 0.003, DESK_Z - 0.15),
	];
	const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
	const cableGeo = new THREE.TubeGeometry(cableCurve, 12, 0.004, 5, false);
	const cable = new THREE.Mesh(cableGeo, cableMat);
	scene.add(cable);
}

function buildPlant(scene: THREE.Scene) {
	const baseY = DESK_HEIGHT + DESK_TOP_THICK / 2;
	const plantX = -1.1;
	const plantZ = DESK_Z + 0.2;

	// Pot — terracotta
	const potMat = new THREE.MeshStandardMaterial({
		color: 0xc4613e,
		roughness: 0.7,
		metalness: 0,
	});

	// Pot body — tapered cylinder
	const pot = new THREE.Mesh(
		new THREE.CylinderGeometry(0.05, 0.04, 0.07, 12),
		potMat,
	);
	pot.position.set(plantX, baseY + 0.035, plantZ);
	pot.castShadow = true;
	scene.add(pot);

	// Pot rim
	const rim = new THREE.Mesh(
		new THREE.CylinderGeometry(0.055, 0.05, 0.01, 12),
		potMat,
	);
	rim.position.set(plantX, baseY + 0.07, plantZ);
	scene.add(rim);

	// Soil
	const soilMat = new THREE.MeshStandardMaterial({
		color: 0x3a2a1a,
		roughness: 0.95,
	});
	const soil = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), soilMat);
	soil.rotation.x = -Math.PI / 2;
	soil.position.set(plantX, baseY + 0.068, plantZ);
	scene.add(soil);

	// Stem
	const stemMat = new THREE.MeshStandardMaterial({
		color: 0x2d8b2d,
		roughness: 0.7,
	});
	const stem = new THREE.Mesh(
		new THREE.CylinderGeometry(0.004, 0.005, 0.15, 6),
		stemMat,
	);
	stem.position.set(plantX, baseY + 0.14, plantZ);
	scene.add(stem);

	// Leaves — simple elongated boxes at various angles
	const leafMat = new THREE.MeshStandardMaterial({
		color: 0x3da03d,
		roughness: 0.6,
		metalness: 0,
	});

	const leaves = [
		{ rx: 0, ry: 0, rz: -0.6, y: 0.18, xOff: 0.03 },
		{ rx: 0, ry: 1.2, rz: -0.5, y: 0.2, xOff: -0.025 },
		{ rx: 0, ry: 2.5, rz: -0.4, y: 0.22, xOff: 0.02 },
		{ rx: 0, ry: 3.8, rz: -0.7, y: 0.17, xOff: -0.03 },
		{ rx: 0, ry: 5.0, rz: -0.3, y: 0.21, xOff: 0.015 },
	];

	for (const l of leaves) {
		const leaf = new THREE.Mesh(
			new THREE.BoxGeometry(0.06, 0.003, 0.018),
			leafMat,
		);
		leaf.position.set(plantX + l.xOff, baseY + l.y, plantZ);
		leaf.rotation.set(l.rx, l.ry, l.rz);
		scene.add(leaf);
	}
}

function buildFloppyDisks(scene: THREE.Scene) {
	const baseY = DESK_HEIGHT + DESK_TOP_THICK / 2;

	const floppies = [
		{ x: -0.75, z: DESK_Z + 0.05, rot: 0.2, color: 0x2255aa },
		{ x: -0.7, z: DESK_Z + 0.08, rot: -0.1, color: 0xcc4444 },
	];

	for (const f of floppies) {
		const mat = new THREE.MeshStandardMaterial({
			color: f.color,
			roughness: 0.5,
			metalness: 0.05,
		});

		const disk = new THREE.Mesh(
			new THREE.BoxGeometry(0.09, 0.003, 0.09),
			mat,
		);
		disk.position.set(f.x, baseY + 0.002, f.z);
		disk.rotation.y = f.rot;
		disk.castShadow = true;
		scene.add(disk);

		// Metal slider on floppy
		const sliderMat = new THREE.MeshStandardMaterial({
			color: 0xc0c0c0,
			roughness: 0.2,
			metalness: 0.8,
		});
		const slider = new THREE.Mesh(
			new THREE.BoxGeometry(0.04, 0.004, 0.012),
			sliderMat,
		);
		slider.position.set(f.x, baseY + 0.004, f.z - 0.03);
		slider.rotation.y = f.rot;
		scene.add(slider);
	}
}

function buildWallDecorations(scene: THREE.Scene) {
	const halfD = ROOM_DEPTH / 2;

	// Picture frame 1 — above desk area on back wall
	buildPictureFrame(scene, -0.6, 2.2, -halfD + 0.01, 0.3, 0.38, -0.03, [
		"#e8734a",
		"#f5a623",
		"#ffd93d",
	]);

	// Picture frame 2
	buildPictureFrame(scene, 0.1, 2.3, -halfD + 0.01, 0.24, 0.3, 0.02, [
		"#59b4ff",
		"#c471ed",
		"#ff6b9d",
	]);

	// Bookshelf on left wall
	buildBookshelf(scene);
}

function buildBookshelf(scene: THREE.Scene) {
	const halfW = ROOM_WIDTH / 2;
	const halfD = ROOM_DEPTH / 2;

	// Floor-standing bookshelf in the left-back corner
	const shelfDepth = 0.3; // depth into room (x-axis, away from wall)
	const shelfWidth = 0.9; // width along back wall (z-axis)
	const shelfHeight = 2.0; // total height
	const shelfThick = 0.02;
	const numShelves = 5;

	const shelfX = -halfW + shelfDepth / 2 + 0.02;
	const shelfZ = -halfD + shelfWidth / 2 + 0.02;

	const woodMat = new THREE.MeshStandardMaterial({
		color: 0x5c4228,
		roughness: 0.6,
		metalness: 0.02,
	});

	const darkWoodMat = new THREE.MeshStandardMaterial({
		color: 0x4a3420,
		roughness: 0.65,
	});

	// Back panel — thin, against wall
	const backPanel = new THREE.Mesh(
		new THREE.BoxGeometry(0.01, shelfHeight, shelfWidth),
		darkWoodMat,
	);
	backPanel.position.set(-halfW + 0.005, shelfHeight / 2, shelfZ);
	scene.add(backPanel);

	// Two side panels
	const sidePanelGeo = new THREE.BoxGeometry(
		shelfDepth,
		shelfHeight,
		shelfThick,
	);

	const sideL = new THREE.Mesh(sidePanelGeo, woodMat);
	sideL.position.set(shelfX, shelfHeight / 2, shelfZ - shelfWidth / 2);
	sideL.castShadow = true;
	scene.add(sideL);

	const sideR = new THREE.Mesh(sidePanelGeo, woodMat);
	sideR.position.set(shelfX, shelfHeight / 2, shelfZ + shelfWidth / 2);
	sideR.castShadow = true;
	scene.add(sideR);

	// Top cap
	const topCap = new THREE.Mesh(
		new THREE.BoxGeometry(
			shelfDepth,
			shelfThick,
			shelfWidth + shelfThick * 2,
		),
		woodMat,
	);
	topCap.position.set(shelfX, shelfHeight, shelfZ);
	topCap.castShadow = true;
	scene.add(topCap);

	// Shelf planks (evenly spaced, including bottom)
	const shelfGeo = new THREE.BoxGeometry(shelfDepth, shelfThick, shelfWidth);
	const shelfHeights: number[] = [];
	for (let i = 0; i < numShelves; i++) {
		const h = (i / numShelves) * shelfHeight + 0.02;
		shelfHeights.push(h);
		const plank = new THREE.Mesh(shelfGeo, woodMat);
		plank.position.set(shelfX, h, shelfZ);
		plank.castShadow = true;
		plank.receiveShadow = true;
		scene.add(plank);
	}

	// Books — shared unit geometry scaled per book, pre-created materials
	const bookPalette = [
		0xc44444, 0x44aa44, 0x4477cc, 0xddaa33, 0x9944aa, 0xcc6633, 0x338888,
		0xaa3366, 0x5566cc, 0x88aa33, 0xdd5533, 0x336644, 0x7744aa, 0xcc8844,
		0x4488aa,
	];
	const bookMaterials = bookPalette.map(
		(c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }),
	);
	const bookGeo = new THREE.BoxGeometry(1, 1, 1);
	let colorIdx = 0;

	for (let s = 0; s < shelfHeights.length; s++) {
		const baseH = shelfHeights[s] + shelfThick / 2;
		const ceilingH =
			s < shelfHeights.length - 1 ? shelfHeights[s + 1] : shelfHeight;
		const space = ceilingH - shelfHeights[s] - shelfThick;
		const maxBookH = space - 0.01;
		if (maxBookH < 0.04) continue;

		let z = shelfZ - shelfWidth / 2 + 0.03;
		const endZ = shelfZ + shelfWidth / 2 - 0.03;
		const bookD = shelfDepth - 0.06;

		while (z < endZ) {
			const bookThick = 0.018 + Math.random() * 0.022;
			const bookH = maxBookH * (0.55 + Math.random() * 0.45);

			const book = new THREE.Mesh(
				bookGeo,
				bookMaterials[colorIdx % bookMaterials.length],
			);
			colorIdx++;

			book.scale.set(bookD, bookH, bookThick);
			book.position.set(
				shelfX + 0.02,
				baseH + bookH / 2,
				z + bookThick / 2,
			);
			book.rotation.z = (Math.random() - 0.5) * 0.05;
			scene.add(book);

			z += bookThick + 0.003;
			if (Math.random() < 0.12) z += 0.025;
		}
	}
}

function buildPictureFrame(
	scene: THREE.Scene,
	x: number,
	y: number,
	z: number,
	w: number,
	h: number,
	rotation: number,
	gradientColors: string[],
) {
	// Frame border
	const frameMat = new THREE.MeshStandardMaterial({
		color: 0x5a4530,
		roughness: 0.6,
		metalness: 0.05,
	});

	const frameThick = 0.025;
	const frameGroup = new THREE.Group();
	frameGroup.position.set(x, y, z);
	frameGroup.rotation.z = rotation;

	// Top
	frameGroup.add(
		createFrameEdge(
			0,
			h / 2 + frameThick / 2,
			w + frameThick * 2,
			frameThick,
			frameMat,
		),
	);
	// Bottom
	frameGroup.add(
		createFrameEdge(
			0,
			-h / 2 - frameThick / 2,
			w + frameThick * 2,
			frameThick,
			frameMat,
		),
	);
	// Left
	frameGroup.add(
		createFrameEdge(-w / 2 - frameThick / 2, 0, frameThick, h, frameMat),
	);
	// Right
	frameGroup.add(
		createFrameEdge(w / 2 + frameThick / 2, 0, frameThick, h, frameMat),
	);

	// Picture content — gradient canvas
	const picCanvas = document.createElement("canvas");
	picCanvas.width = 128;
	picCanvas.height = 160;
	const pctx = picCanvas.getContext("2d")!;
	const grad = pctx.createLinearGradient(0, 0, 128, 160);
	gradientColors.forEach((c, i) => {
		grad.addColorStop(i / (gradientColors.length - 1), c);
	});
	pctx.fillStyle = grad;
	pctx.fillRect(0, 0, 128, 160);

	const picTexture = new THREE.CanvasTexture(picCanvas);
	const picMat = new THREE.MeshBasicMaterial({ map: picTexture });
	const pic = new THREE.Mesh(new THREE.PlaneGeometry(w, h), picMat);
	pic.position.z = 0.001;
	frameGroup.add(pic);

	scene.add(frameGroup);
}

function createFrameEdge(
	x: number,
	y: number,
	w: number,
	h: number,
	mat: THREE.Material,
): THREE.Mesh {
	// 3D frame edges with actual depth
	const edge = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), mat);
	edge.position.set(x, y, 0.01);
	edge.castShadow = true;
	return edge;
}

function buildChair(scene: THREE.Scene) {
	const chairX = 0.15;
	const chairZ = DESK_Z + 0.9;

	// Chair base — cylinder
	const baseMat = new THREE.MeshStandardMaterial({
		color: 0x2a2a2a,
		roughness: 0.5,
		metalness: 0.3,
	});

	// Central column — taller for realistic seat height (~0.45m)
	const column = new THREE.Mesh(
		new THREE.CylinderGeometry(0.02, 0.025, 0.42, 8),
		baseMat,
	);
	column.position.set(chairX, 0.22, chairZ);
	column.castShadow = true;
	scene.add(column);

	// Star base — 5 legs
	const legMat = new THREE.MeshStandardMaterial({
		color: 0x333333,
		roughness: 0.4,
		metalness: 0.4,
	});
	for (let i = 0; i < 5; i++) {
		const angle = (i / 5) * Math.PI * 2;
		const leg = new THREE.Mesh(
			new THREE.BoxGeometry(0.015, 0.015, 0.22),
			legMat,
		);
		leg.position.set(
			chairX + Math.sin(angle) * 0.11,
			0.01,
			chairZ + Math.cos(angle) * 0.11,
		);
		leg.rotation.y = angle;
		scene.add(leg);

		// Caster wheel
		const wheel = new THREE.Mesh(
			new THREE.SphereGeometry(0.014, 8, 8),
			baseMat,
		);
		wheel.position.set(
			chairX + Math.sin(angle) * 0.21,
			0.014,
			chairZ + Math.cos(angle) * 0.21,
		);
		scene.add(wheel);
	}

	// Seat cushion — raised to ~0.45m
	const seatMat = new THREE.MeshStandardMaterial({
		color: 0x8b3a62,
		roughness: 0.75,
		metalness: 0,
	});
	const seat = new THREE.Mesh(
		new THREE.BoxGeometry(0.42, 0.06, 0.4),
		seatMat,
	);
	seat.position.set(chairX, 0.46, chairZ);
	seat.castShadow = true;
	scene.add(seat);

	// Backrest — taller and repositioned
	const backMat = new THREE.MeshStandardMaterial({
		color: 0x7a2d55,
		roughness: 0.75,
		metalness: 0,
	});
	const back = new THREE.Mesh(
		new THREE.BoxGeometry(0.4, 0.45, 0.05),
		backMat,
	);
	back.position.set(chairX, 0.72, chairZ + 0.18);
	back.rotation.x = -0.1;
	back.castShadow = true;
	scene.add(back);
}

function buildFloorPlant(scene: THREE.Scene) {
	// Large floor plant near the window
	const plantX = 1.8;
	const plantZ = -1.2;

	// Large pot — dark ceramic
	const potMat = new THREE.MeshStandardMaterial({
		color: 0x2a2a2a,
		roughness: 0.6,
		metalness: 0.05,
	});

	const pot = new THREE.Mesh(
		new THREE.CylinderGeometry(0.15, 0.12, 0.35, 16),
		potMat,
	);
	pot.position.set(plantX, 0.175, plantZ);
	pot.castShadow = true;
	pot.receiveShadow = true;
	scene.add(pot);

	// Pot rim
	const rim = new THREE.Mesh(
		new THREE.CylinderGeometry(0.17, 0.15, 0.03, 16),
		potMat,
	);
	rim.position.set(plantX, 0.36, plantZ);
	scene.add(rim);

	// Soil
	const soilMat = new THREE.MeshStandardMaterial({
		color: 0x2a1e12,
		roughness: 0.95,
	});
	const soil = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), soilMat);
	soil.rotation.x = -Math.PI / 2;
	soil.position.set(plantX, 0.355, plantZ);
	scene.add(soil);

	// Main stem
	const stemMat = new THREE.MeshStandardMaterial({
		color: 0x2d6b2d,
		roughness: 0.7,
	});
	const stem = new THREE.Mesh(
		new THREE.CylinderGeometry(0.012, 0.015, 0.7, 6),
		stemMat,
	);
	stem.position.set(plantX, 0.72, plantZ);
	scene.add(stem);

	// Large tropical-style leaves radiating outward
	const leafMat = new THREE.MeshStandardMaterial({
		color: 0x2d7a2d,
		roughness: 0.6,
		side: THREE.DoubleSide,
	});

	const darkLeafMat = new THREE.MeshStandardMaterial({
		color: 0x1a5c1a,
		roughness: 0.6,
		side: THREE.DoubleSide,
	});

	const leafData = [
		{ angle: 0, tilt: -0.5, h: 1.05, len: 0.35, mat: leafMat },
		{ angle: 0.9, tilt: -0.7, h: 1.0, len: 0.3, mat: darkLeafMat },
		{ angle: 1.8, tilt: -0.4, h: 1.1, len: 0.32, mat: leafMat },
		{ angle: 2.6, tilt: -0.6, h: 0.95, len: 0.28, mat: darkLeafMat },
		{ angle: 3.5, tilt: -0.5, h: 1.08, len: 0.34, mat: leafMat },
		{ angle: 4.3, tilt: -0.8, h: 0.92, len: 0.26, mat: darkLeafMat },
		{ angle: 5.2, tilt: -0.45, h: 1.02, len: 0.3, mat: leafMat },
		{ angle: 5.8, tilt: -0.65, h: 0.98, len: 0.28, mat: darkLeafMat },
	];

	for (const l of leafData) {
		const leaf = new THREE.Mesh(
			new THREE.PlaneGeometry(0.08, l.len),
			l.mat,
		);
		const lx = plantX + Math.sin(l.angle) * 0.06;
		const lz = plantZ + Math.cos(l.angle) * 0.06;
		leaf.position.set(lx, l.h, lz);
		leaf.rotation.set(l.tilt, l.angle, 0);
		leaf.castShadow = true;
		scene.add(leaf);
	}
}

function setupLights(scene: THREE.Scene) {
	// Ambient — strong fill
	const ambient = new THREE.AmbientLight(0xbbbbee, 0.9);
	scene.add(ambient);

	// Ceiling light — warm overhead
	const ceilingLight = new THREE.PointLight(0xffe4c4, 1.8, 10);
	ceilingLight.position.set(0, 2.8, -0.5);
	ceilingLight.castShadow = true;
	ceilingLight.shadow.mapSize.width = 512;
	ceilingLight.shadow.mapSize.height = 512;
	ceilingLight.shadow.radius = 8;
	scene.add(ceilingLight);

	// Desk lamp — warm point light
	const lampLight = new THREE.PointLight(0xffd080, 1.2, 4);
	lampLight.position.set(-0.9, DESK_HEIGHT + 0.45, DESK_Z - 0.1);
	lampLight.castShadow = true;
	lampLight.shadow.mapSize.width = 512;
	lampLight.shadow.mapSize.height = 512;
	lampLight.shadow.radius = 4;
	scene.add(lampLight);

	// Monitor glow — green tinted
	const monitorGlow = new THREE.PointLight(MONITOR_GREEN, 0.25, 2.5);
	monitorGlow.position.set(0, DESK_HEIGHT + 0.5, DESK_Z + 0.3);
	scene.add(monitorGlow);

	// Window light — cool moonlit night
	const windowLight = new THREE.RectAreaLight(0x3344aa, 0.3, 1.4, 1.3);
	windowLight.position.set(1.2, 1.8, -ROOM_DEPTH / 2 + 0.1);
	windowLight.lookAt(0, 1.5, 0);
	scene.add(windowLight);

	// Subtle fill from behind camera
	const fillLight = new THREE.PointLight(0x443355, 0.15, 8);
	fillLight.position.set(0, 2.5, 3);
	scene.add(fillLight);
}
