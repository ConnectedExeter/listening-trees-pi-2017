#! /bin/bash
name=`cat /home/chrome/device.name`
nohup sudo /home/chrome/gpio/new_server.py &
nohup xvfb-run  /usr/bin/chromium --disable-default-apps  --disable-gpu  --allow-running-insecure-content https://twiliortc.herokuapp.com/pi/$name &
nohup x11vnc -display :99 &
