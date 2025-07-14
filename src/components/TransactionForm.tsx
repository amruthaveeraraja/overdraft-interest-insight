import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: Date;
  type: 'debit' | 'credit';
  amount: number;
  description?: string;
}

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: "debit" as 'debit' | 'credit',
  });
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !transactionDate) {
      return;
    }

    const transaction: Omit<Transaction, 'id'> = {
      date: transactionDate,
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description || undefined,
    };

    onAddTransaction(transaction);
    
    // Reset form
    setFormData({
      amount: "",
      description: "",
      type: "debit",
    });
    setTransactionDate(new Date());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <Label>Transaction Type</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(value: 'debit' | 'credit') => 
            setFormData(prev => ({ ...prev, type: value }))
          }
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit" className="text-sm font-medium">
              <span className="transaction-debit">Debit (Withdrawal)</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="text-sm font-medium">
              <span className="transaction-credit">Credit (Repayment)</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Transaction Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !transactionDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {transactionDate ? format(transactionDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={transactionDate}
              onSelect={(date) => date && setTransactionDate(date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add a note about this transaction"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={!formData.amount}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>
    </form>
  );
};