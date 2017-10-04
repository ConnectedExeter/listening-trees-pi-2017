#! /bin/bash


nohup xvfb-run -s "-screen 0 1280x1024x24" /usr/bin/chromium --use-fake-ui-for-media-stream --disable-default-apps --user-data-dir=remote-profile  --alsa-output-device default --alsa-input-device default https://test.webrtc.org &
nohup x11vnc -display :99 &
