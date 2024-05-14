const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");

const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");

const lowercaseCheck = document.querySelector("#lowercase");

const numbersCheck = document.querySelector("#numbers");

const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

// Set the length of Password
function handleSlider() {
   inputSlider.value = passwordLength;
   lengthDisplay.innerText = passwordLength;

   const min = inputSlider.min;
   const max = inputSlider.max;
   inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}

// Set the indicator
function setIndicator(color) {
   indicator.style.backgroundColor = color;
   indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
   return Math.floor(Math.random() * (max-min)) + min;        // Math.random -> generate number zero to 1
}

function generateRandomNumber() {
   return getRndInteger(0,9);
}

function generateLowercase() {
   return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase() {
   return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
   const randNum = getRndInteger(0, symbols.length);
   return symbols.charAt(randNum);
}

function calcStrength() {
   let hasUpper = false;
   let hasLower = false;
   let hasNum = false;
   let hasSym = false;

   if(uppercaseCheck.checked) hasUpper = true;
   if(lowercaseCheck.checked) hasLower = true;
   if(numbersCheck.checked) hasNum = true;
   if(symbolsCheck.checked) hasSym = true;

   if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
   } else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
      setIndicator("#ff0");
   } else{
      setIndicator("#f00");
   }
}

async function copyContent() {
   try{
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "Copied";

   }
   catch(e){
      copyMsg.innerText = "Failed";
   }

   copyMsg.classList.add("active");

   setTimeout(() => {
      copyMsg.classList.remove("active");
   },1500);

}

function shufflePassword(array) {
   for (let i = array.length - 1; i>0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
   }

   let str = "";
   array.forEach((el) => (str += el));
   return str;
}

function handleCheckBoxChange() {
   checkCount = 0;
   allCheckBox.forEach((checkbox) => {
      if(checkbox.checked)
         checkCount++;
   } )

   // Special Condition
   if(passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
   }
}

allCheckBox.forEach((checkbox) => {
   checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
   passwordLength = e.target.value;
   handleSlider(); 
})

copyBtn.addEventListener('click', () => {
   if(passwordDisplay.value)
      copyContent();
})

generateBtn.addEventListener('click', () => {
   // None of the checkbox are selected
   if(checkCount == 0) return;

   if(passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
   }

   // let's start the journey to find the new password 

   console.log("Staring the Journey");
   // remove old password
   password = "";

   let funArr = [];

   if(uppercaseCheck.checked)
      funArr.push(generateUppercase);

   if(lowercaseCheck.checked)
      funArr.push(generateLowercase);

   if(numbersCheck.checked)
      funArr.push(generateRandomNumber);

   if(symbolsCheck.checked)
      funArr.push(generateSymbol);

   // Compulsory addition
   for(let i=0; i<funArr.length; i++){
      password += funArr[i]();
   }
   console.log("Compulsory addition done");

   // remaining addition
   for(let  i=0; i<passwordLength-funArr.length; i++){
      let randIndex = getRndInteger(0, funArr.length);
      password += funArr[randIndex]();
   }
   console.log("Remaining addition done");

   // Shuffle the Password
   password = shufflePassword(Array.from(password)); 
   console.log("Shuffle Password done");

   // show in UI
   passwordDisplay.value = password;
   console.log("UI addition done");

   // calculate the strength
   calcStrength();
})
