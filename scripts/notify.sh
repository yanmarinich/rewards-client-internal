#!/bin/bash

usage() {
    echo "Invalid usage of the script please run it"
    echo "./notify.sh slack_hook message"
    exit 2
}

if [[ $# -ne 2 ]]; then
usage
fi

WEBHOOK=$1
MESSAGE=$2

curl "$WEBHOOK" -X POST -H 'Content-type: application/json' --data "{'text':'$MESSAGE'}"