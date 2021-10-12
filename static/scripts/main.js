const click = document.querySelectorAll('#click');
const modal = document.querySelector('#modal');
const modalTitel = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const cardBody = document.getElementById('card-body');
const btnClose = document.querySelector('.btn-close');
const btnDeckString = document.querySelector('#deckString');
const commentPopover = document.getElementById('comment-popover');
const deckInfoPopover = document.getElementById('deck-info-popover')

click.forEach((element) => {
    element.addEventListener('click', async () => {
        const { deckId, guildId } = element.children[0].children[0].dataset;

        fetch('http://localhost:3000/getDeck', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guildId: guildId, deckId: deckId }),
        })
            .then((res) => res.json())
            .then((deck) => {
                const { _id, gameMode, deckName, deckClass, deckString, deckComments } = deck.deck;
                const cardsInDeck = deck.cardsInDeck;
                modalTitel.innerHTML = deckName;
                btnDeckString.dataset.deckString = deckString;
                const sortedCardsInDeck = cardsInDeck.sort((a, b) => {
                    if (a[0].cost > b[0].cost) {
                        return 1;
                    } else if (a[0].cost < b[0].cost) {
                        return -1;
                    } else {
                        return a[0].name.localeCompare(b[0].name);
                    }
                });
                commentPopover.dataset.bsContent = deckComments;
                deckInfoPopover.dataset.bsContent = deckClass.toUpperCase();
                deckInfoPopover.dataset.bsOriginalTitle = gameMode.toUpperCase();
                
                sortedCardsInDeck.forEach(card => {
                    const cardData = card[0];
                    const cardCount = card[1];
                    cardBody.innerHTML += `<div class="cardContainer">
                    <span class="rarity-${cardData.rarity.toLowerCase()} cardCost text-center">${cardData.cost}</span>
                    <div class="cardFrame">
                        <img src="https://art.hearthstonejson.com/v1/tiles/${cardData.id}.jpg"
                            class="rounded float-end cardImage">
                        <div class="backgroundCard">
                            <span class="cardText pl-2">${cardData.name}</span>
                        </div>
                        <span class="cardCount text-center">${cardCount}</span>
                    </div>
                </div>`
                });
            });
    });
});
modal.addEventListener('hide.bs.modal', (e) => {
    cardBody.innerHTML = '';
})

btnDeckString.addEventListener('click', () => {
    const deckString = btnDeckString.dataset.deckString;
    var text = document.createElement("input");
    text.style.position = 'fixed';
    text.style.top = 0;
    text.style.left = 0;

    text.style.width = '2em';
    text.style.height = '2em';

    text.style.padding = 0;

    text.style.border = 'none';
    text.style.outline = 'none';
    text.style.boxShadow = 'none';
    text.style.background = 'transparent';


    text.value = deckString;
    document.body.appendChild(text);
    text.select();
    document.execCommand("copy");
    document.body.removeChild(text);
})