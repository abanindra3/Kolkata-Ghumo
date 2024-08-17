document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.photo-container');
    const images = container.querySelectorAll('img');
    let currentIndex = 0;
    
    function showNextImage() {
        images[currentIndex].classList.add('hidden');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.remove('hidden');
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(showNextImage, 6000); // Change image every 10 seconds
});
