export class TestContext {
    private storage = new Map<string, any>();

    set<T>(key: string, value: T): void {
        this.storage.set(key, value);
    }

    get<T>(key: string): T  {
        if (!this.storage.has(key)) throw new Error(`no such key: ${key}`);
        return this.storage.get(key) as T;
    }

    has(key: string): boolean {
        return this.storage.has(key);
    }


    clear(): void {
        this.storage.clear();
    }
}