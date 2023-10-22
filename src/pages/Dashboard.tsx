import '../styles/pages/dashboard.css';
import { Button } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLogout, useWork } from '../hooks/';
import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { axiosPrivate } from '../api/axios';

interface UserStats {
    work: number;
    occurrences: number;
  }

export const Dashboard = () => {
    const { auth } = useAuth();
    const { socket } = useWork();
    const [stats, setStats] = useState<UserStats>({ work: 0, occurrences: 0 });
    const logout = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getStats = async () => {
            try {
                const response = await axiosPrivate.get(`/users/stats/${auth.id}`, {
                    signal: controller.signal,
                });
                isMounted && setStats(response.data);
            } catch (error: any) {
                console.log(error);
            }
        };

        getStats();

        return () => {
            isMounted = false;
        }
    }, [auth.id]);

    const startWork = () => {
        socket.emit('agent:startWork');
    };

    const handleLogout = () => {
        logout()
        navigate('/login');
    }

    return (
        <div id='home'>
            <div className='header-container'>
                <h1 className='title'>Dashboard <span className='subtitle'>Operações</span></h1>
                <div className='logout'>
                    <Button text='Sair' action={handleLogout} />
                </div>
            </div>
            {
                stats && Object.keys(stats).length ? (
                    <section className='cards'>
                        <Card text='Operações realizadas' data={stats.work} />
                        <Card text='Acompanhamentos monitorados' data={stats.occurrences} />
                    </section>
                ) : null
            }
            <Link to='/app' onClick={startWork} className='calltoaction'>
                <Button text='Iniciar operações' color='orange'/>
            </Link>
        </div>
    );
}
