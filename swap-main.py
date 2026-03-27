#!/usr/bin/env python3
import re

with open('services.html','r') as f:
    html = f.read()

# Extract head/nav/footer parts unchanged, only replace <main>...</main>
new_main = open('services-main.html','r').read()
result = re.sub(r'<main id="main">.*?</main>', new_main, html, flags=re.DOTALL)

with open('services.html','w') as f:
    f.write(result)

print(f"Done — {result.count(chr(10))} lines")
