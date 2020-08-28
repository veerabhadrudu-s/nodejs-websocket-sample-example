#!/usr/bin/bash

USAGE="$0 <DEVICE_NAME> <COUNTER>";

[[ $# -lt 2 ]] && { echo "${USAGE}"; exit 1; };

COUNTER=${2};

for((i=1;i<=${COUNTER};i++))
do
	sleep 1;
	echo "Writing standard output for device ${1} with counter value ${i}";
done

exit 0;


