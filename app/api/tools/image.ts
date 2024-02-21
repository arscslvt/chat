import { generateImage } from "../images/generate";

export const generateImageFromText = async (text: string) => {
  try {
    const image = await generateImage(text);

    console.log("Image data: ", image);

    return image;
  } catch (e) {
    console.log("Error while generating image: ", e);
    return null;
  }
};
