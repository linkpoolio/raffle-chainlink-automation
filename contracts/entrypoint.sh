#!/usr/bin/env sh

. ~/.bashrc
foundryup
anvil > anvil.log &
sleep 5
make deploy-local &
tail -f anvil.log