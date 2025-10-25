#!/bin/bash

CERT_PATH="/mnt/c/ssl-manager/certs/jcstjj.top.pem"
openssl x509 -in "$CERT_PATH" -noout -dates