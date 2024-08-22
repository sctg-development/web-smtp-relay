#!/bin/bash
# Copyright (c) 2024, Ronan LE MEILLAT
# This program is licensed under the AGPLv3 license.

# Configuration
HOST="localhost"
PORT="8080"
USERNAME="admin"
PASSWORD="admin123"
ENDPOINT="/send"

#if variable DESTINATION is not set, set it to default value
DESTINATION=${DESTINATION:-"test@example.com"}
# Test function
test_api() {
    local test_name=$1
    local expected_status=$2
    local user=$3
    local password=$4
    local data=$5

    echo "Running test: $test_name"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Basic $(echo -n $user:$password | base64)" \
        -d "$data" \
        "http://$HOST:$PORT$ENDPOINT")

    if [ "$response" -eq "$expected_status" ]; then
        echo "Test passed: $test_name"
    else
        echo "Test failed: $test_name. Expected $expected_status, got $response"
    fi
    echo
}

# Test cases
test_api 'Valid request' 200 $USERNAME $PASSWORD "{\"subject\":\"Test Subject\",\"body\":\"Test Body\",\"destinations\":[\"$DESTINATION\"]}"
test_api 'Missing subject' 500 $USERNAME $PASSWORD "{\"body\":\"Test Body\",\"destinations\":[\"$DESTINATION\"]}"
test_api 'Missing body' 500 $USERNAME $PASSWORD "{\"subject\":\"Test Subject\",\"destinations\":[\"$DESTINATION\"]}"
test_api 'Missing destinations' 500 $USERNAME $PASSWORD "{\"subject\":\"Test Subject\",\"body\":\"Test Body\"}"
test_api 'Invalid JSON' 400 $USERNAME $PASSWORD "{\"subject\":\"Test Subject\",\"body\":\"Test Body\",\"destinations\":[\"$DESTINATION\"}"
test_api 'Unauthorized' 401 $USERNAME fake "{\"subject\":\"Test Subject\",\"body\":\"Test Body\",\"destinations\":[\"$DESTINATION\"]}" # This test will fail due to invalid credentials

echo "External tests completed"