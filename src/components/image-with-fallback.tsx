import { Theme } from "@emotion/react";
import { Box, SxProps } from "@mui/material";
import React, { ImgHTMLAttributes, useState } from "react";

interface IBoxProps extends ImgHTMLAttributes<HTMLImageElement> {
  component?: "img";
  sx?: SxProps<Theme>;
  display?: string;
  fallbackSrc?: string;
}

export const ImageWithFallback = ({ fallbackSrc, src, alt, ...props }: IBoxProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return <Box component="img" src={imgSrc} alt={alt} onError={handleError} style={{ width: "100%", height: "auto" }} {...props} />;
};
