import React, { useEffect, useState } from 'react';

// Function to convert an image URL to inline SVG
export const ImageToSvg = ({ imageUrl, className }) => {
  const [svgContent, setSvgContent] = useState('');


  useEffect(() => {

    const convertImageToSvg = async () => {
      try {
        const response = await fetch(imageUrl);
        const originalSvgContent = await response.text();

        // Replace <defs> with <use>
        const modifiedSvgContent = originalSvgContent.replace(/<defs>([\s\S]*?)<\/defs>/, '');

        setSvgContent(modifiedSvgContent);
      } catch (error) {
        console.error('Error converting image to SVG:', error);
      }
    };

    convertImageToSvg();
  }, [imageUrl]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: svgContent }} />;
};
{/* <ImageToSvg imageUrl={ele.category && ele.category.image} className="custom-svg" /> */}