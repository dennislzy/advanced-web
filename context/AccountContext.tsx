"use client"

import { createContext, useContext, ReactNode } from "react"

interface AccountContextType {
  account: string
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: ReactNode }) {
  // 寫死的帳號資訊
  const account = "test1@gmail.com"

  return (
    <AccountContext.Provider value={{ account }}>
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
}
