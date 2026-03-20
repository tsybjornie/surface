const fs = require('fs');

let content = fs.readFileSync('colours.html', 'utf-8');

// 1. Remove HEX/Pantone wrappers
content = content.replace(/<div class="colour-meta">[\s\S]*?<\/div>/g, '');

// Remove modal hex
content = content.replace(/<div class="colour-modal-hex" id="modal-hex"><\/div>/g, '');

// Remove CSS
const css_classes_to_remove = [
    /\.colour-meta\s*\{[^}]*\}/g,
    /\.sea-tag\s*\{[^}]*\}/g,
    /\.colour-hex\s*\{[^}]*\}/g,
    /\.colour-pantone\s*\{[^}]*\}/g,
    /\.colour-modal-hex\s*\{[^}]*\}/g
];
for (const css_class of css_classes_to_remove) {
    content = content.replace(css_class, '');
}

// Remove JS lines for modal-hex
content = content.replace(/const hex = card\.querySelector\('\.colour-hex'\).*?;/g, '');
content = content.replace(/const hexEl = document\.getElementById\('modal-hex'\);/g, '');
content = content.replace(/hexEl\.textContent = hex;/g, '');

// Update getExtendedDesc arguments to remove hex
content = content.replace(/function getExtendedDesc\(name, vibe, hex\)/g, 'function getExtendedDesc(name, vibe)');
content = content.replace(/descEl\.textContent = getExtendedDesc\(name, vibe, hex\);/g, 'descEl.textContent = getExtendedDesc(name, vibe);');
content = content.replace(/textureEl\.style\.backgroundColor = hex \|\| bg;/g, 'textureEl.style.backgroundColor = bg;');

// Update terminology
content = content.replace(/Lime Paint/g, 'Grade-98 Shikkui');
content = content.replace(/lime paint/g, 'Grade-98 Shikkui');
content = content.replace(/Budget/g, 'Architectural Mineral Studio');

// Replace vibes
const mineral_vibes = [
    "Crushed Quartz Silica", "Pale Fossil Silica", "Raw Alabaster Dust", "Warm Dolomite Mineral",
    "Aged Gypsum Clay", "Refined Kaolin Earth", "Woven Calcite Fiber", "Volcanic Pumice Sand",
    "Pale Limestone Crust", "Silver Mica Flake", "Dusty Argile Shale", "Sedimentary Sandstone",
    "Granite Felsite Pebble", "Aged Travertine Mineral", "Flint Silex Stone", "Warm Mudite Earth",
    "Soft Halite Salt", "Cool Calcite Crystal", "Pale Diatomite Silica", "Volcanic Ash Glass",
    "Silver Selenite Ore", "Warm Marl Limestone", "Dense Metamorphic Schist", "Refined Slate Ardoise",
    "Lead Galena Mineral", "Volcanic Basalt Stone", "Light-Absorbing Obsidian", "Airy Aragonite Pink",
    "Dusty Rhodonite Ore", "Raw Umber Earth", "Textured Feldspar Rose", "Deep Sanguine Iron",
    "Quiet Celadonite Green", "Coastal Glauconite Mineral", "Volcanic Olivine Stone", "Deep Olivenite Copper",
    "Dusty Prehnite Mint", "Raw Citrine Mineral", "Pale Celestite Strontium", "Storm Blue Azurite",
    "Iridescent Labradorite", "Deep Lapis Lazuli", "Navy Sodalite Mineral", "Vibrant Malachite Patina",
    "Dark Charoite Silicate", "Orange Realgar Arsenic", "Deep Cinnabar Mineral", "Tropical Hematite Iron",
    "Dark Pyrope Garnet", "Dark Anthracite Oxide", "Rich Goethite Iron", "Deep Almandine Garnet",
    "Crushed Basalt", "Silica Dust"
];

let counter = 0;
content = content.replace(/<div class="colour-vibe">[\s\S]*?<\/div>/g, () => {
    const vibe = mineral_vibes[counter % mineral_vibes.length];
    counter++;
    return `<div class="colour-vibe">${vibe}</div>`;
});

const new_descs_js = `            const descs = {
                'Calce': 'The most honest shade in the palette — raw calcium hydroxide with zero pigment added. Pure crushed quartz silica that shifts between cool and warm depending on the light.',
                'Alabaster': 'A warm off-white with the faintest blush of mineral warmth. Named after the translucent stone prized by ancient sculptors.',
                'Ivory': 'Cool white carrying a warm undertone — the colour of aged parchment and sunlit raw alabaster dust. Pairs beautifully with natural wood and brass.',
                'Talc': 'The softest mineral warmth, like powdered warm dolomite mineral. Barely there, yet it fills any room with quiet comfort.',
                'Gypsum': 'Named after aged gypsum clay, this shade carries the patina of old European plaster walls. Warm but never yellow. Timeless.',
                'Kaolin': 'Refined kaolin earth — the purest form of earth white. Slightly cooler than Gypsum, with a porcelain-like quiet elegance.',
                'Linen': 'The colour of woven calcite fiber. Not white, not beige — somewhere between, like well-worn Belgian linen draped over stone.'
            };
            return descs[name] || vibe + '. A mineral shade from the Architectural Mineral Studio palette, hand-mixed from pure Grade-98 Shikkui and earth pigments. Each application is unique — the colour deepens and shifts with natural light, brush direction, and the number of coats applied.';`;

content = content.replace(/const descs = \{[\s\S]*?\};\s*return descs\[name\] \|\| vibe \+ '[^']*';/, new_descs_js);

fs.writeFileSync('colours.html', content, 'utf-8');
console.log('Modifications complete. Cards modified:', counter);
