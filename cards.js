const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');

const cards = new Array(54);

for (let i = 0; i < cards.length; i++) {
  cards[i] = i % 54;
}

const getProperties = (i) => {
  const joker = i > 51 || undefined;
  const rank = joker ? -1 : i % 13;
  const value = rank + 1;
  const suit = joker ? -1 : i / 13 | 0;
	const color = suit % 2 ? 'red' : 'black';

	return { joker, rank, rank: ranks[rank], suit: suits[suit] };
};

const pre = document.createElement('pre');

pre.textContent = JSON.stringify(cards.map(getProperties), null, 2);

document.body.appendChild(pre);

const shuffle = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    const rnd = Math.random() * i | 0;
    const tmp = cards[i];
    cards[i] = cards[rnd];
    cards[rnd] = tmp;
  }
  return cards;
};

setTimeout(() => {
  shuffle(cards);
	pre.textContent = JSON.stringify(cards.map(getProperties), null, 2);
}, 1000);