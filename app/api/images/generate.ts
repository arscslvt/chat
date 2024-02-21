// app/api/route.ts

export async function generateImage(text: string) {
  console.log("Generating image from text: ", text);

  const body = JSON.stringify({
    prompt: text || "",
    height: 768,
    width: 768,
    num_outputs: 1,
    negative_prompt: "deformed, ugly",
  });

  const response = await fetch(
    "https://modal-labs--instant-stable-diffusion-xl.modal.run/v1/inference",
    {
      method: "POST",
      headers: {
        // Authorization: `Token ${process.env.MODAL_TOKEN_ID}:${process.env.MODAL_TOKEN_SECRET}`,
        Authorization: `Token ${process.env.MODAL_TOKEN_ID}:${process.env.MODAL_TOKEN_SECRET}`,
        "Content-Type": "application/json",
      },
      body,
    }
  );

  if (response.status !== 201) {
    const message = await response.text();
    throw new Error(message);
  }

  const imageBuffer = await response.arrayBuffer();
  return Buffer.from(imageBuffer);
}
