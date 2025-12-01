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
    <section id="clientes" className="bg-black py-16 md:py-24 border-t border-white border-b overflow-hidden">
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
    </section>
  );
}
