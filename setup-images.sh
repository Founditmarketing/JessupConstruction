#!/bin/bash
set -e
BASE="https://jessupconstruct.com/wp-content/uploads"
IMG="$(dirname "$0")/img"
mkdir -p "$IMG"

download() {
  local url="$1"
  local name="$2"
  local dest="$IMG/$name"
  if [ -f "$dest" ] && [ "$(wc -c < "$dest")" -gt "5000" ]; then
    echo "  skip (exists): $name"
    return
  fi
  echo "  downloading: $name"
  curl -s --max-time 15 -L "$url" -o "$dest"
  local size=$(wc -c < "$dest" 2>/dev/null || echo 0)
  if [ "$size" -lt 1000 ]; then
    echo "  WARN: $name only ${size} bytes"
    rm -f "$dest"
  fi
}

echo "=== Downloading Jessup Construction images ==="

# Logo & Brand
download "$BASE/2021/10/Untitled-design-71.png"                                              "logo.png"
download "$BASE/2024/08/isnetworld.jpeg"                                                     "isnetworld.jpg"
download "$BASE/2025/07/Jessup-Construction-2.png"                                           "jessup-2.png"
download "$BASE/2025/07/Jessup-Construction-3.png"                                           "jessup-3.png"

# Project photos — Boise Remodel / Commercial  (Nov 2021 Facebook set)
download "$BASE/2021/11/158264937_900673897142442_1123214820182121115_n.jpg"                  "boise-1.jpg"
download "$BASE/2021/11/158394224_900673683809130_4458357870268871868_n.jpg"                  "boise-2.jpg"
download "$BASE/2021/11/158396297_900673937142438_2473020784940068934_n.jpg"                  "boise-3.jpg"
download "$BASE/2021/11/158534291_900673987142433_8102845395676760348_n.jpg"                  "boise-4.jpg"
download "$BASE/2021/11/158591108_900673627142469_1573723284457345065_n.jpg"                  "boise-5.jpg"
download "$BASE/2021/11/158608400_900673797142452_4371114674945576608_n.jpg"                  "boise-6.jpg"
download "$BASE/2021/11/158884419_900673747142457_2057083215428813470_n.jpg"                  "boise-7.jpg"
download "$BASE/2021/11/158885969_900673657142466_8835942167913602453_n.jpg"                  "boise-8.jpg"

# Original project images (Aug 2021 construction shots)
download "$BASE/2021/11/117729851_758571411352692_4713175494221834088_n.jpg"                  "project-hero.jpg"
download "$BASE/2021/11/118070492_758571381352695_1545159837514360320_n.jpg"                  "concrete-1.jpg"
download "$BASE/2021/11/117764678_758571464686020_2796105027315377357_n.jpg"                  "drainage-1.jpg"

# Seawall / waterfront screenshots
download "$BASE/2021/12/Screen-Shot-2021-12-21-at-5.41.39-PM.png"                            "seawall-1.png"
download "$BASE/2022/02/Screen-Shot-2022-02-03-at-12.21.30-PM-scaled.jpg"                    "seawall-2.jpg"

# Spirits outdoor seating
download "$BASE/2022/04/Screen-Shot-2022-04-28-at-11.14.32-AM.jpg"                           "spirits-1.jpg"

# Fencing / privacy (Nov 2022)
download "$BASE/2022/11/Image-1-scaled.jpeg"                                                  "fencing-1.jpg"
download "$BASE/2022/11/Image-1-2-scaled.jpeg"                                                "fencing-2.jpg"
download "$BASE/2022/11/Image-1-3-scaled.jpeg"                                                "fencing-3.jpg"

# Drone shots (Mar 2023)
download "$BASE/2023/03/DJI_0408-scaled.jpg"                                                  "drone-1.jpg"
download "$BASE/2023/03/DJI_0411-scaled.jpg"                                                  "drone-2.jpg"
download "$BASE/2023/03/DJI_0413-scaled.jpg"                                                  "drone-3.jpg"

# 2024 renovation photos
download "$BASE/2024/08/IMG_2430-2-scaled.jpeg"                                               "reno-1.jpg"
download "$BASE/2024/08/IMG_2432-2-scaled.jpeg"                                               "reno-2.jpg"
download "$BASE/2024/08/IMG_2433-2-scaled.jpeg"                                               "reno-3.jpg"
download "$BASE/2024/08/IMG_2438-2-scaled.jpeg"                                               "reno-4.jpg"
download "$BASE/2024/08/IMG_2442-2-scaled.jpeg"                                               "reno-5.jpg"
download "$BASE/2024/08/IMG_2473-2-scaled.jpeg"                                               "reno-6.jpg"
download "$BASE/2024/08/IMG_2474-2-scaled.jpeg"                                               "reno-7.jpg"
download "$BASE/2024/08/IMG_2477-2-scaled.jpeg"                                               "reno-8.jpg"
download "$BASE/2024/08/IMG_2479-2-scaled.jpeg"                                               "reno-9.jpg"
download "$BASE/2024/08/IMG_2481-2.jpeg"                                                      "reno-10.jpg"
download "$BASE/2024/08/IMG_2482-2.jpeg"                                                      "reno-11.jpg"
download "$BASE/2024/08/IMG_2484-2.jpeg"                                                      "reno-12.jpg"
download "$BASE/2024/08/IMG_2485-2.jpeg"                                                      "reno-13.jpg"

# Cert screenshot
download "$BASE/2024/08/Screenshot-2024-08-01-at-2.07.38 PM-2.jpeg"                          "cert-ravs.jpg"

# Nov 2021 boathouse/seawall screenshots
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-5.49.16-PM.png"                            "boathouse-1.png"
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-5.49.33-PM.png"                            "boathouse-2.png"
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-5.50.01-PM.png"                            "boathouse-3.png"
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-8.19.09-AM.png"                            "work-1.png"
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-8.19.18-AM.png"                            "work-2.png"
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-8.19.23-AM.png"                            "work-3.png"
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-8.19.37-AM.png"                            "work-4.png"
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-8.20.03-AM.png"                            "work-5.png"
download "$BASE/2021/11/Screen-Shot-2021-11-05-at-8.20.25-AM.png"                            "work-6.png"
download "$BASE/2021/11/Screen-Shot-2021-11-09-at-12.10.09-PM.png"                           "concrete-2.png"
download "$BASE/2021/11/Screen-Shot-2021-11-09-at-12.10.31-PM.png"                           "concrete-3.png"
download "$BASE/2021/11/Screen-Shot-2021-11-09-at-12.00.00-PM.png"                           "asphalt-1.png"
download "$BASE/2021/11/Screen-Shot-2021-11-09-at-12.17.02-PM.png"                           "commercial-1.png"
download "$BASE/2021/11/Screen-Shot-2021-11-09-at-12.20.08-PM.png"                           "roofing-1.png"
download "$BASE/2021/11/Screen-Shot-2021-11-09-at-12.23.18-PM.png"                           "house-1.png"
download "$BASE/2021/11/Screen-Shot-2021-11-09-at-12.33.47-PM.png"                           "house-2.png"
download "$BASE/2021/11/Screen-Shot-2021-11-08-at-7.22.26-PM.png"                            "seawall-3.png"
download "$BASE/2021/11/Screen-Shot-2021-11-08-at-7.22.36-PM.png"                            "seawall-4.png"
download "$BASE/2021/11/Screen-Shot-2021-11-08-at-7.22.40-PM.png"                            "seawall-5.png"

echo ""
echo "=== Download complete. Files in img/: ==="
ls -1 "$IMG" | wc -l
echo "files"
ls -lh "$IMG" | awk '{print $5, $9}' | grep -v "^$"
