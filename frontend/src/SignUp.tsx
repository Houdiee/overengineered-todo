import { App, Button, Flex, Form, Input, Typography, type FormProps } from "antd";
import axios from "axios";
import { useNavigate, } from "react-router-dom";
import { API_BASE_URL } from "./main";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

type FieldType = {
  username: string,
  password: string,
  passwordConfirm: string,
};

const SignUp: React.FC = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const { notification } = App.useApp();

  useEffect(() => logout);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values: FieldType) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        username: values.username,
        password: values.password,
      });

      notification.success({
        message: "Account created!",
        description: "Your account was successfully created",
      });

      navigate("/login");
    }
    catch (error) {
      let errorMessage = "There was an issue handling your request";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data;
      }

      notification.error({
        message: "Failed sign up",
        description: errorMessage,
      });

      console.log(`Error: ${error}`);
    }
  };

  const { Title } = Typography;
  return (
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

          <Form.Item<FieldType>
            name="passwordConfirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Password confirmation cannot be empty" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>

          <Button block type="link" onClick={() => navigate("/login")}>
            Already have an account? Log in instead
          </Button>
        </Form>
      </Flex>
    </Flex>
);
}

export default SignUp;
