#!/bin/bash

# Ensure we stop on error
set -e

# Install Go if not present
if ! command -v go &> /dev/null
then
    echo "Go is not installed. Installing via Homebrew..."
    if ! command -v brew &> /dev/null
    then
        echo "Homebrew is not installed. Please install Homebrew first."
        exit 1
    fi
    brew install go
fi

echo "Setting up GOPATH..."
export GOPATH=$(go env GOPATH)
export PATH=$PATH:$GOPATH/bin

echo "Installing subfinder..."
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest

echo "Installing httpx..."
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest

echo "Installing naabu..."
# pcap is required for naabu, optionally brew install libpcap
go install -v github.com/projectdiscovery/naabu/v2/cmd/naabu@latest

echo "Installing katana..."
go install -v github.com/projectdiscovery/katana/cmd/katana@latest

echo "Installing dnsx..."
go install -v github.com/projectdiscovery/dnsx/cmd/dnsx@latest

echo "Installing gau..."
go install github.com/lc/gau/v2/cmd/gau@latest

echo "==================================="
echo "Setup Complete!"
echo "Please add the following line to your ~/.zshrc or ~/.bashrc if it's not already there:"
echo "export PATH=\$PATH:\$(go env GOPATH)/bin"
echo "==================================="
