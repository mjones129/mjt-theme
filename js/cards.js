function cardsUp() {
  anime({
    targets: '.card',
    translateY: [250, 0],
    opacity: [0, 1],
    duration: 800,
    delay: anime.stagger(300)
  });
}

cardsUp();
