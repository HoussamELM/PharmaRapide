export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* White circular background */}
      <div className="w-full h-full bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
        {/* Light green plus sign */}
        <div className="relative">
          <div className="w-4 h-0.5 bg-green-400 rounded-full"></div>
          <div className="w-0.5 h-4 bg-green-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Blue arrow curving from bottom left to top right */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 32 32" 
          fill="none"
        >
          <path 
            d="M8 24 Q16 16 24 8" 
            stroke="#3B82F6" 
            strokeWidth="2" 
            strokeLinecap="round"
            fill="none"
          />
          <path 
            d="M20 12 L24 8 L20 4" 
            stroke="#3B82F6" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
} 