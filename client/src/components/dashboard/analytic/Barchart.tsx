import React from "react";
import { Bar } from "@ant-design/plots";

interface BarChartProps {
  data: any;
}

export const BarChart: React.FC<BarChartProps> = (props: BarChartProps) => {
  const { data } = props;
  const config = {
    data,
    xField: "value",
    yField: "type",
    seriesField: "type",
    position: "top-left",
    legend: {
      position: "top-right",
    },
    barBackground: {
      style: {
        width: "30px",
      },
    },
  };
  // return <Bar {...config} />;
  return <></>;
};
