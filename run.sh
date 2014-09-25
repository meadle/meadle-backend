
if [ "$EUID" -ne 0 ]
	then echo "Please run as root"
	exit
fi

# Start mongod 
mongod & > /dev/null 
sleep 3

# Install deps
npm install

# Start server
node server.js & > /dev/null
sleep 4

# Run tests
mocha

# Kill mongo and the server
killall node
killall mongod
