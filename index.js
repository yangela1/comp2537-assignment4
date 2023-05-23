
//start button
function start() {
  document.getElementById("content").style.display = "block"
  startTimer();
  document.getElementById("start").style.display = "none";
}

//timer
var totalSeconds = 100;
var interval;

function startTimer() {
  // Reset the timer
  clearInterval(interval);
  var seconds = 0;
  updateTimer(seconds);

  // Update the timer every second
  interval = setInterval(function () {
    seconds++;
    updateTimer(seconds);

    // Stop the timer when it reaches 100 seconds
    if (seconds >= 100) {
      clearInterval(interval);

      var contentDiv = document.getElementById("game_grid");
      contentDiv.innerHTML = "Time's up! <a href='javascript:resetPage()'>Try again</a>";
    }
  }, 1000)
}

//reset button    
function resetPage() {
  document.getElementById("content").style.display = "none";
  location.reload();
}
//update timer in div
function updateTimer(seconds) {
  document.getElementById("timer").innerHTML = "You got " + totalSeconds + " seconds. " + seconds + " seconds have passed";
}

//difficulty buttons event listener
document.addEventListener("DOMContentLoaded", function () {
  const easyButton = document.getElementById("easy");
  const mediumButton = document.getElementById("medium");
  const hardButton = document.getElementById("hard");

  easyButton.classList.add("active");

  easyButton.addEventListener("click", function () {
    // Add 'active' class to the clicked button
    easyButton.classList.add("active");
    mediumButton.classList.remove("active");
    hardButton.classList.remove("active");
    console.log("easy");
  });

  mediumButton.addEventListener("click", function () {
    // Add 'active' class to the clicked button
    easyButton.classList.remove("active");
    mediumButton.classList.add("active");
    hardButton.classList.remove("active");
    console.log("medium");
  });

  hardButton.addEventListener("click", function () {
    // Add 'active' class to the clicked button
    easyButton.classList.remove("active");
    mediumButton.classList.remove("active");
    hardButton.classList.add("active"); 
    console.log("hard");
  });
});


//setup the page------------------------------------------------------------------------------------------------------------------------------------------------------------------->
const setup = async () => {
  let response = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=810");
  pokemons = response.data.results;

  //shuffle
  shuffle(pokemons);

  let firstCard = undefined;
  let secondCard = undefined;
  let clickable = true;
  let totalPairs = 3;
  let pairsLeft = totalPairs;
  let pairsMatched = 0;
  let clickCount = 0;


  function updateDiv() {
    $("#totalPairs").text(`Total number of pairs: ${totalPairs}`);
    $("#pairsLeft").text(`Number of pairs left: ${pairsLeft}`);
    $("#pairsMatched").text(`Number of pairs matched: ${pairsMatched}`);
    $("#clicks").text(`Number of clicks: ${clickCount}`);
  }

  updateDiv();

  let pairCount = 0;
  let pairsLoad = 6;


  const gameGrid = document.getElementById("game_grid");

  //load the pokemon images into the divs
  pokemons.slice(0, pairsLoad / 2).map(async (pokemon, index) => {
    const pokemonName = pokemon.name;

    // Create card elements for the pair
    for (let i = 0; i < 2; i++) {
      // Create card element
      const card = document.createElement("div");
      card.classList.add("card");
      card.id = `img${index * 2 + i + 1}`;

      // Load front face
      const front = document.createElement("img");
      front.classList.add("front_face");
      front.setAttribute("data-pokemon", pokemonName);
      card.appendChild(front);
      await loadImg(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, front);

      // Load back face
      const back = document.createElement("img");
      back.classList.add("back_face");
      back.src = "back.webp";
      card.appendChild(back);

      // Append the card to the game grid
      gameGrid.appendChild(card);

    }
    //loading the image url function
    async function loadImg(url, image) {
      try {
        let response = await axios.get(url);
        let artworkURL = response.data.sprites.other["official-artwork"].front_default;
        image.src = artworkURL;
      } catch (error) {
        console.log("cannot load poke image", error);
      }
    }

    //flip the cards
    $(".card").on(("click"), function () {
      if (!clickable || $(this).hasClass("flip")) {
        return;
      }

      //increment click count
      clickCount++;
      updateDiv();


      $(this).toggleClass("flip");

      if (!firstCard)
        firstCard = $(this).find(".front_face")[0]
      else {
        secondCard = $(this).find(".front_face")[0]
        console.log(firstCard, secondCard);

        if (firstCard.getAttribute("data-pokemon") === secondCard.getAttribute("data-pokemon")) {
          console.log("match")
          pairCount++;
          //make the matched pair unclickable 
          $(firstCard).parent().off("click");
          $(secondCard).parent().off("click");

          //reset after the match
          firstCard = undefined;
          secondCard = undefined;

          //checks if the game is finished
          if (pairCount === pairsLoad / 2) {
            displayWinningMessage();
          }

          console.log("pair count " + pairCount)
          console.log("pairsload " + pairsLoad / 2)

          //decrement pairs left by 1 and increment pairs matched by 1
          pairsLeft -= 1;
          pairsMatched += 1;
          updateDiv();

        } else {
          console.log("no match")
          //make cards unclickable during comparison
          clickable = false;

          setTimeout(() => {
            $(firstCard).parent().toggleClass("flip");
            $(secondCard).parent().toggleClass("flip");
            //reset after timeout
            firstCard = undefined;
            secondCard = undefined;
            clickable = true;
          }, 1000)
        }
      }
    });

  });


  //shuffle the pokemons so its different each time
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

}

$(document).ready(setup)

function displayWinningMessage() {
  clearInterval(interval);
  setTimeout(function () {
    alert("You won!");
  }, 1000);
}

function dark() {
  document.getElementById("game_grid").style.backgroundColor = "black";
  document.getElementsByClassName("card").style.backgroundColor = "black";
}

function light() {
  document.getElementById("game_grid").style.backgroundColor = "white";
}