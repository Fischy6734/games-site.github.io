/**
 * Faster Rocket Mod
 * Increases rocket projectile speed by 1.5x
 * 
 * This mod hooks into the Construct 2 runtime to modify
 * rocket velocity values during gameplay.
 */

(function() {
	"use strict";
	
	// Configuration
	const SPEED_MULTIPLIER = 1.5; // 50% faster
	const MOD_ENABLED = true;
	
	// Wait for the game runtime to initialize
	function initFasterRocketMod() {
		// Check if cr_inst is available (Construct 2 runtime instances)
		if (typeof window.cr_inst === 'undefined') {
			console.log('[Faster Rocket Mod] Waiting for game to initialize...');
			setTimeout(initFasterRocketMod, 100);
			return;
		}
		
		console.log('[Faster Rocket Mod] Game initialized, activating mod...');
		
		// Patch the runtime's setVelocity methods
		patchVelocityMethods();
		
		// Monitor and modify rocket objects
		monitorGameObjects();
	}
	
	function patchVelocityMethods() {
		// Hook into instance velocity setting
		if (window.cr_getInstanceFromUID) {
			const originalGetInstance = window.cr_getInstanceFromUID;
			
			window.cr_getInstanceFromUID = function(uid) {
				const inst = originalGetInstance.call(this, uid);
				if (inst) {
					// Patch velocity property
					if (!inst._modPatched) {
						patchInstance(inst);
						inst._modPatched = true;
					}
				}
				return inst;
			};
		}
	}
	
	function patchInstance(inst) {
		// Store original velocity values
		if (inst.vx !== undefined) {
			const originalVx = inst.vx;
			Object.defineProperty(inst, 'vx', {
				get() {
					return this._vx || 0;
				},
				set(value) {
					// Increase velocity for rocket-like objects
					if (isRocketObject(inst)) {
						this._vx = value * SPEED_MULTIPLIER;
						console.log('[Faster Rocket Mod] Rocket X velocity modified:', value, '->', this._vx);
					} else {
						this._vx = value;
					}
				}
			});
		}
		
		if (inst.vy !== undefined) {
			Object.defineProperty(inst, 'vy', {
				get() {
					return this._vy || 0;
				},
				set(value) {
					// Increase velocity for rocket-like objects
					if (isRocketObject(inst)) {
						this._vy = value * SPEED_MULTIPLIER;
						console.log('[Faster Rocket Mod] Rocket Y velocity modified:', value, '->', this._vy);
					} else {
						this._vy = value;
					}
				}
			});
		}
	}
	
	function isRocketObject(inst) {
		// Check if this is a rocket/projectile object
		if (!inst) return false;
		
		// Look for rocket-related identifiers
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
	
	function monitorGameObjects() {
		if (!MOD_ENABLED) return;
		
		// Continuously monitor and modify velocities
		setInterval(function() {
			if (window.cr_inst && Array.isArray(window.cr_inst)) {
				window.cr_inst.forEach(function(inst) {
					if (inst && isRocketObject(inst)) {
						// Apply speed multiplier to current velocities
						if (inst.vx && inst.vx !== 0) {
							// Multiplier is already applied via setter
						}
						if (inst.vy && inst.vy !== 0) {
							// Multiplier is already applied via setter
						}
					}
				});
			}
		}, 50);
	}
	
	// Alternative approach: Patch the Construct 2 physics/movement system
	function patchMovementSystem() {
		if (window.cr_getC2Runtime && typeof window.cr_getC2Runtime === 'function') {
			const runtime = window.cr_getC2Runtime();
			
			if (runtime && runtime.getObjectsCollectionByType) {
				// Intercept object updates
				const originalUpdate = runtime.updateInstanceVariables;
				if (originalUpdate) {
					runtime.updateInstanceVariables = function() {
						originalUpdate.call(this);
						
						// Modify rocket velocities after update
						const objTypes = runtime.types;
						for (let type in objTypes) {
							if (objTypes[type].plugin && objTypes[type].plugin.name) {
								const typeName = objTypes[type].plugin.name;
								if (/rocket|projectile/i.test(typeName)) {
									const instances = objTypes[type].instances;
									instances.forEach(inst => {
										if (inst.vx) inst.vx *= SPEED_MULTIPLIER;
										if (inst.vy) inst.vy *= SPEED_MULTIPLIER;
									});
								}
							}
						}
					};
				}
			}
		}
	}
	
	// Start the mod when the page loads
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initFasterRocketMod);
	} else {
		// DOM is already loaded
		setTimeout(initFasterRocketMod, 500);
	}
	
	// Log mod status
	console.log('[Faster Rocket Mod] Loaded. Speed multiplier:', SPEED_MULTIPLIER + 'x');
})();
