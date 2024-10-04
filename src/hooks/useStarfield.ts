// src/hooks/useStarfield.ts
import {useEffect, useRef} from "react";
import * as THREE from "three";

const useStarfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Create a starfield background
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
      });

      const starsVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starsVertices, 3)
      );
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);

      // Create a group to hold all the books
      const booksGroup = new THREE.Group();
      scene.add(booksGroup);

      // Function to create a single book
      const createBook = (x: number, y: number, z: number, color: number) => {
        const bookGeometry = new THREE.BoxGeometry(24, 36, 3.6); // Doubled the size of the books
        const bookMaterial = new THREE.MeshPhongMaterial({color: color});
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.position.set(x, y, z);
        book.rotation.y = (Math.random() * Math.PI) / 4 - Math.PI / 8;
        return book;
      };

      // Create multiple books
      const bookColors = [0x1abc9c, 0x3498db, 0x9b59b6, 0xe74c3c, 0xf1c40f];
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 320 - 160; // Doubled the range to accommodate larger books
        const y = Math.random() * 320 - 160; // Doubled the range to accommodate larger books
        const z = Math.random() * 320 - 160; // Doubled the range to accommodate larger books
        const color = bookColors[Math.floor(Math.random() * bookColors.length)];
        const book = createBook(x, y, z, color);
        booksGroup.add(book);
      }

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(50, 100, 50); // Increased light position to match larger scene
      scene.add(pointLight);

      camera.position.z = 400; // Doubled camera distance to accommodate larger books

      const animate = () => {
        requestAnimationFrame(animate);
        booksGroup.rotation.x += 0.001;
        booksGroup.rotation.y += 0.002;
        starField.rotation.y += 0.0002;
        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return canvasRef;
};

export default useStarfield;
