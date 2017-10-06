sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install sox
sudo install config-files/etc-asound.conf /etc/asound.conf

sudo apt-get -y install dnsutils

sudo install config-files/etc-rc.local /etc/rc.local
install listening-trees-auto.sh ~/listening-trees-auto.sh

sudo install config-files/var-lib-alsa-asaound.state /var/lib/alsa/asound.state

sudo apt-get -y install xvfb

