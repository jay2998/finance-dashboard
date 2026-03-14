const BASE_URL = 'https://69b3babbe224ec066bdce6d9.mockapi.io'

export async function fetchTransactions() {
  const res = await fetch(`${BASE_URL}/transactions`)
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
}

export async function addTransaction(transaction) {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  })
  if (!res.ok) throw new Error('Failed to add transaction')
  return res.json()
}

export async function updateTransaction(id, transaction) {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  })
  if (!res.ok) throw new Error('Failed to update transaction')
  return res.json()
}

export async function deleteTransaction(id) {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete transaction')
  return res.json()
}

export async function fetchBudgets() {
  const res = await fetch(`${BASE_URL}/budgets`)
  if (!res.ok) throw new Error('Failed to fetch budgets')
  return res.json()
}

export async function addBudget(budget) {
  const res = await fetch(`${BASE_URL}/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  })
  if (!res.ok) throw new Error('Failed to add budget')
  return res.json()
}

export async function updateBudget(id, budget) {
  const res = await fetch(`${BASE_URL}/budgets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  })
  if (!res.ok) throw new Error('Failed to update budget')
  return res.json()
}

export async function deleteBudget(id) {
  const res = await fetch(`${BASE_URL}/budgets/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete budget')
  return res.json()
}