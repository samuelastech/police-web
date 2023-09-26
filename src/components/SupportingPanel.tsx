import { useEffect } from 'react';
import { Socket } from 'socket.io-client'

interface Props {
  connection: Socket;
  setAgents: (chasingId: string, position: number[]) => void;
  toggleSupporting: () => void;
}

export default function SupportingPanel({ connection, setAgents, toggleSupporting }: Props) {
  useEffect(() => {
    connection.on('positionToSupporters', (chasingId, position) => {
      setAgents(chasingId, position);
    });

    connection.on('supportersPosition', (supportPosition) => {
      const agentId = Object.keys(supportPosition)[0];
      setAgents(agentId, supportPosition[agentId]);
    });

    connection.once('finishChaseForSupporters', () => {
      connection.emit('getIntoRoom', 'operations');
      toggleSupporting();
    });
  }, [connection]);

  return (
    <aside>
      <h1>Hello World</h1>
    </aside>
  )
}