import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface Transaction {
  id: string;
  date: Date;
  type: 'debit' | 'credit';
  amount: number;
  description?: string;
}

interface TransactionLedgerProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (id: string, data: Omit<Transaction, 'id'>) => void;
}

export const TransactionLedger = ({ transactions, onDeleteTransaction, onEditTransaction }: TransactionLedgerProps) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const calculateRunningBalance = (index: number) => {
    return sortedTransactions
      .slice(index)
      .reverse()
      .reduce((balance, transaction) => {
        return transaction.type === 'credit' 
          ? balance + transaction.amount 
          : balance - transaction.amount;
      }, 0);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <ArrowUpCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No transactions yet</h3>
        <p className="text-muted-foreground">Add your first transaction to start tracking interest</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
              <TableHead className="text-right">Balance (₹)</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction, index) => {
              const runningBalance = calculateRunningBalance(index);
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={transaction.type === 'credit' ? 'default' : 'destructive'}
                      className="flex items-center gap-1 w-fit"
                    >
                      {transaction.type === 'credit' ? (
                        <ArrowUpCircle className="h-3 w-3" />
                      ) : (
                        <ArrowDownCircle className="h-3 w-3" />
                      )}
                      {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transaction.type === 'credit' ? 'transaction-credit' : 'transaction-debit'}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={runningBalance < 0 ? 'balance-negative' : 'balance-positive'}>
                      ₹{Math.abs(runningBalance).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transaction.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const newAmount = prompt('Enter new amount:', transaction.amount.toString());
                          const newDescription = prompt('Enter new description:', transaction.description || '');
                          if (newAmount && !isNaN(Number(newAmount))) {
                            onEditTransaction(transaction.id, {
                              ...transaction,
                              amount: Number(newAmount),
                              description: newDescription || undefined
                            });
                          }
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this transaction?')) {
                            onDeleteTransaction(transaction.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};