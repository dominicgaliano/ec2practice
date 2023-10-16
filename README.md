# ec2practice

## Description

The goal of this project was to deploy a simple node server to an EC2 instance.

## Skills Learned

- Created an EC2 instance through AWS console
- Configured EC2 security group permissions to allow SSH and connection to specific ports on public internet
- SSH'd to EC2 instance from local terminal
- Explored the Amazon Linux 2 OS
- Used linux scp to transfer files securely via SSH
- Installed node and git and then used them to clone a repo and run express server on an EC2 instance
- Setup systemd to run node server as background service, restarting after any reboots
- Installed and setup nginx reverse proxy to forward HTTP requests to a different port on EC2 instance
- Terminated EC2 instance
