import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

/**
 * Renders a sequence of images or a fallback generative canvas keyframe animation
 * based on scroll progress.
 * 
 * @param {Object} props
 * @param {number} props.frameCount - Total number of frames in the sequence (e.g. 300)
 * @param {string} props.pathTemplate - Path to images, e.g. "/assets/frames/frame_{index}.jpg"
 * @param {React.RefObject} props.scrollContainerRef - The container element driving the scroll
 */
const ScrollFrameSequence = ({ frameCount = 100, pathTemplate, scrollContainerRef }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress (0-1) to frame index (0 - frameCount-1)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    // Attempt to preload images if pathTemplate is provided
    if (!pathTemplate) {
      setImagesLoaded(false);
      return;
    }

    const loadImages = async () => {
      const proms = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const src = pathTemplate.replace('{index}', i.toString().padStart(4, '0'));
        proms.push(
          new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => reject(src);
            img.src = src;
          })
        );
      }

      try {
        const loaded = await Promise.all(proms);
        setImages(loaded);
        setImagesLoaded(true);
      } catch (err) {
        console.warn("Frame sequence images not found, falling back to generative canvas.", err);
        setImagesLoaded(false);
      }
    };

    loadImages();
  }, [frameCount, pathTemplate]);

  // Render loop
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      // Get current frame index (interpolated)
      const currentFrame = Math.floor(frameIndex.get() || 0);

      // Set canvas size to window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      if (imagesLoaded && images[currentFrame]) {
        // Draw image frame
        const img = images[currentFrame];
        // Cover fit
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        // Fallback Generative Animation (Product Placeholder)
        // Draw a "3D" grid or particle field that rotates
        ctx.fillStyle = '#0f172a'; // Dark slate bg
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const time = currentFrame / frameCount; // 0 to 1
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Draw a rotating Earth/Field representation
        // Simple 3D point projection for effect
        const numPoints = 200;
        const radius = 300;
        
        ctx.fillStyle = '#4ade80'; // Green dots
        
        for (let i = 0; i < numPoints; i++) {
          const theta = (i / numPoints) * Math.PI * 2;
          const phi = (i / numPoints) * Math.PI * 10 + (time * 10); // Rotate with scroll
          
          const x3 = radius * Math.sin(theta) * Math.cos(phi);
          const y3 = radius * Math.sin(theta) * Math.sin(phi);
          const z3 = radius * Math.cos(theta);
          
          // Project
          const perspective = 1000 / (1000 + z3 - (time * 500)); 
          const x2 = x3 * perspective;
          const y2 = y3 * perspective;
          const size = 3 * perspective;
          
          // Color based on "height"
          const alpha = (z3 + radius) / (2 * radius);
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x2, y2, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw HUD lines
        ctx.strokeStyle = `rgba(74, 222, 128, ${0.2 + time * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-100 - (time * 100), 0);
        ctx.lineTo(100 + (time * 100), 0);
        ctx.stroke();

        ctx.restore();

        // Overlay Text for section context if needed (debug)
        // ctx.fillStyle = 'white';
        // ctx.fillText(`Frame: ${currentFrame}`, 10, 50);
      }
      
      requestAnimationFrame(render);
    };

    const unsubscribe = frameIndex.on("change", render);
    render(); // Initial draw

    return () => unsubscribe();
  }, [imagesLoaded, images, frameIndex]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full object-cover -z-10"
    />
  );
};

export default ScrollFrameSequence;
