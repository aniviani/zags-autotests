import { Page } from '@playwright/test';

type GetApiValueOptions = {
    page: Page;
    requestName: string;
    key: string;
};

export function getApiValue({
    page,
    requestName,
    key,
}: GetApiValueOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            page.on('response', async (response) => {
                if (!response.url().includes(requestName)) return;
                if (response.status() !== 200 && response.status() !== 201) {
                    reject(
                        new Error(`Request "${requestName}" failed with status ${response.status()}`)
                    );
                    return;
                }
                
                let json: any;
                try {
                    json = await response.json();
                } catch {
                    reject(
                        new Error(`Response "${requestName}" is not valid JSON`)
                    );
                    return;
                }
                const value = json?.data?.[key] ?? json?.[key];
                if (value === undefined) {
                    reject(
                        new Error(`Field "${key}" not found in response "${requestName}"`)
                    );
                    return;
                }
                if (value === null || String(value).trim() === '') {
                    reject(
                        new Error(`Field "${key}" in response "${requestName}" is empty`)
                    );
                    return;
                }
                resolve(String(value));
            });
        } catch (e: any) {
            reject(
                new Error(`getApiValue failed: request="${requestName}", key="${key}". ${e.message}`)
            );
        }
    });
}
