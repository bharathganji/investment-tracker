#!/bin/bash

# Script to test semantic-release locally without actually publishing
# This will run semantic-release in dry-run mode to see what would be released

echo "Testing semantic-release locally..."
npx semantic-release --dry-run