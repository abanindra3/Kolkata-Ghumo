let currentIndex = 0;
const spots = document.querySelectorAll('.spot');
const totalSpots = spots.length;

function rotateSpots() {
    
    spots.forEach(spot => {
        spot.classList.remove('left', 'middle', 'right', 'visible');
    });

  
    const leftIndex = currentIndex;
    const middleIndex = (currentIndex + 1) % totalSpots;
    const rightIndex = (currentIndex + 2) % totalSpots;

    spots[leftIndex].classList.add('left', 'visible');
    spots[middleIndex].classList.add('middle', 'visible');
    spots[rightIndex].classList.add('right', 'visible');


    currentIndex = (currentIndex + 1) % totalSpots;
}

setInterval(rotateSpots, 6000); 
rotateSpots(); 



const apiKey = 'db1f134983dfd38b81a3a6ebfd97e8f5'; 
const city = 'Kolkata';
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

async function getWeather() {
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        const temperature = data.main.temp;
        const description = data.weather[0].description;

        document.getElementById('weather').innerHTML = 
            `Temperature: ${temperature}°C <br> Condition: ${description}`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather').innerHTML = 'Unable to load weather data.';
    }
}

getWeather();

window.onscroll = function() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};


document.querySelector('.back-to-top').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
