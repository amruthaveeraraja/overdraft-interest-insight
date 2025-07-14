import { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Calculator, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

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

interface ODAccount {
  name: string;
  odLimit: number;
  interestRate: number;
  startDate: Date;
  bankName?: string;
}

interface InterestSummaryProps {
  interestData: InterestData;
  account: ODAccount | null;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export const InterestSummary = ({ interestData, account, selectedDate, onDateChange }: InterestSummaryProps) => {
  if (!account) return null;

  // Default to today if not provided
  const [date, setDate] = useState<Date | null>(selectedDate ?? new Date());

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    if (onDateChange && newDate) {
      onDateChange(newDate);
    }
  };

  const dailyRate = account.interestRate / 365 / 100;
  const monthlyRate = account.interestRate / 12 / 100;
  
  return (
    <Card className="banking-card">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Interest Calculation
          </CardTitle>
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Interest until"
                value={date}
                maxDate={new Date()}
                onChange={handleDateChange}
                slotProps={{ textField: { size: 'small', sx: { minWidth: 140, background: 'white', borderRadius: 1 } } }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <CardDescription>
          Interest calculated at {account.interestRate}% per annum
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Daily Rate</p>
            <p className="text-lg font-bold text-primary">
              {(dailyRate * 100).toFixed(4)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Monthly Rate</p>
            <p className="text-lg font-bold text-primary">
              {(monthlyRate * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Days Calculated</span>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {interestData.daysSinceStart} days
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Daily Interest</span>
            <span className="font-semibold text-destructive">
              ₹{interestData.dailyInterest.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Interest Due</span>
            <span className="text-lg font-bold text-warning">
              ₹{interestData.totalInterest.toLocaleString()}
            </span>
          </div>
        </div>

        <Separator />

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Interest Calculation Method</p>
              <p>Interest is calculated daily on the outstanding principal amount. 
              Repayments reduce the principal immediately, affecting subsequent interest calculations.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};