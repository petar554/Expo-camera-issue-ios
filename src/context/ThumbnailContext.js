import React, { createContext, useContext, useState } from "react";

const ThumbnailContext = createContext();

export const ThumbnailProvider = ({ children }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [nextImageId, setNextImageId] = useState(null);

  return (
    <ThumbnailContext.Provider value={{ thumbnail, setThumbnail, imageCount, setImageCount, nextImageId, setNextImageId }}>
      {children}
    </ThumbnailContext.Provider>
  );
};

export const useThumbnail = () => useContext(ThumbnailContext);
