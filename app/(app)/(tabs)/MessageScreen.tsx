import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

// Define a type for the message structure if you have a predefined format
interface Message {
  text: string;
}

const MessageScreen: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Adjust the WebSocket URL as needed
    const websocket = new WebSocket("http://192.168.1.125:8000/ws/2");
    websocket.onopen = () => {
      console.log("WebSocket Connected");
    };
    websocket.onmessage = (e) => {
      console.log("Message received: ", e.data);
      setMessages((prevMessages) => [...prevMessages, e.data]);
    };
    websocket.onerror = (e) => {
      // You might need to cast `e` to any or to a more specific type based on your WebSocket library
      console.log("WebSocket Error: ", (e as any).message);
    };
    websocket.onclose = (e) => {
      console.log("WebSocket Disconnected: ", e.reason);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && text) {
      ws.send(text);
      setText("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={sendMessage} />
      <View>
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    marginVertical: 2,
  },
});

export default MessageScreen;
