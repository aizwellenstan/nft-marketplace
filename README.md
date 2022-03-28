# Setup
```
snap install docker
sudo systemctl enable docker
sudo systemctl start docker
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add

sudo apt install make docker-compose -y

docker run -p 0.0.0.0:27017:27017 --restart=always --name mongo -d mongo:4.2.0

npm run build
npm start
```
