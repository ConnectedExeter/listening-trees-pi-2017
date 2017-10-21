sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install pulseaudio 
sudo apt-get -y install pavucontrol

# Also need this
sudo modprobe bcm2835-v4l2 gst_v4l2src_is_broken=1

