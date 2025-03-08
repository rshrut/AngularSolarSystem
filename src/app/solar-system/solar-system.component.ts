import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, NgZone } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-solar-system',
  imports: [],
  templateUrl: './solar-system.component.html',
  styleUrl: './solar-system.component.css'
})
export class SolarSystemComponent implements OnInit{
  @ViewChild('rendererContainer', { static: true}) container!: ElementRef; 

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  sun!: THREE.Mesh;
  planets: { mesh: THREE.Mesh, distance: number, speed: number}[] = [];
  textureLoader = new THREE.TextureLoader();

  constructor(@Inject(PLATFORM_ID) private platformId: object, private ngZone: NgZone) {}


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScene();
      this.ngZone.runOutsideAngular(() => this.animate());
      this.animate();
    } else {
      console.warn('Skipping Three.js initialization (SSR detected)');
    }
  }

  initScene(){
    // Creating scene, camera, renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000); // Increase far plane
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.nativeElement.appendChild(this.renderer.domElement);
  
    // Move the camera further back
    this.camera.position.set(0, 20, 400); // Adjusted position
  
    // Creating sun (Larger for visibility)
    const sunTexture = this.textureLoader.load('../../assets/textures/sun.jpg');
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    this.sun = new THREE.Mesh(new THREE.SphereGeometry(40, 64, 64), sunMaterial);
    this.scene.add(this.sun);
  
    // Add planets with reduced distance for visibility
    this.addPlanet(80, 3, 'mercury.jpg', 1.05);
    this.addPlanet(100, 4, 'venus.jpg', 1.04);
    this.addPlanet(120, 5, 'earth.jpg', 1.03);
    this.addPlanet(140, 4, 'mars.jpg', 1.025);
    this.addPlanet(170, 10, 'jupiter.jpg', 1.15);
    this.addPlanet(200, 8, 'saturn.jpg', 1.017);
    this.addPlanet(230, 7, 'uranus.jpg', 1.009);
    this.addPlanet(260, 6, 'neptune.jpg', 1.007);
  }
  
  addPlanet(distance: number, size: number, texture: string, speed: number){
    const planetTexture = this.textureLoader.load(`../../assets/textures/${texture}`);
    const planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
    const planet = new THREE.Mesh(new THREE.SphereGeometry(size * 2, 64, 64), planetMaterial);
    planet.position.set(distance, 0, 0);
    this.scene.add(planet);
    this.planets.push({ mesh: planet, distance, speed });
  }
  

  animate(){
    requestAnimationFrame(() => this.animate());
    this.sun.rotation.y += 0.008;
    const time = Date.now() * 0.0005;
    this.planets.forEach(planet => {
      planet.mesh.position.x = Math.cos(time * planet.speed) * planet.distance;
      planet.mesh.position.z = Math.sin(time * planet.speed) * planet.distance;
    })

    this.renderer.render(this.scene, this.camera);
  }
}


