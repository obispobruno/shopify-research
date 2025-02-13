import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ForecastData {
  date: string;
  actual: number;
  forecast: number;
  lower: number;
  upper: number;
}

interface ForecastChartProps {
  data: ForecastData[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#8884d8"
          name="Actual Sales"
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#82ca9d"
          name="Forecast"
        />
        <Line
          type="monotone"
          dataKey="lower"
          stroke="#ffc658"
          strokeDasharray="5 5"
          name="Lower Bound"
        />
        <Line
          type="monotone"
          dataKey="upper"
          stroke="#ff7300"
          strokeDasharray="5 5"
          name="Upper Bound"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
