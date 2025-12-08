"use client";

export default function Clients() {
  const clients = [
    { name: "Continental", logo: "Continental" },
    { name: "PORSCHE", logo: "PORSCHE" },
    { name: "swatch+", logo: "swatch+" },
    { name: "Cartier", logo: "Cartier" },
    { name: "MONTBLANC", logo: "MONTBLANC" },
  ];

  // Duplicate clients for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto text-center pb-8">
        <div className="ppNeueCorpNormalUltralight.variable font-pp-normal-ultralight text-white space-y-6 text-base md:text-lg leading-relaxed">
          <h2 className="font-pp-neue-corp-wide-medium text-white text-4xl md:text-5xl lg:text-6xl">
            Clientes
          </h2>
          <p>
            Creemos en construir colaboraciones basadas en confianza, cercanía y
            un entendimiento mutuo que nos permita crecer juntos.
          </p>
          <p>
            Nos involucramos con cada marca como un aliado creativo y
            estratégico, escuchando, proponiendo y trabajando de la mano para
            lograr experiencias que respondan a su visión y a sus objetivos.
          </p>
        </div>
      </div>
      <div
        id="clientes"
        className="bg-black py-16 md:py-24 border-t border-white border-b overflow-hidden"
      >
        <div className="relative">
          <div className="flex animate-scroll">
            {duplicatedClients.map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-center shrink-0 px-8 md:px-12 lg:px-16"
              >
                <span className="text-white text-xl md:text-2xl lg:text-3xl font-light opacity-80 whitespace-nowrap">
                  {client.logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
