import React, { useContext, useState } from "react"
import { v4 as uuidV4 } from "uuid"
import useLocalStorage from "../hooks/useLocalStorage"

const BudgetsContext = React.createContext()

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

export function useBudgets() {
  return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets", [])
  const [expenses, setExpenses] = useLocalStorage("expenses", [])

  function getBudgetExpenses(budgetId) {
    return expenses.filter(expense => expense.budgetId === budgetId)
    // So return the expenses where the budgetId is = to the budgetId we pass in. Eg: pass in the entertainment budget id and we will get only the entertainment budget.
  }
  function addExpense({ description, amount, budgetId }) {
    setExpenses(prevExpenses => {
      return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }]
    })
  }
  function addBudget({ name, max }) {
    setBudgets(prevBudgets => {
      if (prevBudgets.find(budget => budget.name === name)) {
        // We check it the budget.name is equal to the name we pass in. If so, we dont add it.
        return prevBudgets
      }
      return [...prevBudgets, { id: uuidV4(), name, max }] // uuid creates new unique id
    })
    // So we took our previous budget, which is a "previousBudgets" array, we keep all of them and we added a new budget to it with a new "id" and a "name" and "max" value to go with it.
  }
  function deleteBudget({ id }) {
    setExpenses(prevExpenses => {
      // take all the expenses associated with prevExpenses and move it to uncategorized
      return prevExpenses.map(expense => {
        if (expense.budgetId !== id) return expense // if the expense budget ID is not equal to the current ID, just return it normally because its not the correct budget
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID } // else, we want to take the entire expense and keep everything the same except we want to change the budgetId to our uncategorized budget ID.
      })
    })

    setBudgets(prevBudgets => {
      return prevBudgets.filter(budget => budget.id !== id)
    })
  }
  function deleteExpense({ id }) {
    setExpenses(prevExpenses => {
      return prevExpenses.filter(expense => expense.id !== id)
    })
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children} 
      {/* With this code, all the children we pass in to value are now accessible in the App.js  */}
    </BudgetsContext.Provider>
  )
}