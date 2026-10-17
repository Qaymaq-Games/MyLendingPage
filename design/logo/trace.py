import sys, json, cv2, numpy as np
src, out, SC = sys.argv[1], sys.argv[2], 4.0
im = cv2.imread(src, cv2.IMREAD_UNCHANGED)
if im.shape[2] == 4:
    a = im[..., 3:4].astype(np.float32) / 255
    im = (im[..., :3].astype(np.float32) * a + 255 * (1 - a)).astype(np.uint8)
b, g, r = cv2.split(im.astype(np.int16))
black = ((r < 110) & (g < 110) & (b < 110)).astype(np.uint8) * 255
red = ((r > 140) & (g < 110) & (r - g > 80)).astype(np.uint8) * 255
h, w = black.shape
def fmt(c):
    c = c.reshape(-1, 2) / SC
    return "M" + " ".join(f"{x:.1f} {y:.1f}" for x, y in c) + "Z"
def approx(c, eps=1.1): return cv2.approxPolyDP(c, eps, True)
cs, hier = cv2.findContours(black, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
hier = hier[0]
outers = [i for i in range(len(cs)) if hier[i][3] == -1 and cv2.contourArea(cs[i]) > 400]
head_i = max(outers, key=lambda i: cv2.contourArea(cs[i]))
head_area = cv2.contourArea(cs[head_i])
holes = [i for i in range(len(cs)) if hier[i][3] != -1 and cv2.contourArea(cs[i]) > 300]
holes_sorted = sorted(holes, key=lambda j: -cv2.contourArea(cs[j]))
eye_i = next(j for j in holes_sorted if cv2.contourArea(cs[j]) < head_area * .2)
ex0, ey0, ew0, eh0 = cv2.boundingRect(cs[eye_i])
pupil_i = None
for j in holes:
    if j == eye_i: continue
    x, y, ww, hh = cv2.boundingRect(cs[j])
    if ex0 <= x + ww / 2 <= ex0 + ew0 and ey0 <= y + hh / 2 <= ey0 + eh0: pupil_i = j
ink = []
for i in outers:
    d = fmt(approx(cs[i]))
    k = hier[i][2]
    while k != -1:
        if cv2.contourArea(cs[k]) > 30 and k != pupil_i: d += fmt(approx(cs[k]))
        k = hier[k][0]
    ink.append(d)
# base silhouette: close the gaps between ink pieces and fill holes
base = cv2.morphologyEx(black, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))
ff = base.copy(); m = np.zeros((h + 2, w + 2), np.uint8); cv2.floodFill(ff, m, (0, 0), 128)
base = np.where(ff == 128, 0, 255).astype(np.uint8)
bc, _ = cv2.findContours(base, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
bc = max(bc, key=cv2.contourArea)
rc, _ = cv2.findContours(red, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
reds = [fmt(approx(c, 1.2)) for c in sorted(rc, key=cv2.contourArea, reverse=True) if cv2.contourArea(c) > 200]
eye = cs[eye_i]; ex, ey, ew, eh = cv2.boundingRect(eye)
res = {"w": w / SC, "h": h / SC, "ink": " ".join(ink), "base": fmt(approx(bc, 3)), "pupil": fmt(approx(cs[pupil_i], 1.5)),
       "eye": fmt(approx(eye, 1.5)), "eyeBox": [ex / SC, ey / SC, ew / SC, eh / SC], "red": reds,
       "headBox": [v / SC for v in cv2.boundingRect(cs[head_i])]}
json.dump(res, open(out, "w"))
print(src.split('/')[-1], "ink pieces", len(ink), "reds", len(reds), "pts", sum(s.count(' ') for s in ink) // 2, "eye", res["eyeBox"], "head", res["headBox"], "size", res["w"], res["h"])
