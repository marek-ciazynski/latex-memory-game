'use strict';
import './style.css'

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let latexFormulas = [
	'\\int_{-\\infty}^\\infty\\f\\hat\\xi\\,e^{2 \\pi i \\xi x}\\,d\\xi',
	'\\int_{-\\infty}^\\infty\\f\\xi\\,\pi^{3 \\pi i \\xi x}\\,d\\xi',
	'\\int_{a}^b\\f\\xi\\,e^{2 \\pi i \\xi x}\\,d\\xi',
	'x^n + y^n = z^n',
	'E=mc^2',
	'\\frac{n!}{k!(n-k)!} = \\binom{n}{k}',
];
let _latexFormulas = [1,2,3,4,5,6].map(x => x.toString());
latexFormulas = latexFormulas.concat(latexFormulas);
shuffle(latexFormulas);

let cardSelection = [];
let cardsLeft = 12;

function resetAllCards() {
	const cardContents = document.querySelectorAll('.card-content');
	for (const card of cardContents) {
		if (!card.classList.contains('revealed'))
			card.classList.remove('flip');
	}
	lock = false;
}

let lock = false;
const onCardSelected = (event) => {
	if (lock)
		return false;
	
	const selectedCard = event.target;
	cardSelection.push(selectedCard);
	selectedCard.classList.add('flip');

	console.log(cardSelection.map(x => x.dataset.latex))

	if (cardSelection.length >= 2) {
		if (cardSelection[0].dataset.latex === cardSelection[1].dataset.latex) {
			cardSelection.forEach(x => x.classList.add('revealed'));
			cardsLeft -= 2;
			if (cardsLeft <= 0) {
				alert('Hooray!');
			}
		} else {
			lock = true;
			setTimeout(resetAllCards, 1000);
		}
		cardSelection = [];
	} else if (cardSelection[0] === cardSelection[1]) {
		return false;
	}
};

document.addEventListener("DOMContentLoaded", function (event) {
	const cardContents = document.querySelectorAll('.card-content');

	let formulaIndex = 0;
	for (const card of cardContents) {
		const cardBackface = card.querySelector('.back');

		const formula = latexFormulas[formulaIndex++]
		card.dataset.latex = formula;

		katex.render(formula, cardBackface, {
			displayMode: false,
			throwOnError: false,
			output: "htmlAndMathml",
			trust: false,
			macros: { "\\f": "#1f(#2)" }
		});
	}

	for (const card of cardContents) {
		card.addEventListener('click', onCardSelected);
	}
});
