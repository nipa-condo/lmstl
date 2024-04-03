import React from "react";
import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface ButtonSelectedProps {
  label: any;
  path: any;
}

export const ButtonSelected: React.FC<ButtonSelectedProps> = (
  props: ButtonSelectedProps
) => {
  return (
    <Link to={props.path}>
      <Button
        shape="round"
        dir="rtl"
        icon={<RightOutlined style={{ fontSize: "16px" }} />}
        style={{
          fontWeight: 700,
          border: "solid 2px",
          boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
        }}
      >
        {props.label}
      </Button>
    </Link>
  );
};
