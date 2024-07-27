const enterText = document.getElementById('enter-text');
const introScreen = document.getElementById('intro-screen');
const gameButton = document.getElementById('game-button');
const gameScreen = document.getElementById('game-screen');
const result = document.getElementById('result');
const exitGame = document.getElementById('exit-game');
const playAgain = document.getElementById('play-again');

let startTime, endTime;

introScreen.addEventListener('mousemove', (e) => {
    const { width, height } = introScreen.getBoundingClientRect();
    const offsetX = (e.clientX - width / 2) / width;
    const offsetY = (e.clientY - height / 2) / height;
    
    const moveX = offsetX * 40;
    const moveY = offsetY * 40;
    
    enterText.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
});

introScreen.addEventListener('mouseleave', () => {
    enterText.style.backgroundPosition = 'center';
});

introScreen.addEventListener('click', function(e) {
    if (e.target !== gameButton) {
        this.style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        document.getElementById('main-content').style.justifyContent = 'center';
        document.getElementById('main-content').style.alignItems = 'center';
        document.getElementById('background-audio').play();
        startTyping();
    }
});

gameButton.addEventListener('click', startGame);
exitGame.addEventListener('click', exitGameFunction);
playAgain.addEventListener('click', startGame);

function startGame() {
    gameScreen.style.display = 'block';
    gameScreen.style.backgroundColor = 'red';
    result.textContent = 'Wait for green...';
    playAgain.style.display = 'none';

    setTimeout(() => {
        gameScreen.style.backgroundColor = 'green';
        startTime = new Date().getTime();
    }, Math.random() * 3000 + 1000); // Random delay between 1-4 seconds
}

gameScreen.addEventListener('click', function(e) {
    if (e.target !== exitGame && e.target !== playAgain) {
        if (gameScreen.style.backgroundColor === 'green') {
            endTime = new Date().getTime();
            const reactionTime = endTime - startTime;
            result.textContent = `Your reaction time: ${reactionTime} ms`;
            playAgain.style.display = 'block';
        } else {
            result.textContent = 'Too early! Wait for green.';
            playAgain.style.display = 'block';
        }
    }
});

function exitGameFunction() {
    gameScreen.style.display = 'none';
}

async function fetchIPInfo() {
    try {
        const ipv4Response = await fetch('https://api.ipify.org?format=json');
        const ipv4Data = await ipv4Response.json();

        const ipapiResponse = await fetch(`https://ipapi.co/${ipv4Data.ip}/json/`);
        const ipapiData = await ipapiResponse.json();

        const screenWidth = screen.width;
        const screenHeight = screen.height;
        const browserInfo = navigator.userAgent;

        return `IP Address: ${ipv4Data.ip}
Country: ${ipapiData.country_name}
Region: ${ipapiData.region}
City: ${ipapiData.city}
Postal Code: ${ipapiData.postal}
Latitude: ${ipapiData.latitude}
Longitude: ${ipapiData.longitude}
Timezone: ${ipapiData.timezone}
ISP: ${ipapiData.org}
Currency: ${ipapiData.currency_name}
Screen Width: ${screenWidth} pixels
Screen Height: ${screenHeight} pixels
Browser: ${browserInfo}`;
    } catch (error) {
        console.error('Error fetching IP info:', error);
        return 'Unable to fetch IP information';
    }
}

function typeWriter(text, element, speed = 40) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

async function startTyping() {
    const ipInfo = await fetchIPInfo();
    const infoElement = document.getElementById('ip-info');
    infoElement.innerHTML = '';
    typeWriter(ipInfo, infoElement);
}
