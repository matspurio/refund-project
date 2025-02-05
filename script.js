const form = document.querySelector("form")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expenseAmount = document.getElementById("amount")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")

// Total das despesas
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
expenseAmount.oninput = () => {
  // Obtém o valor do input removendo letras e mantendo apenas números.
  let value = expenseAmount.value.replace(/\D/g, "")

  // Transformando o valor em centavos. (Ex: 150/100 = 1.5 que é R$1,50)
  value = Number(value) / 100

  expenseAmount.value = value

  // Atualiza o valor do input com a função de formatação da moeda.
  expenseAmount.value = formatCurrencyBRL(value)
}

// Formatando moeda no padrão BRL
const formatCurrencyBRL = (value) => {
  value = value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  })

  return value
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
  event.preventDefault()

  // Criando objeto com detalhes da nova despesa.
  const newExpense = {
    id: new Date().getTime(), // Apenas para gerar um id aleatório, utilizei o método timestamp.
    expense: expense.value,
    category_id: category.value,
    // Selecionando as opções das categorias, e o texto que está no índice.
    category_name: category.options[category.selectedIndex].text,
    expenseAmount: expenseAmount.value,
    created_at: new Date().toLocaleString(),
  }

  // Chama a função que vai adicionar o item na lista.
  addExpense(newExpense)
  
}

// Função para adicionar a despesa na lista.
const addExpense = (newExpense) => {
  try {
    // Cria o elemento 'li' para adicionar o item(li) na lista(ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.expenseAmount
      .toUpperCase()
      .replace("R$", "")}`

    // Cria o botão para remover o item.
    const remove = document.createElement("img")
    remove.classList.add("remove-icon")
    remove.setAttribute("src", "img/remove.svg")
    remove.setAttribute("alt", "remover")

    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, remove)

    // Adiciona o item na lista.
    expenseList.append(expenseItem)
    
    // Chamar a função para limpar o formulário
    clearForm()

    // Atualiza os totais.
    updateTotals()


  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas!")
  }
}

// Atualiza os totais.
const updateTotals = () => {
  try {
    // Recupera todos os itens (li) da lista (ul).
    const items = expenseList.children
    
    // Atualiza a quantidade de itens da lista.
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variável para incrementar o total.
    let total = 0

    // Percorrer os itens da lista.
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      // Remover caracteres não numéricos e substituir ',' por '.'
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      value = parseFloat(value)

      total += Number(value)
    }

    expensesTotal.textContent = formatCurrencyBRL(total)

  } catch (error) {
    alert("Não foi possível atualizar os totais!")
    console.log(error)
  }
}

// Evento que captura o clique para remover os itens da lista.
expenseList.addEventListener('click', (event) => {
  // Verifica se o evento clicado é o ícone de remover.
  if (event.target.classList.contains("remove-icon")) {
    // Obter a li PAI do elemento clicado.
    const item = event.target.closest(".expense")

    // Remove o item da lista.
    item.remove()
  }

  // Atualiza os totais.
  updateTotals()
})

// Limpar o formulário
const clearForm = () => {
  expense.value = ""
  category.value = ""
  expenseAmount.value = ""

  // Coloca o foco no input da despesa.
  expense.focus()
}