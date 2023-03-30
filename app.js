const cards = document.querySelectorAll(".card")

function shuffleCards() {
    cards.forEach(card => {// Pour chaque élement qui contient la class card
        const randomPos = Math.trunc(Math.random() * 12)// Math.trunc permet de se séparer des décimales. On demande ensuite un Math.random douze fois
        card.style.order = randomPos;// On applique à chaque élément contenant une classe card la propriété css order en lui attribuant une position random. Ca peut donner plusieurs fois un même chiffre mais ce n'est pas grave dans notre cas.
    })
}
shuffleCards()

cards.forEach(card => card.addEventListener("click", flipACard))// Pour essayer de ne pas trop se mélanger on recréer une fonction qui appelle tous les éléments contenant la class card et on y ajoute un event listener au click qui executera la fonction flipACard

let lockedCards = false;// On initialise lockedCards à false pour éviter le spam
let cardsPicked = [];// On créé notre tableau pour permettre à chaque carte retournée d'y affecter son nom et sa valeur. Ca permettra de comparer le résultat par la suite.
function flipACard(e) {

    if (lockedCards) return;// Si lockedCards est true alors je n'exécute pas la suite de la fonction et j'en sors.

    saveCard(e.target.children[0], e.target.getAttribute("data-attr"))// On exécute la fonction saveCard (cf suite) en lui donnant son premier argument el en accèdant à l'enfant de notre target et son deuxième argument sera l'attribut data-attr de notre target

    if (cardsPicked.length === 2) result()// Si mon tableau contient deux éléments alors je check les résultats.
}

function saveCard(el, value) {// On créé la fonction saveCard qui prendra en argument l'élément de la carte clickée et sa valeur
    if (el === cardsPicked[0]?.el) return;// Si l'élement est strictement égale à celle sur laquelle je viens de cliquer (si je spam la même image au premier click), alors je n'exécute pas la suite, ça permet d'éviter le spam

    el.classList.add("active");// J'ajoute la classe active à mon élément
    cardsPicked.push({ el, value })// Je rempli mon tableau précédemment créé avec l'élément et sa valeur
    //   console.log(cardsPicked);
}

function result() {
    saveNumberOftries()// On appel la fonction saveNumberOfTries pour compter le nombre d'essai (cf fonction correspondante ligne 58)

    // SI PAIRE TROUVEE
    if (cardsPicked[0].value === cardsPicked[1].value) {// On vérifie si la valeur de la première carte est strictement égale à la valeur de la deuxième
        cardsPicked[0].el.parentElement.removeEventListener("click", flipACard)// Si c'est le cas alors on retire l'event listener en partant de cardsPicked soit doubleFace > card. On retire le click ainsi que la fonction qui y est associé (obligatoire)
        cardsPicked[1].el.parentElement.removeEventListener("click", flipACard)// Même chose pour la deuxième carte. En gros on les laisse retourner et on ne pourra plus cliquer dessus pour exec la fonction result
        cardsPicked = [];// On clean le tableau de cardsPicked
        return;// On sort de la fonction
    }

    // SI PAIRE NON TROUVEE
    lockedCards = true;// On repasse lockedCards à true qui permet de bloquer l'execution de la fonction flipACard à la ligne 17
    setTimeout(() => {
        cardsPicked[0].el.classList.remove("active");// Je retourne ma carte 1
        cardsPicked[1].el.classList.remove("active");// Je retourne ma carte 2
        cardsPicked = [];// Je vide mon tableau cardsPicked afin de pouvoir renouveler les résultats par la suite.
        lockedCards = false;// Je repasse lockedCards à false (après 1 seconde grâce à setTimeout) pour pouvoir rechoisir deux cartes.
    }, 1000)// J'exec le code après une seconde (exprimée en milliseconde)
}

const innerCards = [...document.querySelectorAll(".double-face")];// Destructuring de tous les éléments comprenant la classe double-face. Ca m'en fait un tableau (au lieu d'une nodeList)
const advice = document.querySelector(".advice");
const score = document.querySelector(".score")

let numberOfTries = 0;// J'initialise numberOfTries à 0
function saveNumberOftries() {
    numberOfTries++;// J'incrémente 1 à numberOfTries
    const checkForEnd = innerCards.filter(card => !card.classList.contains("active"))// Je cherche seulement les cartes qui contiennent la classe active car lorsqu'une paire est trouvée, sa classe active restera, donc quand toutes les paires seront trouvées (ou si il ne reste plus de carte active) alors c'est la fin de la partie
    if (!checkForEnd.length) {// Si je ne trouve plus d'élément avec la classe active alors j'execute
        advice.textContent = `Bravo ! Appuyez sur "espace" pour relancer une partie.`
        score.textContent = `Votre score final : ${numberOfTries}`
        return;
    }
    score.textContent = `Nombre de coups ${numberOfTries}`
}

window.addEventListener("keydown", handleRestart)// J'écoute quand je presse une touche et j'exec la fonction handleRestart

let shuffleLock = false;// J'initialise suffleLock à false pour prévenir du spam keydown de spacebar
function handleRestart(e) {
    e.preventDefault()//Je retire le comportement par défaut d'espace qui dit d'ammener la page vers le bas s'il y a une scrollbar
    if (e.keyCode === 32) {// Le keycode de la barre espace est 32. Donc ici si j'appuie sur espace alors j'exec la suite
        innerCards.forEach(card => card.classList.remove("active"))// Pour chaque innerCards, je leur retire la classe active (donc je les retourne)
        advice.textContent = `Tentez de gagner avec le moins d'essais possible.`// Je change le contenu d'advice et je le remet à son état initial
        score.textContent = `Nombre de coups : 0`// Je change le contenu de score pour le remettre à son état initial
        numberOfTries = 0;// Je réinitialise la valeur du nombre d'essais
        cards.forEach(card => card.addEventListener("click", flipACard))// Pour chaque card, je leur rajoute à nouveau l'event listener au click qui executera la fonction flipACard (on n'oublie par qu'on a remove cet event listener si une paire est trouvée)

        if (shuffleLock) return;// Si suffleLock est true alors je sors de ma fonction
        shuffleLock = true;// Je passe shuffleLock à true qui me permet d'exec setTimeout
        setTimeout(() => {
            shuffleCards()// Je remélange l'ordre de la grid et donc l'ordre de mes cartes
            shuffleLock = false;// Je passe shuffleLock à False
        }, 600)// Pendant 0.6 secondes (qui est le temps de la transition .double-face sur le fichier css), shuffleLock sera à false et je ne pourrai donc pas le spam
    }
}