import sys, os, re, base64
site = sys.argv[1]
src = open(os.path.join(site, 'src.html'), encoding='utf-8').read()
def sub(m):
    name = m.group(1)
    path = os.path.join(site, 'assets', name + '.webp')
    data = base64.b64encode(open(path, 'rb').read()).decode()
    return 'data:image/webp;base64,' + data
out = re.sub(r'\{\{([a-z0-9_\-]+)\}\}', sub, src)
left = re.findall(r'\{\{[^}]+\}\}', out)
assert not left, left
suffix = sys.argv[2] if len(sys.argv) > 2 else ''
dst = os.path.join(site, 'qaymaq' + suffix + '.html')
open(dst, 'w', encoding='utf-8').write(out)
print(dst, round(len(out.encode()) / 1024), 'KB')
pv = os.path.join(site, 'preview' + suffix + '.html')
open(pv, 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + out + '</body></html>')
