import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Space, Spin, Typography } from "antd";

export const SavingSpinner: React.FC = () => {
  return (
    <Space size="small">
      <Spin indicator={<LoadingOutlined spin />} size="small" />
      <Typography.Text>Saving...</Typography.Text>
    </Space>
  );
};

export const SavingSaved: React.FC = () => {
  return (
    <Space size="small">
      <CheckCircleOutlined />
      <Typography.Text>Saved</Typography.Text>
    </Space>
  );
}
