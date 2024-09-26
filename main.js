let soundEnabled = false; // Variable to track if sound is enabled

// Function to enable sound
function enableSound() {
    soundEnabled = true;
    document.querySelector('.sound-button').style.display = 'none'; // Hide the button after enabling sound
}

// Function to update the fill level and tooltips based on current time
function updateFill() {
    const now = new Date(); // Get the current date and time
    const seconds = now.getSeconds(); // Get the current seconds
    const minutes = now.getMinutes(); // Get the current minutes
    const hours = now.getHours(); // Get the current hours

    // Calculate fill percentages
    const secondsFillPercentage = (seconds / 60) * 100; // Calculate the fill percentage for seconds
    const minutesFillPercentage = (minutes / 60) * 100; // Calculate the fill percentage for minutes
    const hoursFillPercentage = (hours / 24) * 100; // Calculate the fill percentage for hours

    // Update fill heights
    document.querySelector('#seconds .fill').style.height = `${secondsFillPercentage}%`; // Update the fill height for seconds
    document.querySelector('#minutes .fill').style.height = `${minutesFillPercentage}%`; // Update the fill height for minutes
    document.querySelector('#hours .fill').style.height = `${hoursFillPercentage}%`; // Update the fill height for hours

    // Update tooltips with current time
    document.getElementById('seconds-tooltip').textContent = `Seconds: ${seconds}`; // Update the tooltip for seconds
    document.getElementById('minutes-tooltip').textContent = `Minutes: ${minutes}`; // Update the tooltip for minutes
    document.getElementById('hours-tooltip').textContent = `Hours: ${hours}`; // Update the tooltip for hours

    // Update droplet shapes
    updateDropletShape('seconds-droplet', secondsFillPercentage);
    updateDropletShape('minutes-droplet', minutesFillPercentage);
    updateDropletShape('hours-droplet', hoursFillPercentage);

    // Play sound every second when the droplet reaches the current water level, except just before emptying
    if (soundEnabled && seconds !== 59) {
        new Audio('immerse.wav').play(); // Play immerse sound
    }

    // Reset fill and play animation when a minute is over
    if (seconds === 0) {
        document.querySelector('#seconds .fill').style.height = '0'; // Reset the fill height for seconds
        document.querySelector('#seconds .fill').style.transition = 'none'; // Disable transition for reset
        setTimeout(() => {
            document.querySelector('#seconds .fill').style.transition = 'height 1s'; // Re-enable transition
        }, 50);
    }
    // Play empty sound one second before the minute is over
    if (seconds === 59 && soundEnabled) {
        new Audio('empty.wav').play(); // Play empty sound
    }

    // Reset fill and play animation when an hour is over
    if (minutes === 0 && seconds === 0) {
        document.querySelector('#minutes .fill').style.height = '0'; // Reset the fill height for minutes
        document.querySelector('#minutes .fill').style.transition = 'none'; // Disable transition for reset
        setTimeout(() => {
            document.querySelector('#minutes .fill').style.transition = 'height 1s'; // Re-enable transition
            if (soundEnabled) {
                new Audio('empty.wav').play(); // Play empty sound
            }
        }, 50);
    }

    // Reset fill and play animation when a day is over
    if (hours === 0 && minutes === 0 && seconds === 0) {
        document.querySelector('#hours .fill').style.height = '0'; // Reset the fill height for hours
        document.querySelector('#hours .fill').style.transition = 'none'; // Disable transition for reset
        setTimeout(() => {
            document.querySelector('#hours .fill').style.transition = 'height 1s'; // Re-enable transition
            if (soundEnabled) {
                new Audio('empty.wav').play(); // Play empty sound
            }
        }, 50);
    }
}

// Function to update the shape of the droplet
function updateDropletShape(dropletId, fillPercentage) {
    const droplet = document.getElementById(dropletId);
    const maxWidth = 30; // Maximum width of the droplet
    const minWidth = 15; // Minimum width of the droplet
    const width = maxWidth - (maxWidth - minWidth) * (fillPercentage / 100); // Calculate the width based on fill percentage
    const height = 30; // Fixed height of the droplet
    droplet.style.width = `${width}px`;
    droplet.style.height = `${height}px`;
    droplet.style.borderRadius = `${width / 2}px / ${height / 2}px`; // Update border-radius to create an ellipse
}

// Add event listeners to containers for hover effect
document.querySelectorAll('.container').forEach(container => {
    container.addEventListener('mouseenter', () => {
        const tooltip = container.querySelector('.tooltip');
        tooltip.style.opacity = '1'; // Show tooltip
    });
    container.addEventListener('mouseleave', () => {
        const tooltip = container.querySelector('.tooltip');
        tooltip.style.opacity = '0'; // Hide tooltip
    });
});

// Initial update and set interval to update every second
updateFill(); // Call the updateFill function initially
setInterval(updateFill, 1000); // Set an interval to call the updateFill function every second