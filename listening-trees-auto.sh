#!/bin/bash
cd listening-trees-pi-2017
./server.js &
sleep 20
./start_chromium.sh &



