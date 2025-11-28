"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    emailLaboral: "",
    telefono: "",
    nombreEmpresa: "",
    servicioInteres: "",
    presupuesto: "",
    aceptaPrivacidad: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-black text-3xl md:text-4xl lg:text-5xl mb-12 text-center">
            Danos una campaña, una marca o un reto y lo convertimos en una
            historia que la gente quiera ver, compartir y recordar.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="nombreCompleto"
                    className="block text-black text-sm mb-2"
                  >
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black focus:outline-none focus:border-black pb-2 text-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-black text-sm mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black focus:outline-none focus:border-black pb-2 text-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="servicioInteres"
                    className="block text-black text-sm mb-2"
                  >
                    Servicio de Interés
                  </label>
                  <select
                    id="servicioInteres"
                    name="servicioInteres"
                    value={formData.servicioInteres}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black focus:outline-none focus:border-black pb-2 text-black appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="experiencia">Experiencia de Marca</option>
                    <option value="produccion">Producción de Eventos</option>
                    <option value="logistica">Logística y Operación</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="emailLaboral"
                    className="block text-black text-sm mb-2"
                  >
                    Email Laboral
                  </label>
                  <input
                    type="email"
                    id="emailLaboral"
                    name="emailLaboral"
                    value={formData.emailLaboral}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black focus:outline-none focus:border-black pb-2 text-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nombreEmpresa"
                    className="block text-black text-sm mb-2"
                  >
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    id="nombreEmpresa"
                    name="nombreEmpresa"
                    value={formData.nombreEmpresa}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black focus:outline-none focus:border-black pb-2 text-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="presupuesto"
                    className="block text-black text-sm mb-2"
                  >
                    Presupuesto
                  </label>
                  <select
                    id="presupuesto"
                    name="presupuesto"
                    value={formData.presupuesto}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black focus:outline-none focus:border-black pb-2 text-black appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona un rango</option>
                    <option value="menos-50k">Menos de $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="mas-250k">Más de $250,000</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Checkbox */}
            <div className="flex items-center justify-center gap-3">
              <input
                type="checkbox"
                id="aceptaPrivacidad"
                name="aceptaPrivacidad"
                checked={formData.aceptaPrivacidad}
                onChange={handleChange}
                className="w-5 h-5 cursor-pointer"
              />
              <label
                htmlFor="aceptaPrivacidad"
                className="text-black text-sm cursor-pointer"
              >
                He leído y acepto el{" "}
                <a href="#" className="underline">
                  Aviso de Privacidad
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cotizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

