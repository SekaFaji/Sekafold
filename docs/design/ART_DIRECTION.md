# Art direction - handmade paper universe

Accepted direction: paper airplane theme, paper-like aesthetic. Proposed execution: layered papercraft with visible folds, restrained texture, soft contact shadows and hand-cut silhouettes. No external reference art is bundled.

## Visual grammar
Warm ivory notebook backgrounds, muted pencil lines and graph grids; aircraft use two or more folded planes of color with a clear nose and central crease. Use cooler blues/teals for friendly effects, warm reds/oranges for hostile projectiles, and shape differences so color is not the sole signal. Keep scenery low contrast behind combat. Menus resemble clipped notebook pages or sticky notes, but prioritize readability and plain functional labels. Suggested palette: ivory #F5EFE1, ink #3E4140, graphite #77766F, friendly teal #427D82, hostile rust #B64D42, scrap gold #B68A36. Contrast and color blindness must be tested.

## Animation rules
Prefer layered original vector/2D artwork with named pivot points, transforms and limited poses: idle wobble, movement bank, recoil, hit crease, crumple and scraps. Keep gameplay collision stable despite decorative transforms. Damage feedback uses small debris and distinct flashes, not full-screen clutter. Reduced-motion mode reduces shake, debris and flash intensity. Export consistent sizes, pivot and orientation; use a single coordinate convention. No frame-by-frame animation unless it improves the result enough to justify cost.

## First asset brief
Original player airplane (pristine, damaged, critical); enemy dart and two variants; paper dart projectile; hostile projectile; tape repair; scrap pickup; simple paper boss; background graph paper tile; button/panel/icon set; basic original sound effects. Build a single representative mockup and one animated plane before producing many assets. Later paper patterns can reuse geometry; no paid cosmetics until art quality and visibility are validated.

## Asset pipeline
Editable source under assets/source; optimized runtime exports under assets/runtime; use stable descriptive names (e.g. `aircraft-original.svg`). Record creator, origin, license/permission, modifications and intended use in assets/PROVENANCE.md. Use original assets or explicitly licensed commercial-use assets only. Confirm font and audio redistribution rights. Do not copy reference-game assets. Do not treat generated art as automatically cleared for every commercial use; review service terms and provenance.

## P007 menu slice
Portrait flight-notebook cover: original layered vector airplane, muted paper clouds and pencil-like flight trail. Deep green primary action, warm paper cards, and separate campaign/workshop pages. Keep the menu cover decorative, legible at phone scale, and independent of simulation.

## P007.2 presentation
Idle starter plane rocks gently with a soft shadow in Home and Hangar. Combat death freezes simulation; a short hit pause, inward fold morph, faceted paper ball and restrained scrap burst precede the report (0.88 seconds, 0.18 seconds without burst for reduced motion). Voluntary end flight bypasses destruction. No visual animation changes gameplay or rewards.

## P007.3 recovery
Use a cut-paper sky scene, centered original plane, tactile ochre launch button and dark green tabs. Home must fit without scrolling at the supported preview sizes. Paper fibres, outlined craft and stronger dart contrast are visual-only; do not change simulation hitboxes.
