import { Button, Form, Input, List, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Inputs = {
  message: string;
};

interface ChatProps {
  username: string;
  roomId: string;
  socket: Socket;
}

interface IMessage {
  username: string;
  message: string;
  roomId: string;
  date: string;
}

const Chat = ({ username, roomId, socket }: ChatProps) => {
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);

  const onFinish = async (values: Inputs) => {
    const messageData = {
      username: username,
      message: values.message,
      roomId: roomId,
      date: new Date().toISOString(),
    };
    await socket.emit("message", messageData);
    setMessagesList((prev) => [...prev, messageData]);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessagesList((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <Space direction='vertical'>
      <List
        itemLayout='horizontal'
        dataSource={messagesList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.username} description={item.message} />
            <Typography.Text>{item.date}</Typography.Text>
          </List.Item>
        )}
      />

      <Form onFinish={onFinish}>
        <Typography.Title level={1}>
          Welcome {username}. You are in room "{roomId}"
        </Typography.Title>
        <Form.Item
          rules={[{ required: true, message: "Please input your message" }]}
          name='message'
        >
          <Input placeholder='Enter your message' />
        </Form.Item>
        <Button htmlType='submit' type='primary'>
          Send message
        </Button>
      </Form>
    </Space>
  );
};

export default Chat;
