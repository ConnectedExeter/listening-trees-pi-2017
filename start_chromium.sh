#!/bin/bash

myhost="https://trees.connectedexeter.uk:8443"

#extra_opts="--kiosk --disable-infobars"
extra_opts=""
options="--disable-session-crashed-bubble --no-first-run --allow-running-insecure-content --allow-insecure-localhost --disable-popup-blocking"

# if you remove all the profile, you'll have to reenable the camera and mic in the browser
#rm -rf /home/pi/.config/chromium/

# this is for bad crashes, which leave a lock handing round
rm /home/pi/.config/chromium/SingletonLock
# run the server
#sudo /home/pi/server.py &

sleep 1

# run the browser
#/usr/bin/chromium-browser ${extra_opts} ${options} ${myhost}/listeningtrees/bench.html?roomid=b1 &
/usr/bin/chromium-browser ${extra_opts} ${options} https://localhost:8443 &
