import OpenAI from "openai";
import { toFile } from "openai/uploads";
import fs from "fs";
import path from "path";
const ipGenerations = new Map<string, number>();
const MAX_GENERATIONS_PER_IP = 3;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function loadReferenceImage(relativePath: string) {
  const fullPath = path.join(process.cwd(), "public", relativePath);
  const buffer = fs.readFileSync(fullPath);

  return await toFile(buffer, path.basename(fullPath), {
    type: "image/png",
  });
}

export async function POST(request: Request) {
  try {
    const TEST_MODE = false;

if (TEST_MODE) {
  const designId = `test-design-${Date.now()}`;

  return Response.json({
    clientImage: "/test-result.jpg",
    savedFile: "/test-result.jpg",
    designId: designId,
  });
}
    const forwardedFor = request.headers.get("x-forwarded-for");
const ip = forwardedFor?.split(",")[0] || "local-user";

const currentCount = ipGenerations.get(ip) || 0;

if (currentCount >= MAX_GENERATIONS_PER_IP) {
  return Response.json(
    {
      error:
        "Tu as atteint la limite de 3 générations gratuites. Passe à la commande ou réessaie plus tard.",
    },
    { status: 429 }
  );
}

ipGenerations.set(ip, currentCount + 1);
    const formData = await request.formData();

    const petImage = formData.get("image") as File;
    const product = formData.get("product") as string;
    const style = formData.get("style") as string;

    if (!petImage) {
      return Response.json({ error: "Aucune image reçue." }, { status: 400 });
    }

    if (product !== "T-shirt" || style !== "Roi") {
      return Response.json(
        { error: "Pour l’instant, teste uniquement T-shirt + Roi." },
        { status: 400 }
      );
    }

    const petBuffer = Buffer.from(await petImage.arrayBuffer());

    const petFile = await toFile(petBuffer, "pet.png", {
      type: petImage.type || "image/png",
    });

    const h = await loadReferenceImage(
      "references/tshirt/royal/htshirt.png"
    );

    const prompt = `
PET POD GENERATOR — ROYAL T-SHIRT CLIENT PREVIEW

INPUTS:
Image 1 = uploaded pet reference.
Image 2 = final model photo wearing a t-shirt.

PRIMARY OBJECTIVE:
Use Image 2 as the exact base photograph.
Keep the person, pose, background, lighting, body proportions, clothes except the t-shirt, accessories and composition identical.
Modify only the t-shirt.

TASK:
Transform the uploaded pet from Image 1 into a luxury royal portrait.
Place this royal pet portrait as a realistic print on the chest of the t-shirt in Image 2.
The final result must look like a real fashion ecommerce photograph.

PET IDENTITY:
The pet must remain instantly recognizable.
Preserve eye shape, eye color, muzzle, nose, ears, fur texture, fur color, fur markings, breed characteristics and expression.
Do not create a generic animal.

ROYAL STYLE:
Transform the pet into an elegant royal monarch.
Use a crown, royal cape, aristocratic clothing, gold embroidery and museum-quality oil painting aesthetics.
The result should feel noble, premium, elegant and commercially desirable.
Avoid cartoon, parody, cheap fantasy or sticker style.

PRINT INTEGRATION:
The artwork must appear physically printed into the fabric.
Respect folds, shirt curvature, shadows, lighting direction, fabric texture and perspective.
The print must not look pasted, floating or photoshopped.
It should look like the t-shirt was printed before the photograph was taken.

OUTPUT:
Generate one single final ecommerce product image.
No text.
No logo.
No watermark.
Do not create a collage.
Do not change the base photo composition.
Only replace/improve the t-shirt print.
`;

    const result = await openai.images.edit({
      model: "gpt-image-1",
      image: [petFile, h],
      prompt,
      size: "1024x1024",
      quality: "medium",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

if (!imageBase64) {
  throw new Error("Aucune image générée");
}

const designId = `design-${Date.now()}`;
const fileName = `${designId}.png`;

return Response.json({
  clientImage: `data:image/png;base64,${imageBase64}`,
  savedFile: `data:image/png;base64,${imageBase64}`,
  designId: designId,
});
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Erreur pendant la génération." },
      { status: 500 }
    );
  }
}