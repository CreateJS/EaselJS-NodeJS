# node-canvas install (for Ubuntu Server 10.04)

If not already installed, install Node (tested on v0.8.18)

Either:

```sudo apt-get install node```

or manually install

# Install dependancies first
```sudo apt-get install libssl-dev pkg-config```

```wget https://github.com/joyent/node/archive/v0.8.18.tar.gz
tar -zxvf v0.8.18
cd joyent-node-xxxxx/
./configure
make
sudo make install
```
## Install Cairo

#### Image support (Required)
```sudo apt-get install binutils-dev librsvg2-dev```
#### PDF support (Optional)
```sudo apt-get install libopenjpeg-dev libpoppler13 libpoppler-dev```
#### If you can't install libjpeg8-dev or libpoppler13, add these sources to /etc/apt/sources.list
```deb http://ftp.ca.debian.org/debian stable main
deb-src http://ftp.ca.debian.org/debian stable main```

#### Now install Cairo (on Ubuntu 11)
```sudo apt-get install libcairo2-dev libjpeg8-dev```

#### For ubunutu 10.04 manually install
```wget http://cairographics.org/snapshots/pixman-0.25.6.tar.gz
tar -zxvf pixman-0.25.6.tar.gz
cd pixman-0.25.6
./configure
make
sudo make install

wget http://cairographics.org/snapshots/cairo-1.11.4.tar.gz
tar -xvzf cairo-1.11.4.tar.gz
cd cairo-1.11.4
./configure
make
sudo make install```

## Finally Install Canvas
npm install canvas
