// Criado por Ítalo de Souza
import React, { useState } from 'react';

const StarRating = ({ rating = 0, onRate, readonly = false, size = 'md' }) => {
    const [hover, setHover] = useState(0);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`${sizeClasses[size]} ${readonly
                            ? (star <= rating ? 'text-yellow-400' : 'text-gray-600')
                            : 'cursor-pointer transition-colors ' +
                            (star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-600')
                        }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    onClick={() => !readonly && onRate && onRate(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

export default StarRating;
