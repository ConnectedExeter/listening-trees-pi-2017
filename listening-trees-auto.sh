#!/bin/bash
cd listening-trees-pi-2017
./server.js &
sleep 20
export DISPLAY=:0.0
./start_chromium.sh &
date >>~/last_git_pull.txt
git pull >>~/last_git_pull.txt
