import re

with open('colours.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove HEX/Pantone wrappers
content = re.sub(r'<div class="colour-meta">.*?</div>', '', content, flags=re.DOTALL)

# Remove modal hex
content = re.sub(r'<div class="colour-modal-hex" id="modal-hex"></div>', '', content)

# Remove CSS
css_classes_to_remove = [
    r'\.colour-meta\s*\{[^}]*\}',
    r'\.sea-tag\s*\{[^}]*\}',
    r'\.colour-hex\s*\{[^}]*\}',
    r'\.colour-pantone\s*\{[^}]*\}',
    r'\.colour-modal-hex\s*\{[^}]*\}'
]
for css_class in css_classes_to_remove:
    content = re.sub(css_class, '', content, flags=re.DOTALL)

# Remove JS lines for modal-hex
content = re.sub(r"const hex = card\.querySelector\('\.colour-hex'\) \? card\.querySelector\('\.colour-hex'\)\.textContent\.trim\(\) : '';", "", content)
content = re.sub(r"const hexEl = document\.getElementById\('modal-hex'\);", "", content)
content = re.sub(r"hexEl\.textContent = hex;", "", content)

# Also update getExtendedDesc arguments to remove hex
content = re.sub(r"function getExtendedDesc\(name, vibe, hex\)", "function getExtendedDesc(name, vibe)", content)
content = re.sub(r"descEl\.textContent = getExtendedDesc\(name, vibe, hex\);", "descEl.textContent = getExtendedDesc(name, vibe);", content)
content = content.replace("textureEl.style.backgroundColor = hex || bg;", "textureEl.style.backgroundColor = bg;")


# Update terminology
content = content.replace('Lime Paint', 'Grade-98 Shikkui')
content = content.replace('lime paint', 'Grade-98 Shikkui')
content = content.replace('Budget', 'Architectural Mineral Studio')

# Ensure flat paint also converted if needed, but not strictly asked.

mineral_vibes = [
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
    # Just in case there are more than 52
    "Crushed Basalt", "Silica Dust"
]

def replace_vibes(match):
    replace_vibes.counter = getattr(replace_vibes, 'counter', 0)
    vibe = mineral_vibes[replace_vibes.counter % len(mineral_vibes)]
    replace_vibes.counter += 1
    return f'<div class="colour-vibe">{vibe}</div>'

content = re.sub(r'<div class="colour-vibe">.*?</div>', replace_vibes, content)

new_descs_js = """            const descs = {
                'Calce': 'The most honest shade in the palette — raw calcium hydroxide with zero pigment added. Pure crushed quartz silica that shifts between cool and warm depending on the light.',
                'Alabaster': 'A warm off-white with the faintest blush of mineral warmth. Named after the translucent stone prized by ancient sculptors.',
                'Ivory': 'Cool white carrying a warm undertone — the colour of aged parchment and sunlit raw alabaster dust. Pairs beautifully with natural wood and brass.',
                'Talc': 'The softest mineral warmth, like powdered warm dolomite mineral. Barely there, yet it fills any room with quiet comfort.',
                'Gypsum': 'Named after aged gypsum clay, this shade carries the patina of old European plaster walls. Warm but never yellow. Timeless.',
                'Kaolin': 'Refined kaolin earth — the purest form of earth white. Slightly cooler than Gypsum, with a porcelain-like quiet elegance.',
                'Linen': 'The colour of woven calcite fiber. Not white, not beige — somewhere between, like well-worn Belgian linen draped over stone.'
            };
            return descs[name] || vibe + '. A mineral shade from the Architectural Mineral Studio palette, hand-mixed from pure Grade-98 Shikkui and earth pigments. Each application is unique — the colour deepens and shifts with natural light, brush direction, and the number of coats applied.';"""

content = re.sub(r'const descs = \{.*?\};\s*return descs\[name\] \|\| vibe \+ \'.*?\';', new_descs_js, content, flags=re.DOTALL)

with open('colours.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Modifications complete.")
