// localStorage封装
export class UseLocalStorageUtil {
    private storage: Storage | null;

    constructor() {
        this.storage = typeof window !== 'undefined' ? window.localStorage : null;
    }

    /**
     * 设置 localStorage
     * @param key
     * @param value
     */
    set(key: string, value: any) {
        this.storage?.setItem(key, JSON.stringify(value));
    }

    /**
     * 获取 localStorage
     * @param key
     */
    get(key: string) {
        const value = this.storage?.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
        return null;
    }

    /**
     * 删除 localStorage
     * @param key
     */
    remove(key: string) {
        this.storage?.removeItem(key);
    }

    /**
     * 清空 localStorage
     */
    clear() {
        this.storage?.clear();
    }
}
