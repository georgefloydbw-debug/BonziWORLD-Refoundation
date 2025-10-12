// Example function to handle ban duration selection
function selectBanDuration(duration) {
    // Send the selected duration to the server
    socket.emit('banUser', {
        ip: selectedIp, // Ensure selectedIp is defined and holds the target IP
        duration: duration,
        reason: 'Permanent ban' // You can customize the reason as needed
    });
}
