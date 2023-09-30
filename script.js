// 'use strict';

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML= '';

  //here if we directly add movements.sort() then it will sort actual aaray in accounts but we dont want that 
  //so we are using slice to crrate a copy and will sort copied array to just dipaly in sorted manner 
  const movs = sort? movements.slice().sort((a,b) => a-b): movements;

  movs.forEach( function(mov, i) {
    const type =mov > 0 ?'deposit' :'withdrawal'


    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type} </div>
    <div class="movements__value">${mov}</div>
  </div>`;

  containerMovements.insertAdjacentHTML('afterbegin', html)//try it with beforeend

  }) 
}

//displayMovements(account1.movements);

const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLocaleLowerCase().split(' ').map(name=> name[0].toLowerCase()).join('');
  })
  
}

//console.log(containerMovements.innerHTML)

createUsernames(accounts)
// console.log(accounts)

const updateUI  = function(currentAccount) {
  //display movements 
  displayMovements(currentAccount.movements);

  //display balance 
  calcDisplayBalanace(currentAccount);

  //display summary 
  calcDisplaySummary(currentAccount)
}


const calcDisplayBalanace  = function(acc) {
  acc.balance = acc.movements.reduce((acc,mov) => acc+mov,0);

  labelBalance.textContent= `Rs.${ acc.balance}`
}

//calcDisplayBalanace(account1.movements);

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov=> mov >0).reduce((acc,mov)=> acc+mov,0);
  labelSumIn.textContent= `Rs.${incomes}`

  const out = acc.movements.filter(mov=> mov < 0).reduce((acc,mov)=> acc+mov,0);
  labelSumOut.textContent = `Rs.${Math.abs(out)}`

  const interest = acc.movements.filter(mov=> mov >0).map(deposit => deposit*acc.interestRate/100)
  .filter((int, i, arr)=>{
    console.log(arr) 
    return int >=1
  }).reduce((acc,int)=> acc+int,0)
  labelSumInterest.textContent= `Rs.${interest}`
}

//calcDisplaySummary(account1.movements);
let  currentAccount  

btnLogin.addEventListener('click', function(e) {
  //prevent form from submitting
  e.preventDefault();
  // console.log("LOGIN")
  currentAccount = accounts.find(acc=>acc.username === inputLoginUsername.value)
  //console.log(currentAccount)
  
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    //display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //claer the input fields 
    inputLoginUsername.value = inputLoginPin.value =''
    //to avoid the blinking of cursor
    //inputLoginPin.blur();

    updateUI(currentAccount);
  }
})

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciveerAcc = accounts.find(acc=>acc.username === inputTransferTo.value) 
  console.log(amount, reciveerAcc)
  inputTransferAmount.value= inputTransferTo.value='';

  if(amount > 0 && currentAccount.balance >= amount && reciveerAcc?.username !== currentAccount.username && reciveerAcc ){
    currentAccount.movements.push(-amount);
    reciveerAcc.movements.push(amount)
    updateUI(currentAccount)
  }
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  //console.log("delete")

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin  ){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);

    //delete account
    accounts.splice(index,1);

    //hide UI 
    containerApp.style.opacity=0;

  }

  inputCloseUsername.value = inputClosePin.value=''
  
})

//loan 
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount> 0 && currentAccount.movements.some(mov=> mov >=0.1*amount)) {

    //add amounnt 
    currentAccount.movements.push(amount);

    //update UI 
    updateUI(currentAccount);
  }
  inputLoanAmount.value= '';
})

let sorted = false

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted=!sorted
})



// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////


// let arr = ['a','b','c','d','e','f'];

// console.log(arr.slice(2));//start extracting the elements from given index
// console.log(arr.slice(2,4))
// console.log(arr.slice(-2))//last 2 elements 
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2))
// console.log(arr.slice())
// console.log([...arr])

// //splice // changes in original array 
// //console.log(arr.splice(2));
// //console.log(arr.splice(-1))
// console.log(arr.splice(1, 2))
// console.log(arr);

// //reverse // it will change the original array 
// const arr2 = ['j','i','h','g','f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //concat 
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //join 
// console.log(letters.join('-'))



// const arr =[23,11,64];
// console.log(arr[0]);
// console.log(arr.at(0));

// //getting the last element 
// console.log(arr[arr.length-1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1))

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// // for(const movement of movements) {
//   for(const [i, movement] of movements.entries()) {
//   if(movement > 0) {
//     console.log (`Movement ${i+1}: you deposited ${movement}`)
//   } else {
//     console.log(`Movement ${i+1}: You withdrew ${Math.abs(movement)}`)
//   }
// }
// console.log("-FOR EACH -----------")
// //movement - current index value then index then arary should pass 
// movements.forEach(function(movement, index, array) {
//   if(movement > 0) {
//     console.log (`Movement ${index+1}: you deposited ${movement}`)
//   } else {
//     console.log(`Movement ${index+1}: You withdrew ${Math.abs(movement)}`)
//   }
// })

// //0:function(200)
// //1:function(450)

// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
//   ]);

//   currencies.forEach(function(value, key, map) {
//     console.log(`${key} :${value} `)
//   })

//   const currenciesUnique = new Set(['USD','EUR','INR','USD'])

//   console.log(currenciesUnique)

//   currenciesUnique.forEach(function(value, set) {
//     console.log(`${value}`);
//   })


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUSD = 1.1;

// // const movementsUSD = movements.map(function(mov) {
// // return mov*eurToUSD
// // })

//  const movementsUSD = movements.map(mov=>  mov*eurToUSD)

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDFor=[];
// for(const mov of movements) {
//   movementsUSDFor.push(mov*eurToUSD)
// }

// console.log(movementsUSDFor)

// const movementDescriptions = movements.map((movement,i) => 
//   `Movement ${i+1}: You ${movement > 0 ? 'deposited' : 'withdrew'} ${Math.abs(movement)}`

//   // if(movement > 0) {
//       //   return (`Movement ${i+1}: you deposited ${movement}`)
//       // } else {
//       //  return (`Movement ${i+1}: You withdrew ${Math.abs(movement)}`)
//       // }
// )

// console.log(movementDescriptions)


// const deposits = account1.movements.filter(function(mov) {
//   return mov > 0
// })
// console.log(deposits)


// const depositsFor =[];
// for (const mov of account1.movements){
//   if(mov > 0)
//   depositsFor.push(mov)
// }

// console.log(depositsFor)

// const withdrawls = account1.movements.filter(mov=> mov <0)
// console.log(withdrawls)

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements)

// //acc - accumulator -is like a snowball- previous sum of all vvalues
// // const balance = movements.reduce(function(acc,cur,  i, arr) {
// //   console.log(`Iteration ${i} :${acc}`)
// //   return acc+cur;
// // }, 0 ) //0 is intial value of accumulator parameter

// const balance = movements.reduce((acc,cur,  i, arr) => acc+cur, 0 ) //0 is intial value of accumulator parameter


// console.log(balance)

// let balance2 = 0;
// for(const mov of movements){
//   balance2 += mov;
// }
// console.log(balance2);

// //maximum balance 
// const max = movements.reduce((acc,mov) => acc > mov ? acc:mov ,movements[0])

// console.log(max);

// //map filter reduce 
// function calcAverageHumanAge(ages) {
//   let humanAges = ages.map((age) => age <= 2 ? age * 2 : 16 + age * 4
//   )
//   console.log(humanAges);
//   humanAges = humanAges.filter((age) => age >= 18
//   )
//   console.log(humanAges);

//   // const avgAgesum = humanAges.reduce((acc, age) => acc + age, 0) / humanAges.length;

//   const avgAgesum = humanAges.reduce((acc, age, i, arr) => acc + age / arr.length, 0)

//   return avgAgesum
// }

//chaning of funcion
// function calcAverageHumanAge(ages) {
//   const avgAgesum = ages.map((age) => age <= 2 ? age * 2 : 16 + age * 4)
//   .filter((age) => age >= 18)
//   .reduce((acc, age, i, arr) => acc + age / arr.length, 0)

//   return avgAgesum
// }


// ages1 = [5, 2, 4, 1, 15, 8, 3]
// console.log(ages1.length)
// //console.log(humanAges);
// const age = calcAverageHumanAge(ages1);
// console.log(age)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUSD = 88.46;
// const totalDepositsInRupees = movements
//       .filter( mov=> mov < 0)
//       // .map(mov=> mov * eurToUSD )
//       .map((mov,i,arr)=> {
//         console.log(arr);
//         return mov * eurToUSD
//       } )
//       .reduce((acc, mov) => acc+mov,0)
// console.log(totalDepositsInRupees)

// //it will return the first value which meets the condition 
// //it check while condition is met for 1st time then it return the results
// const ava = movements.find(mov => mov <0)
// console.log(movements);
// console.log(ava);

// console.log(accounts)

// const account = accounts.find(acc => acc.owner==='Jessica Davis')
// // console.log(account)
// console.log(movements)
// console.log(movements.includes(-130))

// //some method - checjk whether condition satisfy once in array 
// //checking whether if any deposit means positive value 
// console.log(movements.some(mov=> mov===-130))
// const anyDeposits = movements.some(mov=> mov>0)
// console.log(anyDeposits);

// //every method
// //all elements of array should satisfy the condition
// console.log(movements.every(mov => mov > 0)) 
// console.log(account4.movements.every(mov => mov > 0))

// //seprate callback 
// const deposit = mov => mov >0;
// console.log(movements.some(deposit))
// console.log(movements.every(deposit))
// console.log(movements.filter(deposit))

// //flat method - it goes only 1 level deep 
// const arr = [[1,2,3],[4,5,6],7,8];
// console.log(arr.flat())

// const arrdeep = [[[1,2],3],[4,5,6],7,8];
// console.log(arrdeep.flat(2));

// // const accountMovements = accounts.map(acc=> acc.movements);
// // console.log(accountMovements)
// // const allMovements = accountMovements.flat();
// // console.log(allMovements)
// //const overAllBalance = allMovements.reduce((acc,mov)=> acc+mov,0)

// //flat
// const overAllBalance = accounts.map(acc=> acc.movements)
//                       .flat()
//                       .reduce((acc,mov)=> acc+mov,0)

// //flatMap
// const overAllBalance2 = accounts.flatMap(acc=> acc.movements)
//                       .reduce((acc,mov)=> acc+mov,0)


// console.log(overAllBalance,overAllBalance2)

// //sort method  - work on strings 
// //it will mutate the original aaray 
// const owners = ['Jonas','Jack','Adam','Martha']
// console.log(owners.sort());
// console.log(owners)
// console.log(movements);
// //console.log(movements.sort()) //take a look at this 

// //return < 0 a,b(keep order)
// //return > 0 b,a(switch order)
// //ascending 
// // const sorted = movements.sort((a,b) => {
// // if(a>b) return 1;
// // if(a<b) return -1;
// // })

// const sorted = movements.sort((a,b) => a-b) //if a is greater than b then it will return positive value else it will return negative number same as -1
// //descending
// console.log(sorted)
// // const reversesorted = movements.sort((a,b) => {
// //   if(a>b) return -1;
// //   if(a<b) return 1;
// //   })

// const reversesorted = movements.sort((a,b) => b-a)

// console.log(reversesorted)

// //console.log(movements)

// console.log([1,2,3,4,5]);
// console.log(new Array(1,2,3,4,5,6))

// const x = new Array(7);
// console.log(x)

// x.fill(1);
// console.log(x)

// const arr= [1,2,3,4,5,6,7]
// arr.fill(23, 2,4)
// console.log(arr);

// //array.from 
// const y = Array.from({length:7},()=> 1)
// console.log(y)

// const z= Array.from({length:7} , (cur,i)=>i+1 )
// console.log(z)

// //first letter of each word should capital but some words are excpetions 

// const convertTitleCase = function(title) {

//   const capitlize = str => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ['a','an','the','but','or','on','in','with','and'];
//   const titleCase = title.toLowerCase().split(' ')
//   .map(word => exceptions.includes(word) ? word : capitlize(word)).join(' ');
//   return capitlize(titleCase);
// }

// console.log(convertTitleCase('this is a nice title'))
// console.log(convertTitleCase('this is a LONG title but not too long'))
// console.log(convertTitleCase('and here is another title with an EXAMPLE'))

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
  ]

  const eatingHabit =((dog) => {
    //console.log(dog)
    if(dog.curFood < (dog.recommendedFood *0.90) )
    return "too little"
    else if (dog.curFood > (dog.recommendedFood *1.10))
    return "too much";
  else  if(dog.curFood === dog.recommendedFood)
  return "exactly"
  else 
  return "okay";
  })

  dogs.forEach(function(dog) {
    dog.recommendedFood =Math.trunc( dog.weight ** 0.75 * 28);
  })

  // dogs.forEach(dog=>{
  //   if(dog.owners.find(owner=> owner==='Sarah') )
  //   eatingHabit(dog)
  // })

  const dogSarah = dogs.find(dog=>dog.owners.includes('Sarah'));
  console.log(dogSarah)
  console.log(`Sarah's dog is eating too ${dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'}`)

  //const ownersEatTooMuch = dogs.filter(dog=> eatingHabit(dog)==='too much').map(dog=>dog.owners).flat();

  const ownersEatTooMuch = dogs.filter(dog=>dog.curFood > dog.recommendedFood).flatMap(dog=>dog.owners);
  console.log(ownersEatTooMuch);

  console.log(`${ownersEatTooMuch.join(' and ') }'s dogs eat too much!`);

  //const ownersEatTooLittle = dogs.filter(dog=> eatingHabit(dog)==='too little').map(dog=>dog.owners).flat();

  const ownersEatTooLittle = dogs.filter(dog=>dog.curFood < dog.recommendedFood).flatMap(dog=>dog.owners);
  console.log(ownersEatTooLittle)

  console.log(`${ownersEatTooLittle.join(' and ') }'s dogs eat too little!`);

console.log(dogs.some(dog=>dog.curFood === dog.recommendedFood ))

const checkEatingOkay = dog => dog.curFood > dog.recommendedFood*0.9 && dog.curFood < dog.recommendedFood*1.1

console.log(dogs.some(checkEatingOkay ))

console.log(dogs.filter(checkEatingOkay))

const dogsCopy = dogs.slice().sort((a,b)=>a.recommendedFood - b.recommendedFood);
console.log(dogsCopy)

console.log(dogs);

