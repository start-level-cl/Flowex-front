import type { CoverageZone } from '../types';

export const coverageZonesList: CoverageZone[] = [
  // Zona 1: Santiago Centro-Oriente (Z-1)
  { commune: 'Santiago', region: 'RM', zoneName: 'Zona Santiago Centro (Z-1)', hasCoverage: true },
  { commune: 'Providencia', region: 'RM', zoneName: 'Zona Santiago Centro-Oriente (Z-1)', hasCoverage: true },
  { commune: 'Las Condes', region: 'RM', zoneName: 'Zona Santiago Oriente (Z-1)', hasCoverage: true },
  { commune: 'Ñuñoa', region: 'RM', zoneName: 'Zona Santiago Centro-Oriente (Z-1)', hasCoverage: true },
  { commune: 'Vitacura', region: 'RM', zoneName: 'Zona Santiago Oriente (Z-1)', hasCoverage: true },
  { commune: 'La Reina', region: 'RM', zoneName: 'Zona Santiago Oriente (Z-1)', hasCoverage: true },

  // Zona 2: Santiago Poniente-Sur (Z-2)
  { commune: 'Maipú', region: 'RM', zoneName: 'Zona Santiago Poniente (Z-2)', hasCoverage: true },
  { commune: 'Pudahuel', region: 'RM', zoneName: 'Zona Santiago Poniente (Z-2)', hasCoverage: true },
  { commune: 'San Bernardo', region: 'RM', zoneName: 'Zona Santiago Sur (Z-2)', hasCoverage: true },
  { commune: 'La Florida', region: 'RM', zoneName: 'Zona Santiago Sur-Oriente (Z-2)', hasCoverage: true },
  { commune: 'Quilicura', region: 'RM', zoneName: 'Zona Santiago Norte (Z-2)', hasCoverage: true },

  // Zona 3: Valparaíso / Viña del Mar (Z-3)
  { commune: 'Viña del Mar', region: 'Valparaíso', zoneName: 'Zona Costa Viña (Z-3)', hasCoverage: true },
  { commune: 'Valparaíso', region: 'Valparaíso', zoneName: 'Zona Costa Valparaíso (Z-3)', hasCoverage: true },
  { commune: 'Concón', region: 'Valparaíso', zoneName: 'Zona Costa Norte (Z-3)', hasCoverage: true },

  // Zona 4: Bío-Bío (Z-4)
  { commune: 'Concepción', region: 'Bío-Bío', zoneName: 'Zona Sur Concepción (Z-4)', hasCoverage: true },
  { commune: 'Talcahuano', region: 'Bío-Bío', zoneName: 'Zona Sur Talcahuano (Z-4)', hasCoverage: true },
  { commune: 'San Pedro de la Paz', region: 'Bío-Bío', zoneName: 'Zona Sur Concepción (Z-4)', hasCoverage: true },

  // Zona 5: Araucanía (Z-5)
  { commune: 'Temuco', region: 'Araucanía', zoneName: 'Zona Sur Temuco (Z-5)', hasCoverage: true },
  { commune: 'Padre Las Casas', region: 'Araucanía', zoneName: 'Zona Sur Temuco (Z-5)', hasCoverage: true },

  // Comunas Sin Cobertura (Bloqueadas)
  { commune: 'Punta Arenas', region: 'Magallanes', zoneName: 'Sin Cobertura', hasCoverage: false },
  { commune: 'Coyhaique', region: 'Aysén', zoneName: 'Sin Cobertura', hasCoverage: false },
  { commune: 'Isla de Pascua', region: 'Valparaíso', zoneName: 'Sin Cobertura', hasCoverage: false },
  { commune: 'Putre', region: 'Arica y Parinacota', zoneName: 'Sin Cobertura', hasCoverage: false },
];

export const getCommuneZone = (communeName: string): { hasCoverage: boolean; zoneName: string; message?: string } => {
  const found = coverageZonesList.find(c => c.commune.toLowerCase() === communeName.toLowerCase());
  if (!found || !found.hasCoverage) {
    return {
      hasCoverage: false,
      zoneName: 'Sin Cobertura',
      message: `La comuna "${communeName}" no cuenta con cobertura de despacho actual en FlowEx.`
    };
  }
  return {
    hasCoverage: true,
    zoneName: found.zoneName
  };
};
