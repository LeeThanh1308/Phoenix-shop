import React, { useState } from 'react';

function ReadMoreText({ text, maxLength }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="text-justify text-gray-500">
      {text.length > maxLength && !isExpanded ? (
        <>
          {text.slice(0, maxLength)}{" "}
          <button className='text-black cursor-pointer hover:underline font-semibold' onClick={toggleExpand}>...Xem thêm</button>
        </>
      ) : (
        <>
          {text}
          {text.length > maxLength && (
            <button className='text-black cursor-pointer hover:underline font-semibold' onClick={toggleExpand}>Thu gọn</button>
          )}
        </>
      )}
    </div>
  );
}

export default ReadMoreText;
