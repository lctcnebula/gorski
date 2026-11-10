"""Download a read-only WordPress inventory. No account credentials are stored."""
import concurrent.futures
import hashlib
import json
import subprocess
from pathlib import Path
from urllib.parse import unquote, urlsplit, urljoin

ROOT = Path(__file__).resolve().parent.parent
inventory = json.loads((ROOT / 'media-library/source-inventory.json').read_text())
jobs = []
for item in inventory['items']:
    if not item['type'].startswith(('image/', 'video/')):
        continue
    urls = [item['url']]
    if item.get('original'):
        urls.append(urljoin(item['url'], item['original']))
    for url in urls:
        relative = unquote(urlsplit(url).path).split('/uploads/', 1)[1]
        jobs.append((item, url, ROOT / 'public/media/wordpress' / relative))

def download(job):
    item, url, path = job
    path.parent.mkdir(parents=True, exist_ok=True)
    encoded_url = url.replace('–', '%E2%80%93')
    result = subprocess.run(['curl', '--fail', '--location', '--silent', '--show-error', '--retry', '2', '--max-time', '180', encoded_url, '--output', str(path)], capture_output=True, text=True)
    if result.returncode:
        return {'id': item['id'], 'url': url, 'error': result.stderr.strip()}
    data = path.read_bytes()
    return {'id': item['id'], 'title': item['title'], 'type': item['type'], 'source': url, 'local': '/' + str(path.relative_to(ROOT / 'public')), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(download, jobs))
(ROOT / 'media-library/manifest.json').write_text(json.dumps(results, indent=2) + '\n')
failed = [r for r in results if 'error' in r]
print(json.dumps({'files': len(results), 'downloaded': len(results)-len(failed), 'bytes': sum(r.get('bytes', 0) for r in results), 'failed': failed}, indent=2))
raise SystemExit(bool(failed))
