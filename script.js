$(function () {
  // Initializes UI with current pet state
  checkAndUpdatePetInfoInHtml();

  // Button handlers
  $('.treat-button').click(clickedTreatButton);
  $('.play-button').click(clickedPlayButton);
  $('.exercise-button').click(clickedExerciseButton);
  $('.nap-button').click(clickedNapButton); // extra action


  $(document).keypress(function (e) {
    // jQuery normalizes: e.which === 32 is Space
    if (e.which === 32) {
      e.preventDefault();
      toggleHappyNormal();
    }
  });

  // showing the hover the image to reveal the name
  $('.pet-image')
    .mouseover(showNameOnHover)
    .mouseout(hideHoverName);
  

     $('.tired-image')
    .mouseover(showNameOnHover)
    .mouseout(hideHoverName);


 $('.nap-image')
    .mouseover(showNameOnHover)
    .mouseout(hideHoverName);


 $('.treat-image')
    .mouseover(showNameOnHover)
    .mouseout(hideHoverName);


 $('.happy-image')
    .mouseover(showNameOnHover)
    .mouseout(hideHoverName);

});

// --------- PET STATE ---------
var pet_info = {
  name: "Nova",
  weight: 12,      // pounds
  happiness: 5,    // tail wags / min
  energy: 5        // extra stat paired with Nap action
};

var $petImg = $('.pet-image');


var $petHap   = $('<img>').attr('src','images/Happy.png');
var $petTire  = $('<img>').attr('src','images/Tired.png');   
var $petNap   = $('<img>').attr('src','images/Nap.png');   
var $petTreat = $('<img>').attr('src','images/Treat.png');    

var NORMAL_SRC = $petImg.attr('src'); // treat this as the "normal photo"
var HAPPY_SRC  = $petHap.attr('src');
var FOOD_SRC   = $petTreat.attr('src');
var TIRED_SRC  = $petTire.attr('src');
var NAP_SRC    = $petNap.attr('src');



// --------- ACTIONS ---------
function clickedTreatButton() {
  // Increase pet happiness and weight
 // if(pet_info.weight > 20) 
  pet_info.happiness += 2;
  pet_info.weight += 1;
  pet_info.energy = Math.min(10, pet_info.energy + 1);

  setPhoto(FOOD_SRC);
  isHappyShown = true;
  speak("Yum! Treats make me so happy! ");
  checkAndUpdatePetInfoInHtml();
}

function clickedPlayButton() {

   if (pet_info.energy <= 0) {
    setPhoto(TIRED_SRC || NAP_SRC);
    speak("I'm out of energy! I can't play until I rest.");
    setPhoto(TIRED_SRC);
    checkAndUpdatePetInfoInHtml();
    return;
  }else{
    
  // Increase happiness, decrease weight
  pet_info.happiness += 2;
   pet_info.weight = Math.max(0, pet_info.weight - 1);
  pet_info.energy = Math.max(0, pet_info.energy - 1);
  setPhoto(HAPPY_SRC); 
  isHappyShown = false;
  speak("That was fun! Can we play again?");
  checkAndUpdatePetInfoInHtml();
  }
}

function clickedExerciseButton() {
  // Decrease happiness, decrease weight
  if (pet_info.energy <= 0 || pet_info.energy <=1) {
    setPhoto(TIRED_SRC);
    speak("I'm out of energy! I can't play until I rest.");
    checkAndUpdatePetInfoInHtml();
    return;
  }else{
  pet_info.happiness = Math.max(0, pet_info.happiness - 1);
  pet_info.weight = Math.max(0, pet_info.weight - 2);
  pet_info.energy = Math.max(0, pet_info.energy - 2);
  setPhoto(TIRED_SRC); // back to normal photo
  isHappyShown = false;
  speak("Phew… workout time!");
  checkAndUpdatePetInfoInHtml();
  }
}

// Extra action paired with "energy" stat
function clickedNapButton() {
  pet_info.energy = Math.min(10, pet_info.energy + 3);
  pet_info.happiness = Math.min(10, pet_info.happiness + 1);
  setPhoto(NAP_SRC);
  // keep weight unchanged on nap
  speak("Zzz… that nap was perfect.");
  checkAndUpdatePetInfoInHtml();
}

// Image toggle used by click and spacebar
function toggleHappyNormal() {
  if ($petImg.attr('src') === HAPPY_SRC) {
    setPhoto(NORMAL_SRC);
    isHappyShown = false;
    speak("Back to my normal look.");
  } else {
    setPhoto(HAPPY_SRC);
    isHappyShown = true;
    speak("I'm so happy!");
  }
}

// --------- UI / VALIDATION HELPERS ---------
function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
}

function checkWeightAndHappinessBeforeUpdating() {
  // Prevent going below zero
  if (pet_info.weight < 0) pet_info.weight = 0;
  if (pet_info.happiness < 0) pet_info.happiness = 0;
  if (pet_info.energy < 0) pet_info.energy = 0;
}

function updatePetInfoInHtml() {
  $('.name').text(pet_info.name);
  $('.weight').text(pet_info.weight);
  $('.happiness').text(pet_info.happiness);
  $('.energy').text(pet_info.energy);
}

/** Helper to switch photo */
function setPhoto(src) {
  $petImg.attr('src', src);
}

/** Visual notification (no alerts/console) */
function speak(message) {
  var $c = $('#pet-comment');
  $c.stop(true, true) // clear animations/queue so rapid clicks don't stack
    .hide()
    .text(message)
    .fadeIn(200)
    .delay(1200)
    .fadeOut(350);
}

/** Show name on hover using .mouseover() */
function showNameOnHover() {
  var $c = $('#pet-comment');
  $c.stop(true, true)
    .hide()
    .text("This is " + pet_info.name)
    .fadeIn(150);
}

/** Hide name message after hover */
function hideHoverName() {
  $('#pet-comment').stop(true, true).fadeOut(150); //help to show name when aboved
}
