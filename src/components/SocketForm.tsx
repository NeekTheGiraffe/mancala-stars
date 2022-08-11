import { Socket } from 'socket.io-client';
import { useContext, useState, useCallback } from 'react';
import { SocketContext } from '../context/socket';

interface SocketFormProps {
  onSubmit: (socket: Socket, formValue: string) => void
  placeholder: string,
  buttonText: string
}
export default function SocketForm({ onSubmit, placeholder, buttonText }: SocketFormProps) {
  const socket = useContext(SocketContext);
  const [formValue, setFormValue] = useState('');
  const sendMessage = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(socket, formValue);
    setFormValue('');
  }, [formValue, socket, onSubmit]);
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value),
    []);

  return (
    <form className="input-group" onSubmit={sendMessage}>
      <input value={formValue}
        placeholder={placeholder}
        onChange={onInputChange} />
      <button className="btn" type="submit">{buttonText}</button>
    </form>
  );
}