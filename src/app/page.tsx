"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Component as BarChart1 } from '@/components/ui/bar-chart';

type Breakdown = {
  range: string;
  amount: number;
  rate: string;
  tax: number;
  fill: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'];

export default function TaxCalculator() {
  const [income, setIncome] = useState<number | undefined>(undefined);
  const [tax, setTax] = useState(0);
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);
  const [rebate, setRebate] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  const calculateTax = () => {
    const standardDeduction = 75000;
    const calculatedTaxableIncome = Math.max((income ?? 0) - standardDeduction, 0);
    setTaxableIncome(calculatedTaxableIncome);

    const newBreakdowns: Breakdown[] = [];
    const brackets = [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 0.05 },
      { min: 800000, max: 1200000, rate: 0.10 },
      { min: 1200000, max: 1600000, rate: 0.15 },
      { min: 1600000, max: 2400000, rate: 0.25 },
      { min: 2400000, max: Infinity, rate: 0.30 }
    ];

    let totalTax = 0;
    let calculatedRebate = 0;

    brackets.forEach((bracket, index) => {
      if (calculatedTaxableIncome > bracket.min) {
        const taxableAmount = Math.min(
          calculatedTaxableIncome - bracket.min,
          bracket.max - bracket.min
        );

        if (taxableAmount > 0) {
          const bracketTax = taxableAmount * bracket.rate;
          totalTax += bracketTax;

          const rangeStart = formatIndianCurrency(bracket.min);
          const rangeEnd = bracket.max === Infinity ? "Above" : formatIndianCurrency(bracket.max);
          const range = bracket.max === Infinity ? `${rangeStart}+` : `${rangeStart} - ${rangeEnd}`;

          newBreakdowns.push({
            range,
            amount: taxableAmount,
            rate: `${(bracket.rate * 100)}%`,
            tax: bracketTax,
            fill: COLORS[index % COLORS.length]
          });
        }
      }
    });

    // Apply rebate if taxable income is below ₹12,00,000
    if (calculatedTaxableIncome <= 1200000) {
      calculatedRebate = totalTax;
      totalTax = 0;
      newBreakdowns.length = 0;
    }

    // Apply Education Cess (4%) if taxable income exceeds ₹13,00,000
    if (calculatedTaxableIncome > 1300000) {
      totalTax += totalTax * 0.04;
    }

    // Apply Surcharge (10%) if taxable income exceeds ₹60,00,000
    if (calculatedTaxableIncome > 6000000) {
      totalTax += totalTax * 0.10;
    }

    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 5000);

    setRebate(calculatedRebate);
    setTax(totalTax);
    setBreakdowns(newBreakdowns);
  };

  const formatIndianCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen  p-6 md:px-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="w-10 h-10 text-blue-600" />
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Income Tax Calculator 2025</h1>
        </div>

        {showBanner && (
          <Alert variant="default" className="fixed top-4 right-4 w-96 border-l-4 border-blue-600 animate-in slide-in-from-top duration-500">
            <AlertTitle>Tax Summary</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="space-y-1">
                <p className="text-gray-600">
                  You owe{' '}
                  <span className="font-bold text-blue-600">
                    {formatCurrency(tax)}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  This is {((tax / (income ?? 1)) * 100).toFixed(2)}% of your income
                </p>
                {rebate > 0 && (
                  <p className="text-sm text-green-600">
                    Rebate applied: {formatCurrency(rebate)}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Enter your income (₹)
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      value={income ?? ''}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      placeholder="Enter annual income"
                      className="flex-1"
                    />
                    <Button onClick={calculateTax} className="gap-2">
                      Calculate <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">Gross Income</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(income ?? 0)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">Standard Deduction</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(75000)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">Taxable Income</p>
                      <p className="text-lg font-bold text-purple-600">{formatCurrency(taxableIncome)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">Total Tax</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(tax)}</p>
                      {rebate > 0 && (
                        <p className="text-xs text-green-600">
                          (Rebate: {formatCurrency(rebate)})
                        </p>
                      )}
                      {/* Display Surcharge and Education Cess */}
                      {taxableIncome > 6000000 && (
                        <p className="text-xs text-gray-500">
                          (Surcharge: {formatCurrency(tax * 0.10)})
                        </p>
                      )}
                      {taxableIncome > 1300000 && (
                        <p className="text-xs text-gray-500">
                          (Education Cess: {formatCurrency(tax * 0.04)})
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        ({(income ?? 0) > 0 ? ((tax / (income ?? 1)) * 100).toFixed(1) : 0}% of your total income)
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {taxableIncome <= 1200000 && taxableIncome > 0 && (
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <AlertTitle>No Tax Applicable</AlertTitle>
                    <AlertDescription>
                      Your taxable income is below ₹12,00,000 (Rebate u/s 87A applies)
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {breakdowns.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slab</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Tax</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breakdowns.map((breakdown, index) => (
                      <TableRow key={index}>
                        <TableCell>{breakdown.range}</TableCell>
                        <TableCell>{formatCurrency(breakdown.amount)}</TableCell>
                        <TableCell>{breakdown.rate}</TableCell>
                        <TableCell>{formatCurrency(breakdown.tax)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <BarChart1 data={breakdowns} income={income} tax={tax} />
          </div>
        )}
      </div>
    </div>
  );
}
