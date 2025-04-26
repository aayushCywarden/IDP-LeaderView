export interface MonthlyData {
  name: string;
  prsCreated: number;
  prsMerged: number;
  leadTime: number;
  criticalDefects: number;
  deployFrequency: number;
  deliveryRate: number;
}

export interface MetricWidgetProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: React.ReactNode;
}

export interface DataKey {
  id: keyof MonthlyData | "deliveryRatePercent";  // extra for mapped value
  name: string;
}

export interface ChartWidgetProps {
  title: string;
  data: MonthlyData[] | (MonthlyData & { deliveryRatePercent: number })[];
  dataKeys: DataKey[];
  colors: string[];
  icon?: React.ReactNode;
  chartType?: "line" | "bar";
}

export interface DividerProps {
  orientation: "vertical" | "horizontal";
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface GridSectionProps {
  children: React.ReactNode[];
  height?: string;
}