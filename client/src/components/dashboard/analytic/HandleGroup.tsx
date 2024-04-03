import React, { useState } from "react";
import { Modal, Button, Form, Select, Row } from "antd";
import * as Icon from "@ant-design/icons";
import { useSubmit } from "react-router-dom";
import * as API from "../../../api";

interface HandleGroupProps {
  userId: number;
  groupData: string[];
  lessionsId: number;
  groupName: string;
}
export async function updateGroupByLession({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  switch (submitData.key) {
    case "update":
      try {
        const dataFormat = JSON.parse(submitData.data);

        const { ...values } = dataFormat;
        const data = await API.updateGroupByLession(dataFormat, values.userId);

        return { success: "success", message: "Update Successfully" };
      } catch (e: any) {
        return { error: "error", message: e.message };
      }
  }
}

export const HandleGroup: React.FC<HandleGroupProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const submit = useSubmit();

  const showModal = () => {
    form.setFieldsValue({ group: props.groupName });
    setIsModalVisible(true);
  };

  const handleOnFinish = (values: any) => {
    const data = {
      ...values,
      userId: props.userId,
      lession_id: props.lessionsId,
    };
    submit({ key: "update", data: JSON.stringify(data) }, { method: "put" });
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button icon={<Icon.EditOutlined />} onClick={showModal} />
      <Modal
        title="Change Group"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleOnFinish}>
          <Form.Item name="group" label="Group">
            <Select allowClear>
              {props.groupData.map((group, index) => (
                <Select.Option key={index} value={group}>
                  {group}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row justify="end" style={{ marginTop: "20px" }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
