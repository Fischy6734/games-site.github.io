/**
 * Visual Rocket Mod
 * Adds visual effects and styling to the rocket
 */

(function() {
	"use strict";
	
	const VISUAL_EFFECTS_ENABLED = true;
	const ROCKET_TRAIL_ENABLED = true;
	const ROCKET_GLOW_ENABLED = true;
	
	function initVisualMods() {
		if (typeof window.cr_inst === 'undefined') {
			console.log('[Visual Rocket Mod] Waiting for game to initialize...');
			setTimeout(initVisualMods, 100);
			return;
		}
		
		console.log('[Visual Rocket Mod] Game initialized, applying visual effects...');
		
		// Create a canvas for visual effects overlay
		createEffectsCanvas();
		
		// Monitor and enhance rocket visuals
		monitorRocketVisuals();
	}
	
	function createEffectsCanvas() {
		// Get the game canvas
		const gameCanvas = document.querySelector('canvas');
		if (!gameCanvas) {
			console.log('[Visual Rocket Mod] Game canvas not found');
			return;
		}
		
		// Create overlay canvas for effects
		const effectsCanvas = document.createElement('canvas');
		effectsCanvas.id = 'rocket-effects-canvas';
		effectsCanvas.width = gameCanvas.width;
		effectsCanvas.height = gameCanvas.height;
		effectsCanvas.style.position = 'absolute';
		effectsCanvas.style.top = gameCanvas.style.top || '0';
		effectsCanvas.style.left = gameCanvas.style.left || '0';
		effectsCanvas.style.pointerEvents = 'none';
		effectsCanvas.style.zIndex = '10';
		
		gameCanvas.parentNode.insertBefore(effectsCanvas, gameCanvas.nextSibling);
		
		const ctx = effectsCanvas.getContext('2d');
		window.rocketEffectsCtx = ctx;
		window.rocketEffectsCanvas = effectsCanvas;
		
		console.log('[Visual Rocket Mod] Effects canvas created');
	}
	
	function monitorRocketVisuals() {
		if (!VISUAL_EFFECTS_ENABLED) return;
		
		setInterval(function() {
			if (window.cr_inst && Array.isArray(window.cr_inst)) {
				const ctx = window.rocketEffectsCtx;
				const canvas = window.rocketEffectsCanvas;
				
				if (ctx && canvas) {
					// Clear previous frame
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					
					// Draw effects for each rocket
					window.cr_inst.forEach(function(inst) {
						if (inst && isRocketObject(inst)) {
							// Draw rocket trail
							if (ROCKET_TRAIL_ENABLED) {
								drawRocketTrail(ctx, inst);
							}
							
							// Draw rocket glow
							if (ROCKET_GLOW_ENABLED) {
								drawRocketGlow(ctx, inst);
							}
						}
					});
				}
			}
		}, 16); // ~60 FPS
	}
	
	function drawRocketTrail(ctx, inst) {
		// Get rocket position
		const x = inst.x || 0;
		const y = inst.y || 0;
		
		// Get velocity for trail direction
		const vx = inst.vx || 0;
		const vy = inst.vy || 0;
		const speed = Math.sqrt(vx * vx + vy * vy);
		
		if (speed < 1) return; // No trail if barely moving
		
		// Trail parameters
		const trailLength = Math.min(speed * 3, 50);
		const trailWidth = 6;
		
		// Normalize velocity for direction
		const dirX = speed > 0 ? -vx / speed : 0;
		const dirY = speed > 0 ? -vy / speed : 0;
		
		// Draw trail gradient
		const gradient = ctx.createLinearGradient(
			x, y,
			x + dirX * trailLength, y + dirY * trailLength
		);
		
		gradient.addColorStop(0, 'rgba(255, 200, 0, 0.8)');  // Yellow
		gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.4)'); // Orange
		gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');       // Red (transparent)
		
		ctx.strokeStyle = gradient;
		ctx.lineWidth = trailWidth;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + dirX * trailLength, y + dirY * trailLength);
		ctx.stroke();
	}
	
	function drawRocketGlow(ctx, inst) {
		const x = inst.x || 0;
		const y = inst.y || 0;
		const vx = inst.vx || 0;
		const vy = inst.vy || 0;
		const speed = Math.sqrt(vx * vx + vy * vy);
		
		// Glow intensity based on speed
		const glowSize = 20 + (speed / 10) * 15;
		const glowAlpha = Math.min(speed / 100, 0.8);
		
		// Create radial gradient for glow
		const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
		glowGradient.addColorStop(0, `rgba(255, 200, 0, ${glowAlpha})`);
		glowGradient.addColorStop(0.5, `rgba(255, 100, 0, ${glowAlpha * 0.5})`);
		glowGradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
		
		ctx.fillStyle = glowGradient;
		ctx.beginPath();
		ctx.arc(x, y, glowSize, 0, Math.PI * 2);
		ctx.fill();
	}
	
	function isRocketObject(inst) {
		if (!inst) return false;
		
		const objType = inst.objectType || '';
		const objClass = inst.type ? inst.type.name : '';
		const instName = inst.instName || inst.name || '';
		
		const rocketPatterns = [
			/rocket/i,
			/projectile/i,
			/bullet/i,
			/missile/i,
			/launch/i
		];
		
		return rocketPatterns.some(pattern => 
			pattern.test(objType) || 
			pattern.test(objClass) || 
			pattern.test(instName)
		);
	}
	
	// Initialize on page load
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initVisualMods);
	} else {
		setTimeout(initVisualMods, 500);
	}
	
	console.log('[Visual Rocket Mod] Loaded. Visual effects enabled:', VISUAL_EFFECTS_ENABLED);
})();
