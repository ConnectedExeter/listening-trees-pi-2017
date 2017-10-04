#!/bin/bash
cd listening-trees-pi-2017
./server.js &
sleep 20
export DISPLAY=:0.0
./start_chromium.sh &



