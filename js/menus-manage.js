/* Language section variables */
const langBtn = document.getElementById('language');
const langMenu = document.querySelector('.language-options');

/* Cipher Mode section variables */
const cipherModeBtn = document.getElementById('cipher-selector-button');
const cipherMenu = document.querySelector('.modes-mobile__cipher-options');
const cipherRadios = document.getElementsByName('cipher-modes-mobile');
const cipherLabel = document.getElementById('cipher-selector-label');

/* Radio groups turned into arrays */
const desktopCipher = Array.from(document.getElementsByName('cipher-modes'));
const mobileCipher = Array.from(document.getElementsByName('cipher-modes-mobile'));

/* ------------------------------ Functions zone ------------------------------ */

function dropDownMenu(checkbox, menu) {
  document.addEventListener('click', (event) => {
    if (event.target !== checkbox) {
      checkbox.checked = false;
    }
    menu.style.display = checkbox.checked ? 'block' : 'none';
  });
}

function optionSelector(radios) {
  for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function() {  //Add listener to each input radio

      //This section doesn't run until the 'change' event is triggered (until there is a change in the group of radios)
      for (let j = 0; j < radios.length; j++) {
        let li = radios[j].parentNode;
        li.classList.remove('selected-radio');
      }
      
      let liSelected = this.parentNode;    //"this" points to the input radio that triggered the change in the radio group
      liSelected.classList.add('selected-radio');
    });
  }
}

//Pick up the label vinculed to the selected radio and insert its text to the main label
function updateLabelText(label, radio) {
  if (radio.checked) {
    label.textContent = radio.nextElementSibling.textContent;
  }
}

/* 
  This function allows the selected cipher options to be synchronized, either by choosing them from the main menu
  or from the mobile menu. This is in order to facilitate tasks when recognizing which encryption mode the user
  has selected and also to provide the user with a more comfortable and intuitive experience when changing resolutions.
*/
let isProgrammaticChange = false;
function cipherModeSynchronizer(event) {
  if (isProgrammaticChange) {  //This conditional checks whether the 'change' event has been triggered by a user action or is of a programmatic nature (triggered by the code itself). I had to add this conditional to avoid an infinite recursion generated by the last line of this function, which is explained there.
    isProgrammaticChange = false;
    return;
  }

  let targetGroup = event.target.name;
  let targetRadio = event.target.id.includes("mobile") 
    ? event.target.id.split('-')[0] 
    : event.target.id;

  let siblingGroup = 
    targetGroup === 'cipher-modes' ? mobileCipher : desktopCipher;
  let siblingRadio = siblingGroup.find(radio => radio.id.includes(targetRadio));

  siblingRadio.checked = true;
  isProgrammaticChange = true;
  siblingRadio.dispatchEvent(new Event('change')); //This line allows manually triggering any event handler registered for the 'change' event on the siblingRadio. I had to add it because the functions optionSelector() and updateLabelText() were not correctly detecting the change that occurred in the siblingRadio. This line also triggers this function again, so I had to add the conditional explained at the top of the function.
}


dropDownMenu(langBtn, langMenu); 
dropDownMenu(cipherModeBtn, cipherMenu);
optionSelector(cipherRadios);