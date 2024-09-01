#!/bin/bash
# Copyright (c) 2024, Ronan LE MEILLAT
# This program is licensed under the AGPLv3 license.

#Configuration
SCHEME=${SCHEME:-"http"}
HOST=${HOST:-"localhost"}
PORT=${PORT:-"8080"}
USERNAME=${USERNAME:-"admin"}
PASSWORD=${PASSWORD:-"admin123"}
ENDPOINT=${ENDPOINT:-"/send"}
DESTINATION=${DESTINATION:-"test@example.com"}
DATE=$(date)
# Test function
test_api() {
    local test_name=$1
    local expected_status=$2
    local USERNAME=$3
    local password=$4
    local data=$5

    echo "Running test: $test_name"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Basic $(echo -n $USERNAME:$password | base64)" \
        -d "$data" \
        "$SCHEME://$HOST:$PORT$ENDPOINT")

    if [ "$response" -eq "$expected_status" ]; then
        echo "Test passed: $test_name"
    else
        echo "Test failed: $test_name. Expected $expected_status, got $response"
    fi
    echo
}

# Test cases
test_api 'Valid request' 200 $USERNAME $PASSWORD "{\"subject\":\"Test Subject $DATE\",\"body\":\"Test Body $DATE\",\"destinations\":[\"$DESTINATION\"]}"
test_api 'Missing subject' 500 $USERNAME $PASSWORD "{\"body\":\"Test Body $DATE\",\"destinations\":[\"$DESTINATION\"]}"
test_api 'Missing body' 500 $USERNAME $PASSWORD "{\"subject\":\"Test Subject $DATE\",\"destinations\":[\"$DESTINATION\"]}"
test_api 'Missing destinations' 500 $USERNAME $PASSWORD "{\"subject\":\"Test Subject $DATE\",\"body\":\"Test Body\"}"
test_api 'Invalid JSON' 400 $USERNAME $PASSWORD "{\"subject\":\"Test Subject $DATE\",\"body\":\"Test Body $DATE\",\"destinations\":[\"$DESTINATION\"}"
test_api 'Unauthorized' 401 $USERNAME fake "{\"subject\":\"Test Subject $DATE\",\"body\":\"Test Body $DATE\",\"destinations\":[\"$DESTINATION\"]}" # This test will fail due to invalid credentials

echo "External tests completed"