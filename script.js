const slides = [...document.querySelectorAll('.slide')];
const previousButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');
const currentSlide = document.querySelector('#current-slide');
const statusTitle = document.querySelector('#status-title');
const speakerLabel = document.querySelector('#speaker-label');
const speakerTime = document.querySelector('#speaker-time');
const progressFill = document.querySelector('#progress-fill');
const themeButton = document.querySelector('#theme-button');
const themeName = document.querySelector('#theme-name');
const themes = [
  { id: 'citrus', name: 'Citrus light' },
  { id: 'ocean', name: 'Coastal' },
  { id: 'blossom', name: 'Rose paper' },
  { id: 'meadow', name: 'Meadow' },
  { id: 'sunset', name: 'Warm light' },
  { id: 'midnight', name: 'Midnight' }
];
let activeIndex = 0;
let activeTheme = 0;

function showSlide(index) {
  activeIndex = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
  const slide = slides[activeIndex];
  const speaker = slide.dataset.speaker;
  currentSlide.textContent = String(activeIndex + 1).padStart(2, '0');
  statusTitle.textContent = slide.dataset.title;
  speakerLabel.textContent = `SPEAKER ${speaker.padStart(2, '0')}`;
  speakerTime.textContent = '4 MIN';
  progressFill.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
  previousButton.disabled = activeIndex === 0;
  nextButton.querySelector('span').textContent = activeIndex === slides.length - 1 ? 'Start again' : 'Next slide';
  document.title = `${slide.dataset.title} | Beyond the First Choice`;
}

function cycleTheme() {
  activeTheme = (activeTheme + 1) % themes.length;
  const theme = themes[activeTheme];
  document.body.dataset.theme = theme.id;
  themeName.textContent = theme.name;
  themeButton.setAttribute('aria-label', `Change color theme. Current theme: ${theme.name}`);
}

previousButton.addEventListener('click', () => showSlide(activeIndex - 1));
nextButton.addEventListener('click', () => showSlide(activeIndex === slides.length - 1 ? 0 : activeIndex + 1));
themeButton.addEventListener('click', cycleTheme);

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    showSlide(activeIndex + 1);
  } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    showSlide(activeIndex - 1);
  } else if (event.key === 'Home') {
    showSlide(0);
  } else if (event.key === 'End') {
    showSlide(slides.length - 1);
  } else if (event.key.toLowerCase() === 't') {
    cycleTheme();
  }
});

let touchStartX = 0;
document.querySelector('.slides').addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
document.querySelector('.slides').addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) < 55) return;
  showSlide(activeIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

showSlide(0);