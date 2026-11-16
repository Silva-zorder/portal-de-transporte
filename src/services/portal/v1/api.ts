import { createMockDatabase, type MockRecord } from "./mock-database";

type ApiResponse<TData> = { data: TData };
type ApiRequestConfig = { params?: Record<string, unknown> };

const MOCK_LATENCY_MS = 180;

/**
 * Cliente da API do Portal de Transportes. Enquanto o backend novo não existe, responde a partir
 * de um banco em memória (reinicia a cada reload) com a mesma assinatura de um cliente HTTP:
 * trocar por axios/fetch aqui não altera services, queries nem hooks.
 */
function createApi() {
  const database = createMockDatabase();

  const respond = <TData>(resolve: () => unknown) =>
    new Promise<ApiResponse<TData>>((done, fail) => {
      setTimeout(() => {
        try {
          done({ data: structuredClone(resolve()) as TData });
        } catch (error) {
          fail(error);
        }
      }, MOCK_LATENCY_MS);
    });

  const parse = (path: string) => {
    const [collection, id] = path.split("/").filter(Boolean);
    const records = database[collection];
    if (!records) throw new Error(`Recurso não encontrado: ${path}`);
    return { records, id: id === undefined ? undefined : Number(id) };
  };

  const findIndex = (records: MockRecord[], id: number | undefined) => {
    const index = records.findIndex((record) => record.id === id);
    if (index < 0) throw new Error("Registro não encontrado.");
    return index;
  };

  return {
    get: <TData>(path: string, { params }: ApiRequestConfig = {}) =>
      respond<TData>(() => {
        const { records, id } = parse(path);
        if (id !== undefined) return records[findIndex(records, id)];
        const filters = Object.entries(params ?? {}).filter(
          ([, value]) => value !== undefined,
        );
        return records.filter((record) =>
          filters.every(([key, value]) => record[key] === value),
        );
      }),
    post: <TData>(path: string, body: Record<string, unknown>) =>
      respond<TData>(() => {
        const { records } = parse(path);
        const nextId =
          records.reduce((max, record) => Math.max(max, record.id), 0) + 1;
        const created = { ...body, id: nextId };
        records.unshift(created);
        return created;
      }),
    put: <TData>(path: string, body: Record<string, unknown>) =>
      respond<TData>(() => {
        const { records, id } = parse(path);
        const index = findIndex(records, id);
        records[index] = { ...records[index], ...body, id: records[index].id };
        return records[index];
      }),
    delete: (path: string) =>
      respond<null>(() => {
        const { records, id } = parse(path);
        records.splice(findIndex(records, id), 1);
        return null;
      }),
  };
}

const api = createApi();

export { type ApiResponse, api };
