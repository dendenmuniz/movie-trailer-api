# Odicial Node.js image
FROM node:18

# Work dir in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# Copy all files
COPY . .

# Define the port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
