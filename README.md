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

```bash
sudo vim /etc/systemd/system/ec2practice.service

# To start service
sudo systemctl start ec2practice

# To kill service
sudo systemctl stop ec2practice
```

- Installed and setup nginx reverse proxy to forward HTTP requests to a different port on EC2 instance
- Terminated EC2 instance

```

```
