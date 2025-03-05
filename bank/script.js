"use strict"

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  /**
   * TODO add movements date
   */
}

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
}

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
}

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
}

const accounts = [account1, account2, account3, account4]

// Elements
const labelWelcome = document.querySelector(".welcome")
const labelDate = document.querySelector(".date")
const labelBalance = document.querySelector(".balance__value")
const labelSumIn = document.querySelector(".summary__value--in")
const labelSumOut = document.querySelector(".summary__value--out")
const labelSumInterest = document.querySelector(".summary__value--interest")
const labelTimer = document.querySelector(".timer")

const containerApp = document.querySelector(".app")
const containerMovements = document.querySelector(".movements")

const btnLogin = document.querySelector(".login__btn")
const btnTransfer = document.querySelector(".form__btn--transfer")
const btnLoan = document.querySelector(".form__btn--loan")
const btnClose = document.querySelector(".form__btn--close")
const btnSort = document.querySelector(".btn--sort")

const inputLoginUsername = document.querySelector(".login__input--user")
const inputLoginPin = document.querySelector(".login__input--pin")
const inputTransferTo = document.querySelector(".form__input--to")
const inputTransferAmount = document.querySelector(".form__input--amount")
const inputLoanAmount = document.querySelector(".form__input--loan-amount")
const inputCloseUsername = document.querySelector(".form__input--user")
const inputClosePin = document.querySelector(".form__input--pin")

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
])

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))

  const daysPassed = calcDaysPassed(new Date(), date)

  if (daysPassed == 0) return "Today"
  if (daysPassed == 1) return "Yesterday"
  if (daysPassed <= 7) return `${daysPassed} days ago`
  else {
    // const day = `${date.getDate()}`.padStart(2, "0")
    // const month = `${date.getMonth() + 1}`.padStart(2, "0")
    // const year = date.getFullYear()

    // return `${day}/${month}/${year}`
    return new Intl.DateTimeFormat(locale).format(date)
  }
}

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value)
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ""
  //use slice to create a copy
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawl"
    const date = new Date(acc.movementsDates[i])
    const displayDate = formatMovementDate(date, acc.locale)

    const formattedMov = formatCurr(mov, acc.locale, acc.currency)

    /* <div class="movements__value">${mov}EUR</div> */
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>`
    containerMovements.insertAdjacentHTML("afterbegin", html)
  })
}

const user = "Steven Thomas Wiliams"

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("")
    //console.log(acc.userName)
  })
}
createUsername(accounts)
//console.log(this.userName)

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency)
  // labelBalance.textContent = `${acc.balance} EUR`
}
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency)
  // `${incomes}euro`

  const outs = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = formatCurr(Math.abs(outs), acc.locale, acc.currency)
  // `${Math.abs(outs)}euro`

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((inter) => inter >= 1)
    .reduce((acc, inter) => acc + inter, 0)
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency)
  // `${interest}euro`
}

const updateUI = function (currentAccount) {
  displayMovements(currentAccount)
  calcDisplaySummary(currentAccount)
  calcDisplayBalance(currentAccount)
}

let currentAccount, timer

btnLogin.addEventListener("click", function (e) {
  //prevent page reload when submit
  e.preventDefault()

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  )
  //same as currentAccount &&..... check if exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`
    inputLoginPin.value = inputLoginUsername.value = ""
    inputLoginPin.blur() //lose focus on btn after login
    containerApp.style.opacity = 100

    const now = new Date()
    //if day no is smaller than 2 digits add a padding
    // const day = `${now.getDate()}`.padStart(2, "0")
    // const month = `${now.getMonth() + 1}`.padStart(2, "0")
    // const year = now.getFullYear()
    // const hour = `${now.getHours()}`.padStart(2, "0")
    // const min = `${now.getMinutes()}`.padStart(2, "0")
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`
    //manual setup format

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      //month: "long",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    }
    //manual setup locale
    // labelDate.textContent = new Intl.DateTimeFormat("en-RO", options).format(now)
    //take locale format from user browser
    //const locale = navigator.language
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now)
    if (timer) clearInterval(timer)

    timer = startLogOutTimer()

    updateUI(currentAccount)
  } else {
    prompt("incorrect pin")
    /**
     * TODO whoe window with wrong pin or username
     */
  }
})

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const recieverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  )
  inputTransferAmount.value = inputTransferTo.value = ""
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.push(-amount)
    recieverAcc.push(amount)
    currentAccount.movementsDates.push(new Date().toISOString())
    recieverAcc.movementsDates.push(new Date().toISOString())
  }
  updateUI(currentAccount)
  clearInterval(timer)
  timer = startLogOutTimer()
})

const startLogOutTimer = function () {
  let time = 300
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0)
    const sec = String(Math.trunc(time % 60)).padStart(2, 0)
    labelTimer.textContent = `${min}:${sec}`
    labelTimer.textContent = time

    if (time === 0) {
      clearInterval(timer)
      labelWelcome.textContent = "Log in to get started"
      containerApp.style.opacity = 0
    }
    time--
  }
  tick()
  const timer = setInterval(tick, 1000)
  return timer
}

btnLoan.addEventListener("click", function (e) {
  e.preventDefault()
  const amount = Number(inputLoanAmount.value)

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    /**
     * TODO add error msg if the sum is too big
     */
    setTimeout(function () {
      currentAccount.movements.push(amount)
      currentAccount.movementsDates.push(new Date().toISOString())
      updateUI(currentAccount)
      clearInterval(timer)
      timer = startLogOutTimer()
    }, 2500)
  }
  inputLoanAmount.value = ""
})

btnClose.addEventListener("click", function (e) {
  e.preventDefault()
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = ac.findIndex(
      (acc) => acc.userName === currentAccount.userName
    )

    accounts.splice(index, 1)
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = ""
})

let sorted = false

btnSort.addEventListener("click", function (e) {
  e.preventDefault()
  displayMovements(currentAccount, !sorted)
  sorted = !sorted
})

// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`

/////////////////////////////////////////////////
/**
 * TODO pop ups / proccecieng while req loan pass type html
 */
