// The 3D scene of the photo tour: the model from haus-tannheim-private plus one
// camera marker per photo. Clicking a marker flies the camera to the spot the
// photo was taken from; the component then lays the photo over that view.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import modellUrl from '../assets/rundgang/haus-tannheim-3d.glb?url'
import raeume from '../assets/rundgang/raeume.json'
import { inSzene, blickVektor, augenhoehe, geschoss } from './tour.js'

const UEBERSICHT = { pos: new THREE.Vector3(-19, 15, 22), ziel: new THREE.Vector3(0, -1, 0), fov: 40 }
const FOTO_FOV = 70 // vertical field of view of the wide-angle shots, roughly
const FLUG_MS = 1100
const FARBE = new THREE.Color(0xb56f4c) // clay-500
const FARBE_HOVER = new THREE.Color(0x2e4729) // forest-700
// model groups that hide while a station is shown, so the camera's way in stays visible
const VERDECKT = { Obergeschoss: ['Dach'], Erdgeschoss: ['Dach', 'EG'] }

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

function marker(material) {
  // a small pyramid: apex at the camera, opening in the viewing direction (+Z after lookAt)
  const cone = new THREE.ConeGeometry(0.28, 0.6, 4, 1, true)
  cone.rotateX(-Math.PI / 2)
  cone.translate(0, 0, 0.3)
  cone.rotateZ(Math.PI / 4)
  const g = new THREE.Group()
  g.add(new THREE.Mesh(cone, material))
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), material))
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), new THREE.MeshBasicMaterial({ visible: false }))
  g.add(hit)
  return { g, hit }
}

export async function erstelleSzene(el, stationen, { onHover = () => {} } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // throws without WebGL
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  el.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(UEBERSICHT.fov, 1, 0.05, 500)
  camera.position.copy(UEBERSICHT.pos)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.copy(UEBERSICHT.ziel)
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8170, 1.6))
  const sun = new THREE.DirectionalLight(0xffffff, 1.6)
  sun.position.set(-15, 25, -20)
  scene.add(sun)

  const gltf = await new GLTFLoader().loadAsync(modellUrl)
  const gruppen = {}
  gltf.scene.position.set(-raeume.breite / 2, 0, raeume.tiefe / 2)
  gltf.scene.traverse((o) => o.isMesh && (gruppen[o.name.split('__')[0]] ||= []).push(o))
  scene.add(gltf.scene)

  // markers draw through walls and roof, so every standpoint is findable from outside
  const marken = stationen.map((s) => {
    const material = new THREE.MeshBasicMaterial({ color: FARBE, transparent: true, opacity: 0.9, depthTest: false })
    const { g, hit } = marker(material)
    const pos = new THREE.Vector3(...inSzene(s.pos, augenhoehe(s)))
    const blick = new THREE.Vector3(...blickVektor(s))
    g.position.copy(pos)
    g.lookAt(pos.clone().add(blick))
    g.renderOrder = 10
    scene.add(g)
    return { g, hit, material, pos, blick }
  })

  // which model groups the visitor switched on; stations hide some on top of that
  const gewuenscht = { Dach: true, EG: true, GG: true, Gelaende: true }
  let verdeckt = []
  const sichtbarkeit = () => {
    for (const [name, meshes] of Object.entries(gruppen)) {
      const an = gewuenscht[name] !== false && !verdeckt.includes(name)
      meshes.forEach((m) => (m.visible = an))
    }
  }

  // camera flight: position, look-at point and fov eased together
  let flug = null
  const ziel = UEBERSICHT.ziel.clone()
  function fliege(pos, blickZiel, fov) {
    if (controls.enabled) ziel.copy(controls.target) // the visitor may have panned
    flug?.fertig() // a flight cut short still settles its promise
    return new Promise((fertig) => {
      controls.enabled = false
      flug = { t0: performance.now(), von: [camera.position.clone(), ziel.clone(), camera.fov], nach: [pos, blickZiel, fov], fertig }
    })
  }
  function fliegeSchritt(now) {
    const t = Math.min(1, (now - flug.t0) / FLUG_MS)
    const k = ease(t)
    const [p0, z0, f0] = flug.von
    const [p1, z1, f1] = flug.nach
    camera.position.lerpVectors(p0, p1, k)
    ziel.lerpVectors(z0, z1, k)
    camera.fov = f0 + (f1 - f0) * k
    camera.updateProjectionMatrix()
    camera.lookAt(ziel)
    if (t === 1) {
      const { fertig } = flug
      flug = null
      fertig()
    }
  }

  let aktiv = -1
  async function zeige(i) {
    const s = stationen[i]
    const m = marken[i]
    aktiv = i
    marken.forEach((k) => (k.g.visible = false)) // seen through walls they clutter the view from inside
    verdeckt = VERDECKT[geschoss(s)] ?? []
    sichtbarkeit()
    await fliege(m.pos.clone(), m.pos.clone().add(m.blick.clone().multiplyScalar(2)), FOTO_FOV)
    return aktiv === i // false when another station or the overview took over mid-flight
  }
  async function uebersicht() {
    aktiv = -1
    marken.forEach((k) => (k.g.visible = true))
    verdeckt = []
    sichtbarkeit()
    await fliege(UEBERSICHT.pos.clone(), UEBERSICHT.ziel.clone(), UEBERSICHT.fov)
    if (aktiv !== -1) return
    controls.target.copy(UEBERSICHT.ziel)
    controls.enabled = true
  }
  function setzeGruppe(name, an) {
    gewuenscht[name] = an
    sichtbarkeit()
  }

  // hover and click on markers; a drag that ends on a marker is no click
  const ray = new THREE.Raycaster()
  const zeiger = new THREE.Vector2()
  let hover = -1
  let unten = null
  const treffer = (e) => {
    const r = renderer.domElement.getBoundingClientRect()
    zeiger.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(zeiger, camera)
    const hits = ray.intersectObjects(marken.filter((m) => m.g.visible).map((m) => m.hit))
    return hits.length ? marken.findIndex((m) => m.hit === hits[0].object) : -1
  }
  const onMove = (e) => {
    const i = aktiv === -1 ? treffer(e) : -1
    if (i !== hover) {
      if (hover >= 0) marken[hover].material.color.copy(FARBE)
      if (i >= 0) marken[i].material.color.copy(FARBE_HOVER)
      hover = i
      renderer.domElement.style.cursor = i >= 0 ? 'pointer' : ''
    }
    onHover(i, e.clientX, e.clientY)
  }
  const onDown = (e) => (unten = [e.clientX, e.clientY])
  let onPick = () => {}
  const onUp = (e) => {
    if (!unten || Math.hypot(e.clientX - unten[0], e.clientY - unten[1]) > 6) return
    const i = aktiv === -1 ? treffer(e) : -1
    if (i >= 0) onPick(i)
  }
  const canvas = renderer.domElement
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointerup', onUp)

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = el
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(el)
  resize()
  renderer.setAnimationLoop((now) => {
    if (flug) fliegeSchritt(now)
    else if (controls.enabled) controls.update()
    renderer.render(scene, camera)
  })

  return {
    zeige,
    uebersicht,
    setzeGruppe,
    beiAuswahl: (fn) => (onPick = fn),
    dispose() {
      renderer.setAnimationLoop(null)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      canvas.remove()
    },
  }
}
