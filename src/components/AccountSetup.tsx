import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Building2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ODAccount {
  name: string;
  odLimit: number;
  interestRate: number;
  startDate: Date;
  bankName?: string;
}

interface AccountSetupProps {
  onSetup: (account: ODAccount) => void;
}

export const AccountSetup = ({ onSetup }: AccountSetupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    odLimit: "",
    interestRate: "",
    bankName: "",
  });
  const [startDate, setStartDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !formData.name || !formData.odLimit || !formData.interestRate) {
      return;
    }

    const account: ODAccount = {
      name: formData.name,
      odLimit: parseFloat(formData.odLimit),
      interestRate: parseFloat(formData.interestRate),
      startDate,
      bankName: formData.bankName || undefined,
    };

    onSetup(account);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="banking-card">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Setup OD Account</CardTitle>
        <CardDescription>
          Configure your overdraft account details to start tracking interest
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name *</Label>
            <Input
              id="accountName"
              placeholder="e.g., Business Current Account"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name (Optional)</Label>
            <Input
              id="bankName"
              placeholder="e.g., HDFC Bank"
              value={formData.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odLimit">OD Limit (₹) *</Label>
              <Input
                id="odLimit"
                type="number"
                placeholder="e.g., 500000"
                value={formData.odLimit}
                onChange={(e) => handleInputChange("odLimit", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (% per annum) *</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="e.g., 12.5"
                value={formData.interestRate}
                onChange={(e) => handleInputChange("interestRate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select account start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            type="submit" 
            className="w-full banking-gradient text-white"
            disabled={!startDate || !formData.name || !formData.odLimit || !formData.interestRate}
          >
            Setup Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};