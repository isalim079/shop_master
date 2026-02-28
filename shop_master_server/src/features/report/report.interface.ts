export interface IDateRange {
  from: Date;
  to: Date;
}

export interface ISalesSummary {
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalDiscount: number;
  profitMargin: number;
}

export interface IExpenseSummary {
  totalExpenses: number;
  totalAmount: number;
}

export interface ITopProduct {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface IDailyDataPoint {
  date: string;
  revenue: number;
  profit: number;
  sales: number;
  expenses: number;
}

export interface IReportSummary {
  sales: ISalesSummary;
  expenses: IExpenseSummary;
  netProfit: number;
  topProducts: ITopProduct[];
  chartData: IDailyDataPoint[];
}