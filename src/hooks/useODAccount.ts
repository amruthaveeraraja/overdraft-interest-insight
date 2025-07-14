import { useState, useEffect } from "react";

interface ODAccount {
  name: string;
  odLimit: number;
  interestRate: number;
  startDate: Date;
  bankName?: string;
}

interface Transaction {
  id: string;
  date: Date;
  type: 'debit' | 'credit';
  amount: number;
  description?: string;
}

interface InterestData {
  totalInterest: number;
  dailyInterest: number;
  daysSinceStart: number;
  interestHistory: Array<{
    date: Date;
    principal: number;
    dailyInterest: number;
    cumulativeInterest: number;
  }>;
}

export const useODAccount = () => {
  const [account, setAccount] = useState<ODAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem('od-account');
    const savedTransactions = localStorage.getItem('od-transactions');
    
    if (savedAccount) {
      const parsedAccount = JSON.parse(savedAccount);
      parsedAccount.startDate = new Date(parsedAccount.startDate);
      setAccount(parsedAccount);
    }
    
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions);
      const transactionsWithDates = parsedTransactions.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
      setTransactions(transactionsWithDates);
    }
  }, []);

  // Save data to localStorage whenever account or transactions change
  useEffect(() => {
    if (account) {
      localStorage.setItem('od-account', JSON.stringify(account));
    }
  }, [account]);

  useEffect(() => {
    localStorage.setItem('od-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const updateAccount = (newAccount: ODAccount) => {
    setAccount(newAccount);
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const editTransaction = (id: string, updatedData: Omit<Transaction, 'id'>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...updatedData, id }
          : transaction
      )
    );
  };

  const calculateInterest = (): InterestData => {
    if (!account || transactions.length === 0) {
      return {
        totalInterest: 0,
        dailyInterest: 0,
        daysSinceStart: 0,
        interestHistory: []
      };
    }

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dailyRate = account.interestRate / 365 / 100;
    const today = new Date();
    const startDate = new Date(account.startDate);
    
    let totalInterest = 0;
    let currentPrincipal = 0;
    let currentDate = new Date(startDate);
    const interestHistory: InterestData['interestHistory'] = [];
    
    // Create a map of transactions by date
    const transactionsByDate = new Map<string, Transaction[]>();
    sortedTransactions.forEach(transaction => {
      const dateKey = transaction.date.toDateString();
      if (!transactionsByDate.has(dateKey)) {
        transactionsByDate.set(dateKey, []);
      }
      transactionsByDate.get(dateKey)!.push(transaction);
    });

    // Calculate interest day by day
    while (currentDate <= today) {
      const dateKey = currentDate.toDateString();
      
      // Apply transactions for this date
      if (transactionsByDate.has(dateKey)) {
        const dayTransactions = transactionsByDate.get(dateKey)!;
        dayTransactions.forEach(transaction => {
          if (transaction.type === 'debit') {
            currentPrincipal -= transaction.amount; // Debit increases negative balance
          } else {
            currentPrincipal += transaction.amount; // Credit reduces negative balance
          }
        });
      }

      // Calculate interest only if principal is negative (in overdraft)
      let dailyInterest = 0;
      if (currentPrincipal < 0) {
        dailyInterest = Math.abs(currentPrincipal) * dailyRate;
        totalInterest += dailyInterest;
      }

      interestHistory.push({
        date: new Date(currentDate),
        principal: currentPrincipal,
        dailyInterest,
        cumulativeInterest: totalInterest
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate current daily interest
    const currentDailyInterest = currentPrincipal < 0 ? Math.abs(currentPrincipal) * dailyRate : 0;
    
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      dailyInterest: parseFloat(currentDailyInterest.toFixed(2)),
      daysSinceStart,
      interestHistory
    };
  };

  return {
    account,
    transactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    updateAccount,
    calculateInterest,
  };
};