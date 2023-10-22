import '../styles/components/card.css';

interface CardProps {
  data: number;
  text: string;
}

export const Card = ({ data, text }: CardProps) => {
  return (
    <div className='data-card'>
      <p className='data'>{data}</p>
      <p className='label'>{text}</p>
    </div>
  );
}
