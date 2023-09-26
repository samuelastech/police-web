import '../styles/pages/dashboard.css';
import logo from '../images/logo.svg';
import { FiArrowRight } from "react-icons/fi";
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div id='home'>
            <div className='content-wrapper'>
                <img src={logo} alt='Estrela' />
                <main className='title-wrapper'>
                    <h1 className='title'>Guardiões das Linhas, Defendendo Vidas</h1>
                    <p className='slogan'>COPOM Sempre Alerta</p>
                </main>

                <div className='location'>
                    <strong>Embu das Artes</strong>
                    <span>São Paulo</span>
                </div>

                <Link to='/app' className='start'>
                    Iniciar operações
                    <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
                </Link>
            </div>
        </div>
    );
}
