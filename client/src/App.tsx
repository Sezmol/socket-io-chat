import io from "socket.io-client";
import "./App.css";
import { Button, Flex, Form, Input, Typography } from "antd";
import { useState } from "react";
import Chat from "./components/Chat";

const socket = io("http://localhost:5000");

type Inputs = {
  name: string;
  roomId: string;
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [formValues, setFormValues] = useState<Inputs>({
    name: "",
    roomId: "",
  });

  const onFinish = (values: Inputs) => {
    if (values.roomId && values.name) {
      setIsAuth(true);
      socket.emit("join", values.roomId);
    }
  };

  return (
    <Flex style={{ height: "100vh" }} align='center' justify='center'>
      {isAuth ? (
        <Chat
          username={formValues.name}
          roomId={formValues.roomId}
          socket={socket}
        />
      ) : (
        <Flex vertical>
          <Typography.Title level={1}> Welcome to Gay Chat</Typography.Title>
          <Form name='Join to gay chat' onFinish={onFinish}>
            <Form.Item
              rules={[{ required: true, message: "Please input your name" }]}
              name='name'
            >
              <Input
                value={formValues.name}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder='Enter your name'
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Please input room ID" }]}
              name='roomId'
            >
              <Input
                value={formValues.roomId}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, roomId: e.target.value }))
                }
                placeholder='Enter your room ID'
              />
            </Form.Item>

            <Button type='primary' htmlType='submit'>
              Join
            </Button>
          </Form>
        </Flex>
      )}
    </Flex>
  );
}

export default App;
