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


//remove tilt on mobile
let cardObject = document.getElementsByClassName('wp-block-cover');
let cards = Array.from(cardObject);
if(window.innerWidth < 990) {
  removeTilt();
  };

console.log(cards);


function removeTilt() {
  let cardObject = document.getElementsByClassName('wp-block-cover');
  let cards = Array.from(cardObject);
  for (let i = 0; i <= cardObject.length; i++) {
    console.log(cardObject[i]);
    cardObject[i].classList.remove('tilt');
    console.log(`after: ${cardObject[i]}`);
  }
}
