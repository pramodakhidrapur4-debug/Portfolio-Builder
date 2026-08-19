import React, { useState } from 'react';

const Avatar = ({ src, name, className, fallbackClassName }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (nameStr) => {
    if (!nameStr) return '?';
    return nameStr
      .trim()
      .split(/\s+/)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasValidImage = src && !imgError && typeof src === 'string' && src.trim() !== '';

  if (!hasValidImage) {
    return (
      <div 
        className={fallbackClassName || className} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#4a4a4a', 
          color: '#ffffff', 
          fontWeight: 'bold',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          fontSize: 'clamp(1rem, 5vw, 3rem)',
          aspectRatio: '1 / 1'
        }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || 'Profile'}
      className={className}
      onError={() => setImgError(true)}
    />
  );
};

export default Avatar;
