# This script should be run from the mch-frontend directory
#!/bin/bash

# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json
echo "Done. Cleared npm cache and removed node_modules and package-lock.json"