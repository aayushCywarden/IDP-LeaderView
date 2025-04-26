import { useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {ChartWidgetProps, DividerProps, GridSectionProps, MetricWidgetProps, MonthlyData} from './types/index'

// Dummy data for all charts
const monthlyData = [
  {
    name: "Oct",
    prsCreated: 95,
    prsMerged: 85,
    leadTime: 48,
    criticalDefects: 5,
    deployFrequency: 4.2,
    deliveryRate: 0.82,
  },
  {
    name: "Nov",
    prsCreated: 82,
    prsMerged: 52,
    leadTime: 32,
    criticalDefects: 4,
    deployFrequency: 4.5,
    deliveryRate: 0.85,
  },
  {
    name: "Dec",
    prsCreated: 40,
    prsMerged: 5,
    leadTime: 80,
    criticalDefects: 3,
    deployFrequency: 2.0,
    deliveryRate: 0.78,
  },
  {
    name: "Jan",
    prsCreated: 75,
    prsMerged: 86,
    leadTime: 70,
    criticalDefects: 3,
    deployFrequency: 2.5,
    deliveryRate: 0.80,
  },
  {
    name: "Feb",
    prsCreated: 55,
    prsMerged: 73,
    leadTime: 40,
    criticalDefects: 2,
    deployFrequency: 5.2,
    deliveryRate: 0.9,
  },
  {
    name: "Mar",
    prsCreated: 86,
    prsMerged: 100,
    leadTime: 60,
    criticalDefects: 2,
    deployFrequency: 5.5,
    deliveryRate: 0.72,
  },
  {
    name: "Apr",
    prsCreated: 50,
    prsMerged: 60,
    leadTime: 32,
    criticalDefects: 1,
    deployFrequency: 4.5,
    deliveryRate: 0.94,
  },
];

// Calculate averages
const calculateAverage = (data: MonthlyData[], key: keyof MonthlyData) => {
  // Filter out April with zero values for PR metrics
  const filteredData = key.includes("pr")
    ? data.filter((item) => item.name !== "Apr")
    : data;
  const sum = filteredData.reduce((acc, item) => acc + (item[key] as number), 0);
  return (sum / filteredData.length).toFixed(2);
};

const averagePrsMerged = calculateAverage(monthlyData, "prsMerged");
const averageLeadTime = calculateAverage(monthlyData, "leadTime");
const averageCriticalDefects = calculateAverage(monthlyData, "criticalDefects");
const averageDeployFrequency = calculateAverage(monthlyData, "deployFrequency");
const averageDeliveryRate = calculateAverage(monthlyData, "deliveryRate");

// Widget component for metrics
const MetricWidget = ({ title, value, subtitle, icon }: MetricWidgetProps) => (
  <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
    <div className="flex items-center mb-2">
      <span className="text-xl font-bold">{title}</span>
      {icon && <span className="ml-2">{icon}</span>}
    </div>
    <div className="text-5xl font-bold text-center my-6">{value}</div>
    <p className="text-center text-gray-400 text-sm">{subtitle}</p>
  </div>
);

// Chart widget component
const ChartWidget = ({
  title,
  data,
  dataKeys,
  colors,
  icon,
  chartType = "line",
}: ChartWidgetProps) => (
  <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
    <div className="flex items-center mb-2">
      <span className="text-xl font-bold">{title}</span>
      {icon && <span className="ml-2">{icon}</span>}
    </div>
    <div className="flex-grow">
      <ResponsiveContainer width="100%" height={200}>
        {chartType === "line" ? (
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#333",
                border: "none",
                borderRadius: "4px",
                color: "white",
              }}
            />
            <Legend wrapperStyle={{ color: "#ddd" }} />
            {dataKeys.map((key, index) => (
              <Line
                key={key.id}
                type="monotone"
                dataKey={key.id}
                name={key.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#333",
                border: "none",
                borderRadius: "4px",
                color: "white",
              }}
            />
            <Legend wrapperStyle={{ color: "#ddd" }} />
            {dataKeys.map((key, index) => (
              <Bar
                key={key.id}
                dataKey={key.id}
                name={key.name}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

// Improved Divider component with better visibility
const Divider = ({ orientation, onMouseDown }: DividerProps) => (
  <div
    className={`${
      orientation === "vertical"
        ? "w-2 cursor-col-resize"
        : "h-2 cursor-row-resize"
    } 
    flex items-center justify-center bg-gray-700 hover:bg-blue-800 transition-colors`}
    onMouseDown={onMouseDown}
  >
    <div
      className={`${orientation === "vertical" ? "w-1 h-16" : "h-1 w-16"} 
      bg-blue-500 rounded-full`}
    ></div>
  </div>
);

// Improved Grid section with resizable panels
const GridSection = ({ children, height = "100%" }: GridSectionProps) => {
  const [leftSize, setLeftSize] = useState(50);
  const [rightSize, setRightSize] = useState(50);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef(0);
  const startSizesRef = useRef<{ leftSize: number; rightSize: number }>({ leftSize: 50, rightSize: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVerticalMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startPosRef.current = e.clientX;
    startSizesRef.current = { leftSize, rightSize };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - startPosRef.current;
    const containerWidth = containerRect.width;
    const newLeftSize =
      startSizesRef.current.leftSize + (deltaX / containerWidth) * 100;

    if (newLeftSize >= 20 && newLeftSize <= 80) {
      setLeftSize(newLeftSize);
      setRightSize(100 - newLeftSize);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex mb-2" style={{ height }}>
      <div className="p-2 overflow-auto" style={{ width: `${leftSize}%` }}>
        {children[0]}
      </div>
      <Divider orientation="vertical" onMouseDown={handleVerticalMouseDown} />
      <div className="p-2 overflow-auto" style={{ width: `${rightSize}%` }}>
        {children[1]}
      </div>
    </div>
  );
};

// Main component
const EngineeringDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Icons for widgets
  const prIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
  const timeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );
  const bugIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M6.56 1.14a.75.75 0 01.177 1.045 3.989 3.989 0 00-.464.86c.185.17.382.329.59.473A3.993 3.993 0 0110 2c1.272 0 2.405.594 3.137 1.518.208-.144.405-.302.59-.473a3.989 3.989 0 00-.464-.86.75.75 0 011.222-.869c.369.519.65 1.105.822 1.736a.75.75 0 01-.174.707 7.03 7.03 0 01-1.299 1.098A4 4 0 0114 6c0 .52-.301.963-.723 1.187a6.961 6.961 0 01-1.158.486c.13.208.231.436.296.679 1.413-.174 2.779-.5 4.081-.96a4 4 0 00-4.08-3.066.75.75 0 01-.724-.6A6.977 6.977 0 0110 2C6.089 2 2.868 4.516 2.124 8a.75.75 0 01-.752-.759A8.5 8.5 0 0110 .5z"
        clipRule="evenodd"
      />
    </svg>
  );
  const deployIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
        clipRule="evenodd"
      />
    </svg>
  );
  const deliveryIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col overflow-auto p-4">
      <div className="flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-2xl font-bold">Engineering Overview</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded-t-lg ${
            activeTab === "overview"
              ? "bg-gray-800 border-b-2 border-blue-500"
              : "hover:bg-gray-800"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-t-lg ${
            activeTab === "details"
              ? "bg-gray-800 border-b-2 border-blue-500"
              : "hover:bg-gray-800"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Detailed Metrics
        </button>
      </div>

      <p className="text-gray-400 mb-6">
        A central place to track all engineering metrics and standards, can also
        be used to define working agreements and track them.
      </p>

      {activeTab === "overview" ? (
        <div className="flex flex-col gap-4 overflow-auto pb-8">
          {/* PR Section */}
          <div className="h-72">
            <GridSection>
              <MetricWidget
                title="Average PR merged per month"
                value={averagePrsMerged}
                subtitle="Pull Requests merged per month"
                icon={prIcon}
              />
              <ChartWidget
                title="PRs per Month"
                data={monthlyData}
                dataKeys={[
                  { id: "prsMerged", name: "PRs merged" },
                  { id: "prsCreated", name: "PRs created" },
                ]}
                colors={["#06b6d4", "#0ea5e9"]}
                icon={prIcon}
              />
            </GridSection>
          </div>
          <hr />
          {/* Lead Time Section */}
          <div className="h-72">
            <GridSection>
              <MetricWidget
                title="Lead Time for Change (Hours)"
                value={averageLeadTime}
                subtitle="Time from opening a PR to its deployment"
                icon={timeIcon}
              />
              <ChartWidget
                title="Lead Time for Change"
                data={monthlyData}
                dataKeys={[{ id: "leadTime", name: "Lead Time (Hours)" }]}
                colors={["#10b981"]}
                icon={timeIcon}
              />
            </GridSection>
          </div>
          <hr />
          {/* Defects and Deploy Section */}
          <div className="h-72">
            <GridSection>
              <MetricWidget
                title="Average Critical Defects"
                value={averageCriticalDefects}
                subtitle="Bugs reported as critical severity"
                icon={bugIcon}
              />
              <ChartWidget
                title="Critical Defects per Month"
                data={monthlyData}
                dataKeys={[{ id: "criticalDefects", name: "Critical Defects" }]}
                colors={["#f43f5e"]}
                icon={bugIcon}
              />
            </GridSection>
          </div>
          <hr />
          {/* Defects and Deploy Section */}
          <div className="h-72">
            <GridSection>
              <MetricWidget
                title="Requirement Delivery Rate"
                value={`${(parseFloat(averageDeliveryRate) * 100).toFixed(1)}%`}
                subtitle="Delivered vs. total requirements"
                icon={deliveryIcon}
              />
              <MetricWidget
                title="Deploy Frequency per Week"
                value={averageDeployFrequency}
                subtitle="Number of deployments per week"
                icon={deployIcon}
              />
            </GridSection>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto pb-8">
          <ChartWidget
            title="Pull Request Trends"
            data={monthlyData}
            dataKeys={[
              { id: "prsMerged", name: "PRs merged" },
              { id: "prsCreated", name: "PRs created" },
            ]}
            colors={["#06b6d4", "#0ea5e9"]}
            icon={prIcon}
          />
          <ChartWidget
            title="Lead Time Trend"
            data={monthlyData}
            dataKeys={[{ id: "leadTime", name: "Lead Time (Hours)" }]}
            colors={["#10b981"]}
            icon={timeIcon}
          />
          <ChartWidget
            title="Critical Defects"
            data={monthlyData}
            dataKeys={[{ id: "criticalDefects", name: "Critical Defects" }]}
            colors={["#f43f5e"]}
            icon={bugIcon}
            chartType="bar"
          />
          <ChartWidget
            title="Deploy Frequency"
            data={monthlyData}
            dataKeys={[{ id: "deployFrequency", name: "Deploys per Week" }]}
            colors={["#8b5cf6"]}
            icon={deployIcon}
          />
          <ChartWidget
            title="Delivery Rate"
            data={monthlyData.map((item) => ({
              ...item,
              deliveryRatePercent: item.deliveryRate * 100,
            }))}
            dataKeys={[
              { id: "deliveryRatePercent", name: "Delivery Rate (%)" },
            ]}
            colors={["#f59e0b"]}
            icon={deliveryIcon}
          />
        </div>
      )}
    </div>
  );
};

export default EngineeringDashboard;
