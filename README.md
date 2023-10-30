# ec2practice

## Description

The goal of this project is to deploy a simple node server using CI/CD principles to an EC2 instance with all of the accompanying infrastructure including reverse proxy, SSL certification, and monitoring.

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
  - See [./instance_config_files/ec2practice.service](./instance_config_files/ec2practice.service)
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
sudo cp home/ubuntu/ec2practice/instance_config_files/058968801.xyz.conf /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/058968801.xyz.conf /etc/nginx/sites-enabled/

# test nginx config
sudo nginx -t

# restart nginx
sudo systemctl restart nginx

# test reverse proxy locally
curl localhost
```

- Registered and new domain and configured DNS to point to EC2 instance

  - Test
  - I first tried using a subdomain of my [personal website](https://dgaliano.com), but the SSL certificates I had set up for the main site also applied to the subdomain which would make the next part of the project irrelevant.
  - I ended up registering a cheap domain [058968801.xyz](058968801.xyz) for testing. I will use this domain for other infrastructure related projects in the future.

- Setup HTTPS using certbot and Let's Encrypt
  - Used [this guide](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/)
  - Setup cron job to automatically renew the SSL certificates. The job runs every day at noon and will renew the certificate if it will expire in less than 30 days.
  - The website will now redirect to https automatically and should only be accessible via https

```bash
# install certbot
sudo apt-get update
sudo apt-get install certbot
sudo apt-get install python3-certbot-nginx

# generate certificates
sudo certbot --nginx -d 058968801.xyz -d www.058968801.xyz

# check that certbot added the appropriate config lines
cat /etc/nginx/sites-available/058968801.xyz.conf

# open crontab file
sudo crontab -e

# add the following command to file and save:
0 12 * * * /usr/bin/certbot renew --quiet

# simulate renewal
sudo certbot renew --dry-run
```

- Set up monit to monitor server
  - Access monit gui remotely at username:password@server-ip:2812

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install monit
sudo vim /etc/monit/monitrc

# modify the following lines (and others as desired) to configure monit, you should replace the passwords
set daemon  60             # check services at 60 seconds intervals
set httpd port 2812 and
    use address localhost  # only accept connection from localhost (drop if you use M/Monit)
    allow localhost        # allow localhost to connect to the server and
    ... add other ips you want to allow here
    allow admin:monit      # require user 'admin' with password 'monit'

# enable monit and start
sudo systemctl enable monit
sudo systemctl start monit

# check status
sudo systemctl status monit

# configure monit to monitor nginx server
sudo cp home/ubuntu/ec2practice/instance_config_files/nginx.monit.conf etc/monit/conf.d/monit.conf

# configure monit to monitor express server
sudo cp home/ubuntu/ec2practice/instance_config_files/express.monit.conf etc/monit/conf.d/express.conf

# reload
sudo monit reload
```

- Setup a CI/CD pipeline with Github Actions!
  - Setup github action to automatically test express server using Jest on pull requests
    - See integration workflow file [here](.github/workflows/test.yml)
  - Setup github action to automatically deploy code changes to ec2 instance
    - See deployment workflow file [here](.github/workflows/deploy-aws.yml)

- Terminated EC2 instance
