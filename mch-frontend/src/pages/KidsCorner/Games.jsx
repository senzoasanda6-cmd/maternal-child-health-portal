import React from 'react';

import hhhwbThumbnail from '../../assets/game_images/heroes_painted_dynamic_pose.jpg';
import mmdsThumbnail from '../../assets/game_images/poster.png';

const games = [
  {
    id: 1,
    emoji: '🥗',
    title: 'Healthcare Heroes: Hazard Wave Battle',
    description: 'A 3D react+threejs web browser game that aims to teach and entertain children (Peads) about IPC and CDC related edu topics.',
    url: 'https://healthcareheroes.netlify.app',
    imageUrl: hhhwbThumbnail
  },
  {
    id: 2,
    emoji: '💊',
    title: 'MediMixDash Saga',
    description: 'A candy crush clone react web browser and mobile game (PWA) based on Pharmacy dispensing, waiting times and complaints management simulation game, with staff management elements.',
    url: 'https://medimixdashsaga.netlify.app',
    imageUrl: mmdsThumbnail
  }
];

function Games() {
    return (
        <div className="container mt-5" style={{
            background: "linear-gradient(135deg, #C8E6C9 0%, #E8F5E8 100%)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
            <h2 className="fw-bold text-center" style={{ fontFamily: "Comic Neue, cursive", color: "#1B5E20" }}>Games</h2>
            <p className="text-center" style={{ fontFamily: "Baloo, sans-serif", color: "#2E7D32" }}>Play exciting games and puzzles! 🧩🎮</p>
            
            <div className="row g-4">
                {games.map(game => (
                    <div key={game.id} className="col-12z col-md -4 rounded-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <img src={game.imageUrl} alt={game.title} className="mb-3 rounded-3 object-fit-cover object-position-center" style={{height:'300px',width:'100%'}} />
                                <h5 className="card-title">{game.emoji} {game.title}</h5>
                                <p className="card-text text-muted" style={{ flexGrow: 1 }}>{game.description}</p>
                                <a href={game.url} target="_blank" rel="noopener noreferrer" className="btn btn-success mt-3">Visit</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Games;
