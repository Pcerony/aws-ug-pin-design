"""Crop the owner's corrected sheet without repainting the accepted artwork."""
import json
import shutil
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parent.parent
target = root / 'designs/accessories/2027-house-roles'
target.mkdir(parents=True, exist_ok=True)
source = Path(sys.argv[1])
sheet = Image.open(source).convert('RGB')
if sheet.size != (1672, 941):
    raise ValueError('Expected the accepted 1672 x 941 three-role source sheet')
shutil.copy2(source, target / 'owner-corrected-source.png')
assets = {}
for role, bounds in zip(['leader', 'speaker', 'volunteer'], [(45, 150, 560, 790), (580, 150, 1080, 790), (1120, 150, 1620, 790)]):
    crop = np.array(sheet.crop(bounds))
    edges = cv2.Canny(cv2.cvtColor(crop, cv2.COLOR_RGB2GRAY), 35, 100)
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour = max(contours, key=cv2.contourArea)
    if cv2.contourArea(contour) < crop.shape[0]*crop.shape[1]*.4:
        raise ValueError(f'Incomplete silhouette: {role}')
    mask = np.zeros(crop.shape[:2], np.uint8)
    cv2.drawContours(mask, [contour], -1, 255, cv2.FILLED)
    x, y, w, h = cv2.boundingRect(contour)
    rgba = np.dstack([crop, mask])[y:y+h, x:x+w]
    Image.fromarray(rgba).save(target / f'{role}.png')
    outline = cv2.approxPolyDP(contour, .8, True).reshape(-1, 2)
    normalized = [[round(float(px-x)/w, 6), round(float(py-y)/h, 6)] for px, py in outline]
    assets[role] = dict(src=f'designs/accessories/2027-house-roles/{role}.png', width=w, height=h, contour=normalized)
    print(role, w, h, len(normalized))
(target / 'manifest.json').write_text(json.dumps(assets, indent=2)+'\n')
(root / 'assets/js/badge-accessory-assets.js').write_text('window.BadgeAccessoryAssets = '+json.dumps(assets)+';\n')
