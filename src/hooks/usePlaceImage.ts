import { useState, useEffect } from 'react';

export default function usePlaceImage(query: string, fallbackCategory: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchImage = async () => {
      try {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&generator=search&gsrsearch=${encodedQuery}&gsrlimit=1&pithumbsize=800&format=json&origin=*`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (isMounted) {
          let foundImage = false;
          if (data.query && data.query.pages) {
            const pages = Object.values(data.query.pages) as any[];
            if (pages.length > 0 && pages[0].thumbnail) {
              setImageUrl(pages[0].thumbnail.source);
              foundImage = true;
            }
          }
          
          if (!foundImage) {
            // Fallback to a placeholder image service
            setImageUrl(`https://loremflickr.com/800/600/${encodeURIComponent(fallbackCategory)},travel/all`);
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setImageUrl(`https://loremflickr.com/800/600/${encodeURIComponent(fallbackCategory)},travel/all`);
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [query, fallbackCategory]);

  return { imageUrl, loading };
}
