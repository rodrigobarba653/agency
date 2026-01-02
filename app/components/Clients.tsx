"use client";

import Image from "next/image";

export default function Clients() {
  // Generate array of all 32 logos
  const clients = Array.from({ length: 32 }, (_, i) => ({
    name: `Client ${i + 1}`,
    logo: `/images/logo-${i + 1}.png`,
  }));

  // Split into two rows: first 16 and last 16
  const firstRow = clients.slice(0, 16);
  const secondRow = clients.slice(16, 32);

  // Duplicate each row for seamless infinite scroll
  const duplicatedFirstRow = [...firstRow, ...firstRow, ...firstRow];
  const duplicatedSecondRow = [...secondRow, ...secondRow, ...secondRow];

  return (
    <section className="md:py-16">
      <div className="max-w-5xl mx-auto md:text-center md:pt-8 pb-24 pt-0 md:px-0 px-12">
        <div className="ppNeueCorpNormalUltralight.variable font-pp-normal-ultralight text-white space-y-6 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
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
        <div className="relative space-y-0">
          {/* First row: logo-1 to logo-16 */}
          <div className="flex animate-scroll">
            {duplicatedFirstRow.map((client, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center justify-center shrink-0 px-8 md:px-12 lg:px-16"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={200}
                  height={100}
                  className="object-contain opacity-80 w-16 md:w-24 lg:w-28"
                  style={{
                    filter: "brightness(0) invert(1)",
                    WebkitFilter: "brightness(0) invert(1)",
                  }}
                />
              </div>
            ))}
          </div>
          {/* Second row: logo-17 to logo-32 */}
          <div className="flex animate-scroll-reverse">
            {duplicatedSecondRow.map((client, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center justify-center shrink-0 px-8 md:px-12 lg:px-16"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={200}
                  height={100}
                  className="object-contain opacity-80 w-16 md:w-24 lg:w-28"
                  style={{
                    filter: "brightness(0) invert(1)",
                    WebkitFilter: "brightness(0) invert(1)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
