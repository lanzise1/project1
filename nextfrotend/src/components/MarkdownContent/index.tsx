import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './markdown.module.scss';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';

interface MarkdownComponentProps {
  content: string;
}

const AnimatedDot: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <span className="animate-pulse text-2xl" style={style}>●</span>
);
const findLastTextNode = (node: Node): Text | null => {
  if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
    return node as Text;
  }
  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    const result = findLastTextNode(node.childNodes[i]);
    if (result) return result;
  }
  return null;
};
export default function MarkdownComponent({ content }: MarkdownComponentProps) {
  const markdownRef = useRef<HTMLDivElement>(null);
  const [dotPosition, setDotPosition] = useState<{ top: number; left: number } | null>(null);

  const remarkPlugins = [remarkGfm];
  const rehypePlugins = [rehypeHighlight, rehypeRaw];

  const sanitizedContent = content ? content.replace(/NaN/g, '') : '';

  useEffect(() => {
    if (markdownRef.current) {

      const lastTextNode = findLastTextNode(markdownRef.current);
      if (lastTextNode && lastTextNode.parentNode) {
        let tempText = document.createTextNode('|');
        lastTextNode.parentNode.appendChild(tempText);
        const range = document.createRange();
        range.setStart(tempText, 0);
        range.setEnd(tempText, 0);
        const rect = range.getBoundingClientRect();
        const textRect = markdownRef.current.getBoundingClientRect();
        console.log(rect, textRect)
        setDotPosition({
          top: rect.y - textRect.y,
          left: rect.x - textRect.x
        });
        tempText.remove();
      }
    }
  }, [sanitizedContent]);

  return (
    <div ref={markdownRef} className={`${styles['markdown-content']} w-fit bg-gray-200 px-2 rounded-md relative`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
      >
        {sanitizedContent}
      </ReactMarkdown>
      {dotPosition && <AnimatedDot style={{ position: 'absolute', ...dotPosition }} />}
    </div>
  );
}