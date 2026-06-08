"use client";

import { useState } from "react";

export default function Home() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [product, setProduct] = useState("T-shirt");
  const [style, setStyle] = useState("Roi");
  const [clientImage, setClientImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState("");
  const [designId, setDesignId] = useState<string | null>(null);
  const [savedFile, setSavedFile] = useState<string | null>(null);

  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setClientImage(null);
    setDesignId(null);
    setSavedFile(null);
  }

  async function handleGenerate() {
    if (!selectedFile) {
      alert("Ajoute d'abord une photo.");
      return;
    }

    setLoading(true);
    setClientImage(null);
    setProgressStep("Analyse de la photo...");

    setTimeout(() => {
      setProgressStep("Création du personnage...");
    }, 4000);

    setTimeout(() => {
      setProgressStep("Intégration sur le produit...");
    }, 9000);

    setTimeout(() => {
     setProgressStep("Finalisation du rendu...");
    }, 14000);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("product", product);
    formData.append("style", style);

    const response = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.clientImage) {
      setClientImage(data.clientImage);
      setDesignId(data.designId);
      setSavedFile(data.savedFile);
    } else {
      alert(data.error || "Erreur pendant la génération.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#070609] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,0.20),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,0.16),transparent_35%)]" />

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-xl font-black tracking-tight">PetLegend</div>

          <div className="hidden gap-6 text-sm text-white/65 md:flex">
            <button onClick={() => scrollToId("examples")} className="hover:text-white">
              Exemples
            </button>
            <button onClick={() => scrollToId("create")} className="hover:text-white">
              Créer
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
              Créations IA personnalisées pour animaux
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Transforme ton animal en œuvre légendaire.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Upload une photo, choisis un style, et découvre ton compagnon
              directement sur un produit premium avant de commander.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-white/75 sm:grid-cols-3">
              <MiniBadge text="Aperçu IA instantané" />
              <MiniBadge text="Idée cadeau unique" />
              <MiniBadge text="Rendu avant achat" />
            </div>
          </div>

          <div id="create" className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl">
            <div className="rounded-[1.5rem] bg-black/40 p-6">
              <h2 className="text-2xl font-black">Créer mon design</h2>
              <p className="mt-2 text-sm text-white/50">
                Choisis une photo claire de ton animal.
              </p>

              <div className="mt-6">
                {!selectedFile ? (
                  <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-amber-300/40 bg-amber-300/10 px-6 py-8 text-center font-bold text-amber-100 transition hover:bg-amber-300/15">
                    Choisir une photo
                    <input
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-emerald-100">
                    Photo sélectionnée : {selectedFile.name}
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <SelectBox
                  label="Produit"
                  value={product}
                  onChange={setProduct}
                  options={["T-shirt", "Mug", "Poster"]}
                />

                <SelectBox
                  label="Style"
                  value={style}
                  onChange={setStyle}
                  options={["Roi", "Mafia Boss", "Super-héros"]}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 px-6 py-4 text-lg font-black text-black transition hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? "Génération en cours..." : "Générer mon design"}
              </button>
              {loading && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-amber-100">
                  {progressStep}
                </div>
              )}

              <p className="mt-3 text-center text-xs text-white/40">
                Aucun paiement requis pour tester la génération.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-14 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          {!previewImage && !clientImage && (
            <div className="flex h-[460px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 text-center text-white/40">
              Ton résultat apparaîtra ici après génération
            </div>
          )}

          {previewImage && !clientImage && (
            <div className="grid gap-6 md:grid-cols-2">
              <ImageBlock title="Photo originale" src={previewImage} />
              <div className="flex items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 text-white/40">
                Clique sur “Générer mon design”
              </div>
            </div>
          )}

          {clientImage && (
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <ImageBlock title="Photo originale" src={previewImage || ""} />

              <div>
                <p className="mb-3 text-sm text-amber-200">Résultat généré</p>
                <img
                  src={clientImage}
                  alt="Résultat généré"
                  className="w-full rounded-[1.5rem] shadow-2xl"
                />

                <button
                  onClick={() => {
                    if (!designId || !savedFile) {
                      alert("Aucun design trouvé.");
                      return;
                    }
                    
                    const imageUrl = `${window.location.origin}${savedFile}`;

                    window.location.href = `https://qven8i-s1.myshopify.com/products/t-shirt-animal-personnalise?designId=${designId}&imageUrl=${encodeURIComponent(imageUrl)}`;
                  }}  
                  className="mt-5 w-full rounded-2xl bg-emerald-400 px-6 py-4 text-lg font-black text-black hover:bg-emerald-300"
                >
                  Passer à la commande
                </button>

                <p className="mt-3 text-center text-sm text-white/45">
                  Passez à l'étape suivante pour finaliser votre commande et renseigner vos informations de livraison.
                </p>
              </div>
            </div>
          )}
        </section>

        <section id="examples" className="mt-20">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black">Exemples de créations</h2>
            <p className="mt-3 text-white/50">
              Trois styles simples, forts et immédiatement compréhensibles.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <ExampleCard
              image="/examples/tshirtroi.jpg"
              title="Roi"
              text="Un portrait royal premium pour transformer ton animal en souverain."
            />
            <ExampleCard
              image="/examples/tshirtmafiaboss.jpg"
              title="Mafia Boss"
              text="Le style parrain : élégant, drôle et très fort visuellement."
            />
            <ExampleCard
              image="/examples/tshirthero.jpg"
              title="Super-héros"
              text="Une version héroïque de ton compagnon, prête à impressionner."
            />
          </div>
        </section>


        <section className="mt-20 grid gap-4 md:grid-cols-4">
          <Step number="1" title="Upload" text="Ajoute une photo claire." />
          <Step number="2" title="Choisis" text="Produit + style." />
          <Step number="3" title="Génère" text="Découvre le rendu IA." />
          <Step number="4" title="Commande" text="Valide puis achète." />
        </section>
      </section>
    </main>
  );
}

function MiniBadge({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      {text}
    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-white/75">{label}</label>
      <select
        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 p-4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ImageBlock({ title, src }: { title: string; src: string }) {
  return (
    <div>
      <p className="mb-3 text-sm text-white/50">{title}</p>
      <img
        src={src}
        alt={title}
        className="max-h-[480px] w-full rounded-[1.5rem] object-contain"
      />
    </div>
  );
}

function ExampleCard({
  image,
  title,
  text,
}: {
  image: string;
  title: string;
  text: string;
}) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05]">
      <img src={image} alt={title} className="h-64 w-full object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-black">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
      </div>
    </div>
  );
}



function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <p className="text-3xl font-black text-amber-200">{number}</p>
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="mt-2 text-sm text-white/55">{text}</p>
    </div>
  );
}