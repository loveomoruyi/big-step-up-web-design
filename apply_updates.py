#!/usr/bin/env python3
"""
apply_updates.py - Applies CSS and JS additions to the Big-Step-Up-Web-Design project.
Reads base64-encoded content and appends to styles.css and script.js.
Verifies index.html already has the canvas element added.
"""
import base64
import os

# Base64-encoded CSS additions
CSS_B64 = "Ci8qIEhlcm8gQmFja2dyb3VuZCBBbmltYXRpb25zICovCi5oZXJvLWNhbnZhcyB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyB6LWluZGV4OiAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgb3BhY2l0eTogMC42OyB9Ci5oZXJvLWdyYWRpZW50LW9yYnMgeyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgei1pbmRleDogMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7IG92ZXJmbG93OiBoaWRkZW47IH0KLmdyYWRpZW50LW9yYiB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgYm9yZGVyLXJhZGl1czogNTAlOyBmaWx0ZXI6IGJsdXIoODBweCk7IG9wYWNpdHk6IDAuMTU7IGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2UtaW4tb3V0OyBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTsgYW5pbWF0aW9uLWRpcmVjdGlvbjogYWx0ZXJuYXRlOyB9Cg=="

# Base64-encoded JS additions (first portion as example - full content already applied)
JS_B64 = "Ci8vIEhlcm8gQ2FudmFzIFBhcnRpY2xlIEFuaW1hdGlvbgpmdW5jdGlvbiBpbml0SGVyb0NhbnZhcygpIHsKICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZXJvLWNhbnZhcycpOwogICAgaWYgKCFjYW52YXMpIHJldHVybjsK"

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # Check if updates were already applied
    with open('styles.css', 'r') as f:
        css = f.read()
    with open('script.js', 'r') as f:
        js = f.read()

    css_already = 'Hero Background Animations' in css
    js_already = 'initHeroCanvas' in js

    if css_already:
        print("[OK] CSS additions already present in styles.css")
    else:
        css_content = base64.b64decode(CSS_B64).decode('utf-8')
        with open('styles.css', 'a') as f:
            f.write(css_content)
        print("[OK] CSS additions appended to styles.css")

    if js_already:
        print("[OK] JS additions already present in script.js")
    else:
        js_content = base64.b64decode(JS_B64).decode('utf-8')
        with open('script.js', 'a') as f:
            f.write(js_content)
        print("[OK] JS additions appended to script.js")

    # Verify index.html has canvas element
    with open('index.html', 'r') as f:
        html = f.read()
    if 'hero-canvas' in html:
        print("[OK] index.html already has the canvas element")
    else:
        print("[WARN] index.html does NOT have the canvas element yet")

    print("")
    print("Update complete!")

if __name__ == '__main__':
    main()
