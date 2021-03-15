import { Store } from "../model/stores.model";

export class StoresResponse {
    total: number;
    limit: number;
    offset: number;
    items: Store[];
}
