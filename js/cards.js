function cardsUp() {
  anime({
    targets: '.card',
    translateY: [250, 0],
    opacity: [0, 1],
    duration: 800,
    delay: anime.stagger(300)
  });
}

export cardsUp();


//remove tilt on mobile
// let cardObject = document.getElementsByClassName('wp-block-cover');
// let cards = Array.from(cardObject);
// function checkWindowWidth() {
// if(window.innerWidth < 990) {
//   removeTilt();
//   } else if (window.innerWidth >= 991) {
//     addTilt();
//   }
// }
//
//
// function addTilt() {
//   let cardObject = document.getElementsByClassName('wp-block-cover');
//   let cards = Array.from(cardObject);
//   for (let i = 0; i <= cards.length; i++) {
//     cards[i].classList.add('tilt');
//   }
// }
//
// function removeTilt() {
//   let cardObject = document.getElementsByClassName('wp-block-cover');
//   let cards = Array.from(cardObject);
//   for (let i = 0; i <= cards.length; i++) {
//     console.log(cardObject[i]);
//     cards[i].classList.remove('tilt');
//     // console.log(`after: ${cardObject[i]}`);
//   }
// }
//
// window.onresize = checkWindowWidth;
