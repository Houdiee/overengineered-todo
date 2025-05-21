import { App, Button, Flex, Form, Input, Typography, type FormProps } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./main";
import { useAuth, type User } from "./AuthContext";
import { useEffect } from "react";

type FieldType = {
  username: string,
  password: string,
}

const LogIn: React.FC = () => {
  const { login, logout } = useAuth();

  const navigate = useNavigate();
  const { notification } = App.useApp();

  useEffect(() => { logout });

  const onFinish: FormProps<FieldType>["onFinish"] = async (values: FieldType) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: values.username,
        password: values.password,
      });

      const userData: User = {
        username: response.data.user.username,
        entries: response.data.user.entries,
        token: response.data.token,
      };

      login(userData);
      navigate("/");
    }
    catch (error) {
      let errorMessage = "there was an issue handling your request";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data;
      }

      notification.error({
        message: "Failed login in",
        description: errorMessage,
      });

      console.log(`Error: ${error}`);
    }
  };

  const { Title } = Typography;
  return (
    <>
      <Flex align="center" justify="center" className="!mt-10">
        <Flex
          vertical
          gap="large"
          align="center"
          className="w-2/7"
        >
          <Title>Todo Portal</Title>
          <Form
            size="large"
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="w-full"
          >
            <Form.Item<FieldType>
              name="username"
              rules={[{ required: true, message: "Username may not be empty" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: "Password may not be empty" }]}
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>

            <Button block type="link" onClick={() => navigate("/signup")}>
              Don't have an account? Sign up instead
            </Button>
          </Form>
        </Flex>
      </Flex>

    </>
  );
}

export default LogIn;
