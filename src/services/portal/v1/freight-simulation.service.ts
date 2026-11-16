import { api } from "./api";
import type { CarrierService } from "./carrier-service.service";

type FreightSimulationVolume = {
  length: number;
  width: number;
  height: number;
  weight: number;
  value: number;
};

type FreightSimulationSimulateRequest = {
  originZip: string;
  destinationZip: string;
  volumes: FreightSimulationVolume[];
};

type FreightSimulationQuote = {
  id: number;
  carrierName: string;
  service: string;
  freightValue: number;
  deliveryDays: number;
  toll: number;
  emex: number;
  gris: number;
  icms: number;
  advalorem: number;
};

type FreightSimulationSimulateResponse = FreightSimulationQuote[];

const CUBIC_FACTOR_KG_PER_M3 = 300;
const MAX_QUOTES = 16;

const round = (value: number) => Math.round(value * 100) / 100;

const FreightSimulationService = {
  /**
   * Cálculo ilustrativo: o endpoint de cotação do portal novo ainda não existe, então a
   * simulação combina peso cubado, distância entre CEPs e um fator por serviço ativo.
   */
  simulate: async ({
    originZip,
    destinationZip,
    volumes,
  }: FreightSimulationSimulateRequest) => {
    const res = await api.get<CarrierService[]>("/carrier-services", {
      params: { active: true },
    });

    const chargedWeight = volumes.reduce((total, volume) => {
      const cubicWeight =
        (volume.length * volume.width * volume.height * CUBIC_FACTOR_KG_PER_M3) /
        1_000_000;
      return total + Math.max(volume.weight, cubicWeight);
    }, 0);
    const declaredValue = volumes.reduce(
      (total, volume) => total + volume.value,
      0,
    );
    const distanceFactor =
      Math.abs(Number(originZip.slice(0, 2)) - Number(destinationZip.slice(0, 2))) /
      10;

    const quotes: FreightSimulationSimulateResponse = res.data
      .slice(0, MAX_QUOTES)
      .map((service, index) => {
        const serviceFactor = 0.7 + ((service.id * 7) % 13) / 10;
        const base = (4.2 + chargedWeight * 1.35) * serviceFactor * (1 + distanceFactor);
        const advalorem = round(declaredValue * 0.002 * serviceFactor);
        const gris = round(declaredValue * 0.0015 * serviceFactor);
        const toll = round(1.1 * Math.ceil(chargedWeight / 100 || 1) * serviceFactor);
        const emex = round(base * 0.12);
        const icms = round(base * 0.07);
        return {
          id: service.id,
          carrierName: service.carrierName,
          service: index % 3 === 0 ? "SEDEX" : index % 3 === 1 ? "Standard" : "Expresso",
          freightValue: round(base + advalorem + gris + toll + emex + icms),
          deliveryDays: Math.max(
            1,
            Math.round(3 + distanceFactor * 6 + ((service.id * 3) % 11)),
          ),
          toll,
          emex,
          gris,
          icms,
          advalorem,
        };
      });

    return quotes;
  },
} as const;

export {
  type FreightSimulationQuote,
  FreightSimulationService,
  type FreightSimulationSimulateRequest,
  type FreightSimulationSimulateResponse,
  type FreightSimulationVolume,
};
