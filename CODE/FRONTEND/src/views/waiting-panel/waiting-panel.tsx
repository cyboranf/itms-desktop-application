import { useNavigate } from 'react-router-dom';
import './waiting-panel.scss';

const WaitingPanel = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="container1">
            <p className="message">Proszę czekać na nadanie roli przez administratora</p>
            <button className="button" onClick={handleGoToLogin}>Cofnij</button>
        </div>
    );
};

export default WaitingPanel;
