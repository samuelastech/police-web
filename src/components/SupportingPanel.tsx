import { useEffect } from 'react';
import { useWork } from '../hooks';

interface SupportingPanelProps {
  setAgents: (chasingId: string, position: number[]) => void;
  toggleSupporting: () => void;
}

export const SupportingPanel = ({ setAgents, toggleSupporting }: SupportingPanelProps) => {
  const { socket } = useWork();

  useEffect(() => {
    socket.on('positionToSupporters', (chasingId, position) => {
      setAgents(chasingId, position);
    });

    socket.on('supportersPosition', (supportPosition) => {
      const agentId = Object.keys(supportPosition)[0];
      setAgents(agentId, supportPosition[agentId]);
    });

    socket.once('finishChaseForSupporters', () => {
      socket.emit('getIntoRoom', 'operations');
      toggleSupporting();
    });
  }, [socket]);

  return (
    <aside>
      <h1>Hello World</h1>
    </aside>
  )
}