import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
  const navigate = useNavigate();
  
  function goBack() {
    navigate(-1);
  }

  return (
    <section>
      <h1>Unaunthorized</h1>
      <button onClick={goBack}>Go back</button>
    </section>
  )
}