import { useEffect, useState } from 'react';

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typingSpeed = 100; // 每个字符的打字速度，单位为毫秒

  useEffect(() => {
    let index = 0;

    const typeCharacter = () => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
        setTimeout(typeCharacter, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeCharacter();
  }, [text]);

  return (
    <div className="flex items-center font-sans text-lg">
      <span>{displayedText}</span>
      {isTyping && (
        <span className="ml-2 animate-blink ">⚫</span>
      )}
    </div>
  );
};

export default TypingEffect;
