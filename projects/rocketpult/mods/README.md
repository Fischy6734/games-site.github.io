# Rocketpult Mods

This directory contains mods and modifications for the Rocketpult game.

## Faster Rocket Mod

**File:** `faster-rocket.js`

### Description
Increases the rocket projectile speed by **1.5x** (50% faster), making the game more challenging and exciting.

### Features
- Automatically detects rocket/projectile objects in the game
- Applies 1.5x speed multiplier to all rocket velocities
- Hooks into the Construct 2 runtime system
- Console logging for debugging

### How to Use

#### Option 1: Use the Pre-configured Launcher
Simply open `index-faster-rocket.html` instead of `index.html` to play with the faster rocket mod enabled.

#### Option 2: Manual Integration
1. Add this line to your `index.html` in the `<body>` section:
```html
<script src="mods/faster-rocket.js"></script>
```

2. Make sure it loads **after** `c2runtime.js` but **before** `register-sw.js`:
```html
<script src="c2runtime.js"></script>
<script src="start.js"></script>
<script src="mods/faster-rocket.js"></script>
<script src="register-sw.js"></script>
```

### Configuration

To adjust the speed multiplier, edit `faster-rocket.js` and change this line:

```javascript
const SPEED_MULTIPLIER = 1.5; // Change to 1.2 for 20% faster, 2.0 for 2x speed, etc.
```

### Disabling the Mod

To disable the mod, change this line:
```javascript
const MOD_ENABLED = false;
```

### Compatibility

- Works with the extracted Rocketpult game files
- Compatible with Construct 2/3 exported HTML5 games
- No modifications needed to the original game files

### Troubleshooting

Check the browser console (F12 → Console tab) for debug messages:
- `[Faster Rocket Mod] Loaded. Speed multiplier: 1.5x` - Mod loaded successfully
- `[Faster Rocket Mod] Game initialized, activating mod...` - Game detected and mod activated
- `[Faster Rocket Mod] Rocket X velocity modified:` - Individual rocket velocity modifications

### Future Mods

You can add more mods by creating additional `.js` files in this directory following the same pattern.
