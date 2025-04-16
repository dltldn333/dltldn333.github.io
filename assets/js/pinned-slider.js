document.addEventListener('DOMContentLoaded', () => {
  const slideItems = document.querySelectorAll('.slide-item');
  const titles = document.querySelectorAll('.slide-title-item');
  const tagBlocks = document.querySelectorAll('.slide-tags-item');

  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const toggleBtn = document.getElementById('togglePlay');

  let current = 0;
  let playing = true;
  let interval = setInterval(nextSlide, 5000);

  function showSlide(index) {
    slideItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    titles.forEach((title, i) => {
      title.classList.toggle('active', i === index);
    });
    tagBlocks.forEach((tags, i) => {
      tags.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    current = (current + 1) % slideItems.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slideItems.length) % slideItems.length;
    showSlide(current);
  }

  function togglePlay() {
    playing = !playing;
    toggleBtn.textContent = playing ? '⏸' : '▶';
    if (playing) {
      interval = setInterval(nextSlide, 5000);
    } else {
      clearInterval(interval);
    }
  }

  showSlide(current);

  nextBtn.addEventListener('click', () => {
    nextSlide();
    if (playing) togglePlay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    if (playing) togglePlay();
  });

  toggleBtn.addEventListener('click', togglePlay);
});
