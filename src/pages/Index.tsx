import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Download, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { AccountSetup } from "@/components/AccountSetup";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionLedger } from "@/components/TransactionLedger";
import { InterestSummary } from "@/components/InterestSummary";
import { useODAccount } from "@/hooks/useODAccount";

const Index = () => {
  const { account, transactions, addTransaction, updateAccount, calculateInterest } = useODAccount();
  const [showAccountSetup, setShowAccountSetup] = useState(!account);

  const currentBalance = transactions.reduce((balance, transaction) => {
    return transaction.type === 'credit' ? balance + transaction.amount : balance - transaction.amount;
  }, 0);

  const interestData = calculateInterest();

  if (showAccountSetup) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">OD Interest Tracker</h1>
            <p className="text-muted-foreground">Track your overdraft interest with precision</p>
          </div>
          <AccountSetup 
            onSetup={(accountData) => {
              updateAccount(accountData);
              setShowAccountSetup(false);
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">OD Interest Tracker</h1>
              <p className="text-sm text-muted-foreground">{account?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Limit: ₹{account?.odLimit.toLocaleString()}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAccountSetup(true)}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="banking-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${currentBalance < 0 ? 'balance-negative' : 'balance-positive'}`}>
                ₹{Math.abs(currentBalance).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentBalance < 0 ? 'Amount used' : 'Credit balance'}
              </p>
            </CardContent>
          </Card>

          <Card className="banking-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interest Due</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                ₹{interestData.totalInterest.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                As of {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card className="banking-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Interest</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ₹{interestData.dailyInterest.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                On outstanding amount
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Transaction Form */}
          <div className="space-y-6">
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Transaction
                </CardTitle>
                <CardDescription>
                  Record withdrawals and repayments to track interest accurately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm onAddTransaction={addTransaction} />
              </CardContent>
            </Card>

            <InterestSummary interestData={interestData} account={account} />
          </div>

          {/* Right Column - Transaction Ledger */}
          <div>
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Transaction History
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardTitle>
                <CardDescription>
                  Complete record of all withdrawals and repayments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionLedger transactions={transactions} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;