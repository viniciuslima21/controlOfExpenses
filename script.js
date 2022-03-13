// Selecting HTML items
const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

// Catching localStorage values
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))

// All transactions
let transactions = localStorageTransactions !== null ? localStorageTransactions : []

// Adding transacations in HTML
const addTransactionIntoDOM = ({ id, name, amount }) => {
    const operator = amount < 0 ? '-' : '+'
    const cssClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(cssClass)
    li.innerHTML = `
        ${name} <span>${operator} R$ ${amountWithoutOperator}
        </span><button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionUl.prepend(li)
}

// Removing transactions
const removeTransaction = id => {
    transactions = transactions.filter(transaction => transaction.id !== id)
    init()
}

// Getting all kind of transactions
const getTotal = transactionsAmount => transactionsAmount
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const getIncome = transactionsAmount => transactionsAmount
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getExpense = transactionsAmount => Math.abs(transactionsAmount
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

// Adding values in HTML
const updateBalanceValues = () => {
    const transactionsAmount = transactions.map(({ amount }) => amount)
    const total = getTotal(transactionsAmount)
    const income = getIncome(transactionsAmount)
    const expense = getExpense(transactionsAmount)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

// Adding values in localStorage
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

// Generating random ID
const generateId = () => Math.round(Math.random() * 1000)

// Starting all
const init = () => {
    updateBalanceValues()
    updateLocalStorage()
    if (transactions.length === 0) {
        transactionUl.innerHTML = '<p>Nenhuma transação no momento.</p>'
        return
    }

    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
}

init()

// Adding transactions to array
const addToTransactinsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

// Cleaning Inputs
const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

// Catching form values
const handleFormSubmit = e => {
    e.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (isSomeInputEmpty) {
        alert('ERRO: O nome ou valor da transação não foi informado!')
        return
    }

    addToTransactinsArray(transactionName, transactionAmount)
    cleanInputs()
    init()
}

form.addEventListener('submit', handleFormSubmit)