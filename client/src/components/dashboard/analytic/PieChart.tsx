import React from "react";
import { Pie } from "@ant-design/plots";

interface PieChartProps {
  data: any;
}

export const PieChart: React.FC<PieChartProps> = (props: PieChartProps) => {
  const { data } = props;
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
  return <Pie {...config} />;
};
