const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 654, 489, 54, -985],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const loanApproved = document.querySelector(".loanApproved");

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = ` <div class="movements">
        <div class="movements__row"> 
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} Rs </div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes}Rs`;

  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${outcomes}Rs`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * 1.2) / 100)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${Math.floor(interest)}Rs`;
};
//update UI
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);

  //display summary

  calcDisplaySummary(acc);
};

//display usernames

const usernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
usernames(accounts);

//Event Handlers
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  //this prevent form from submitting...
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and message
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner}`;
    containerApp.style.opacity = 100;
  }

  updateUI(currentAccount);
});

//handeling transfers

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("lkj");

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    // receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //updating UI
    updateUI(currentAccount);
  }
});

//Requesting the loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(function (acc) {
      return acc >= loanAmount * 0.1;
    })
  ) {
    setTimeout(function () {
      currentAccount.movements.push(loanAmount);
      //update UI
      updateUI(currentAccount);
      console.log("done");
      loanApproved.style.opacity = 100;
    }, 10000);
  }
});

//closing the account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("deleted");

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
    //clear input fields
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

///lectures, not the part of application that we are building. 😀😀
//CODING CHALLANGE
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and 
the LAST TWO dogs actually have cats, not dogs!
 So create a shallow copy of Julia's array,
  and remove the cat ages from that copied
   array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult
 ("Dog number 1 is an adult, and is 5 years old") or a puppy
  ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK */

// const checkDogs = function (dogsJulia, dogskate) {
//   dogsJuliacorrect = dogsJulia.slice(1, 3);
//   console.log(dogsJuliacorrect);

//   const dogs = [...dogsJuliacorrect, ...dogskate];

//   dogs.foreach(function (dog, i) {
//     if (dogs > 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1}  is still a puppy 🐶`);
//     }
//   });
// };

// const dogsjulia = [3, 5, 2, 12, 7];
// const dogskate = [4, 1, 15, 8, 3];

//map method
//consider values of the array in dollars and we have to convert them into rupees,
// 1 dollar = 75 rupees.

// const movements = [
//   200,
//   450,
//   -400,
//   3000,
//   -650,
//   -130,
//   70,
//   1300,
//   654,
//   489,
//   54,
//   -985,
// ];
// const dollarTorupee = 75;

// const movementsRupee = movements.map(function (mov) {
//   return mov * dollarTorupee;
// });

// console.log({ movementsRupee });

// const user = "Steven Thomas Williams";

// const username = user
//   .toLocaleLowerCase()
//   .split(" ")
//   .map(function (name) {
//     return name[0];
//   })
//   .join("");
// console.log(username);

// const user1 = "Mahendra Singh Dhoni";

// const usernames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word[0])
//       .join("");
//   });
// };
// usernames(accounts);
// console.log(accounts);

// //filter method

// const movements = [
//   200,
//   450,
//   -400,
//   3000,
//   -650,
//   -130,
//   70,
//   1300,
//   654,
//   489,
//   54,
//   -985,
// ];
// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });

// console.log(withdrawals);

// //reduce method
// console.log(movements);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(acc);

//   return acc + cur;
// }, 0);

// console.log(balance);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 654, 489, 54, -985];

// const dollarTorupee = 75;
// const totalDeposit = movements
//   .map((mov) => mov * dollarTorupee)
//   .filter((mov) => {
//     return mov > 0;
//   })
//   .reduce(function (acc, cur) {
//     return acc + cur;
//   }, 0);

// console.log(totalDeposit);

// Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

// 1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
// 2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

// GOOD LUCK 😀

// const calcAverageHumanAge = function (ages) {
//   let humanAge = 0;
//    const dogAge = ages.map(function (age) {
//    const calc = function(){
//     if (age <= 2) {
//       humanAge = 2 * age;
//     } else {
//       humanAge = 16 + age * 4;
//     }
//     console.log(ages);
//   };

// });
