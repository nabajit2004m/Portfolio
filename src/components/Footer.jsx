import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#000',
            padding: '40px 0',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div className="container">
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Nabajit Mandal. All rights reserved.
                </p>
                <div style={{ marginTop: '10px' }}>
                    <span style={{ color: '#444', fontSize: '0.8rem' }}>Inspired by iQOO Design Language</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
