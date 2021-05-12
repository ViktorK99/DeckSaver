module.exports = (client) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
      });
    
    client.on('message', (message) => {
        console.log('yo');
    });
}