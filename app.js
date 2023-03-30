window.addEventListener("load", shuffleFruits);

// RANDOM GENERATOR
let uniqueNumbers = new Set();

while (uniqueNumbers.size < 12) {
    let randomNumber = Math.floor(Math.random() * 12);
    uniqueNumbers.add(randomNumber);
}

// CONVERT INTO AN ARRAY
let uniqueNumbersArray = Array.from(uniqueNumbers);


//FRUITS
const affectFruit = document.querySelectorAll(".card img:nth-child(2)");
const questionMark = document.querySelectorAll(".card img:nth-child(1)");

const fruitsArr = ["apple", "apple", "banana", "banana", "brocoli", "brocoli", "cherry", "cherry", "pepper", "pepper", "straw", "straw"];

function shuffleFruits() {
    console.log(uniqueNumbersArray)

    affectFruit.forEach((fruit, index) => {
        fruit.src = "ressources/" + fruitsArr[uniqueNumbersArray[index]] + ".svg";
        fruit.alt = fruitsArr[uniqueNumbersArray[index]];
    })
}

const cards = document.querySelectorAll(".card");
const cardsArr = Array.prototype.slice.call(cards);//Transform a node list into an array if needed

let scoreTxt = document.querySelector("#score");
let score = 0;

let clickCount = 0;

cards.forEach(card => {
    card.addEventListener("click", revealCard);

    const fruitCard = card.querySelector(".card img:nth-child(2)");
    const questionCard = card.querySelector(".card img:nth-child(1)")

    function revealCard() {
        clickCount++;
        fruitCard.style.display = "flex";
        questionCard.style.display = "none";
        card.style.pointerEvents = "none"

        const result = [];
        const clickOdd = clickCount;
        if (clickOdd % 2 == 1) {
            setTimeout(hideCard, 1000)
            function hideCard() {
                fruitCard.style.display = "none";
                questionCard.style.display = "flex"
                card.style.pointerEvents = "auto"
            }
        } else {
            // INCREMENT SCORE BY ODD CLICKING
            score++;
            scoreTxt.textContent = score;

            affectFruit.forEach((el, index) => {

                if (el.style.display === "flex") {
                    result.push(el.alt)

                    if (result[0] === result[1]) {
                        console.log("trouvé !")
                        score--
                        scoreTxt.textContent = score;

                        result.pop();
                        result.pop();
                    }
                }
            })

            setTimeout(hideCard, 1000)
            function hideCard() {
                fruitCard.style.display = "none";
                questionCard.style.display = "flex"
                card.style.pointerEvents = "auto"
            }

        }
    }
})