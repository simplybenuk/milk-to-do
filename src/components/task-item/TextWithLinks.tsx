
import { ExternalLink } from 'lucide-react';

interface TextWithLinksProps {
  text: string;
}

export function TextWithLinks({ text }: TextWithLinksProps) {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  if (!urlRegex.test(text)) {
    return <>{text}</>;
  }
  
  // Split the text by URLs and create an array of elements
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];
  
  return (
    <>
      {parts.map((part, index) => {
        // Current part is not a URL
        if (index % 2 === 0) {
          return part;
        }
        
        // Current part is a URL, replace with anchor tag
        const url = matches[Math.floor(index / 2)];
        return (
          <a 
            key={index} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 break-all"
          >
            {url}
            <ExternalLink className="h-3 w-3 inline flex-shrink-0" />
          </a>
        );
      })}
    </>
  );
}
