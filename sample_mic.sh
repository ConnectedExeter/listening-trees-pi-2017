#!/bin/bash
rec="/tmp/listening_tree_sample.wav"
arecord -Dplug:default -d 4 -f S16_LE -t wav ${rec} 2>/dev/null
max=`sox -t wav ${rec} -n stat 2>&1 |sed -n -e 's/Maximum amplitude:\s*//p'`
echo "Maximum ${max}"
