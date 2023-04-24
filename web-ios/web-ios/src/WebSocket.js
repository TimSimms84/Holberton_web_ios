import { createContext, useContext, useEffect, useRef, useState } from 'react';

export const UpdateValueWebSocketContext = createContext();
export const ChangeValueWebSocketContext = createContext();
export const ws = new WebSocket('ws://192.168.102.128:3030/change_value_ws');

export const useUpdateValueWebSocket = () => {
  return useContext(UpdateValueWebSocketContext);
};

export const useChangeValueWebSocket = () => {
  return useContext(ChangeValueWebSocketContext);
};

export const WebSocketProvider = ({ url, children, context }) => {
  const [data, setData] = useState({});
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (e) => {
      setData(JSON.parse(e.data));
    };

    return () => {
      ws.current.close();
      console.log('WebSocket connection closed');
    };
  }, [url]);

  return (
    <context.Provider value={data}>
      {children}
    </context.Provider>
  );
};
