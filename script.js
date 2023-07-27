const inputSlider=document.querySelector("[data-lengthSlider]");  //custom selector
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const cpyBtn=document.querySelector("[data-copy]");
const cpyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox");
const symbols='!@#$%^&*()_+-={}[]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");

//set passwordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerHTML=passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) / (max - min)) * 100 + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow="0 0 20px " + color;
    //shadow;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}

function generateRandomNumber(){
    return getRandomInteger(0,10);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbols(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    } 
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        cpyMsg.innerHTML="copied";
    }
    catch(e){
        cpyMsg.innerHTML="failed";
    }
    //to make copy wala span visible
    cpyMsg.classList.add("active");
    setTimeout(()=> {
        cpyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

cpyBtn.addEventListener('click', () => {
    console.log("error yahi hai");
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount<=0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    
    // let's start the journey to find password
    //remove old password
    password="";

    // let's put the stuff metioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols();
    // }

    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }

    //complsory addtion
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addittion
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;
    //calculate strength
    calcStrength();

})
