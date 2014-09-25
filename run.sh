
if [ "$EUID" -ne 0 ]
	then echo "Please run as root"
	exit
fi

# Start mongod 
echo "Starting mongod server..."
mongod > /dev/null & 
sleep 2

# Install deps
echo "Installing node dependencies..."
npm install > /dev/null
npm install -g mocha > /dev/null

# Start server
echo "Starting server..."
node server.js > /dev/null &
sleep 3

# Run tests
echo "Running mocha tests..."
mocha

# Kill mongo and the server
echo "Killing node and mongo."
killall node
killall mongod
