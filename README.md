# ec2practice

## Description

The goal of this project was to deploy a simple node server to an EC2 instance.

## Skills Learned

- Created an EC2 instance through AWS console
  - I used Ubuntu Linux 22.x out of convenience
- Configured EC2 security group permissions to allow SSH locally and connection to http/https on public internet
- SSH'd to EC2 instance from local terminal
- Installed node then used it to run express server on an EC2 instance

```bash
# install node
cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install v18.18.2
```

- Setup systemd to run node server as background service, restarting after any reboots
  - See [./instance_config_files/ec2practice.service](./instance_files/ec2practice.service)
  - Used [this resource](https://linuxhandbook.com/create-systemd-services/)
  - Learned the importance of using absolute paths (server was failing with relative paths when running as a systemd unit)

```bash
sudo vim /etc/systemd/system/ec2practice.service
sudo systemctl daemon-reload

# To set service to start on boot
sudo systemctl enable ec2practice

# To verify that service is enabled to run on boot
sudo systemctl is-enabled ec2practice.service

# To start service
sudo systemctl start ec2practice

# To kill service
sudo systemctl stop ec2practice
```

- Installed and setup nginx reverse proxy to forward HTTP requests to a different port on EC2 instance
  - See [./instance_config_files/ec2practice](./instance_config_files/ec2practice)
  - From this point on, the server is accessible via http://{server-public-ip-address} but not via https://...

```bash
# install nginx
sudo apt update
sudo apt install nginx -y

# unlink default nginx config and move our config over
sudo unlink /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default
sudo cp home/ubuntu/ec2practice/instance_config_files/ec2practice /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/ec2practice /etc/nginx/sites-enabled/

# test nginx config
sudo nginx -t

# restart nginx
sudo systemctl restart nginx

# test reverse proxy locally
curl localhost
```

- Point a domain at ec2 instance

  - I first tried using a subdomain of my [personal website](https://dgaliano.com), but the SSL certificates I had set up for the main site also applied to the subdomain which would make the next part of the project irrelevant.
  - I ended up registering a cheap domain [058968801.xyz](058968801.xyz) for testing. I will use this domain for other infrastructure related projects in the future.
  - Currently waiting for DNS records to propagate.

- Setup HTTPS using certbot and Let's Encrypt
  - Used [this guide](https://roadmap.sh/guides/setup-and-auto-renew-ssl-certificates)

```bash
# install snapd package manager
sudo apt-get update
sudo apt-get install snapd
sudo snap install core
sudo snap refresh core

# install certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# verify installation
certbot --version

# configure certbot for nginx server (opens interactive session)
sudo certbot --nginx

# To be continued
```

- Terminated EC2 instance
