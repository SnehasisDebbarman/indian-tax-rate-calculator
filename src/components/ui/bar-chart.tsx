"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


// {
//     range,
//     amount: taxableAmount,
//     rate: `${(bracket.rate * 100)}%`,
//     tax: bracketTax,
//     fill: COLORS[index % COLORS.length]
//   }

const chartConfig = {
    tax: {
        label: "Amount",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

interface ComponentProps {
    data: { rate: string; tax: number }[];
    income: number | undefined;
    tax: number;
}

export function Component({ data, income, tax }: ComponentProps) {

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };
    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Bar Chart - slab wise</CardTitle>
                {/* <CardDescription>J 2024</CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="rate"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="tax" fill="var(--color-desktop)" radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    {(income ?? 0) > 0 ? ((tax / (income ?? 1)) * 100).toFixed(1) : 0}% of your income <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    {tax > 0 ? `You owe ${formatCurrency(tax)}` : "No tax"}
                </div>
            </CardFooter>
        </Card>
    )
}
