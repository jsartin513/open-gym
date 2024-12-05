import React from 'react';
import { Link } from 'react-router-dom';

const LeftNav = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Attendance</Link>
                </li>
                <li>
                    <Link to="/teams">Teams</Link>
                </li>
                <li>
                    <Link to="/games">Games</Link>
                </li>
            </ul>
        </nav>
    );
};

export default LeftNav;