module.exports = {
  connection: {
    port: 6379, // replace with your port
    host: 'ec2-3-15-32-117.us-east-2.compute.amazonaws.com', // replace with your hostanme or IP address
    password: 'geysa123', // replace with your password,
    string_numbers: false
  },
  extras: {
    prefixKey: 'user_',
    expireTimeSeconds: 3600
  }
}
