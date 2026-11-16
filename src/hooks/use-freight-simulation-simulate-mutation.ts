import { useMutation } from "@tanstack/react-query";
import {
  FreightSimulationService,
  type FreightSimulationSimulateRequest,
} from "@/services/portal/v1/freight-simulation.service";

function useFreightSimulationSimulateMutation() {
  return useMutation({
    mutationFn: (request: FreightSimulationSimulateRequest) =>
      FreightSimulationService.simulate(request),
  });
}

export { useFreightSimulationSimulateMutation };
