import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  showNumber = true,
  editable = false,
  onRatingChange,
}: StarRatingProps) {
  const handleClick = (value: number) => {
    if (editable && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={index}
            onClick={() => handleClick(starValue)}
            disabled={!editable}
            className={`${editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            type="button"
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              } ${editable ? 'hover:fill-yellow-300' : ''}`}
            />
          </button>
        );
      })}
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
