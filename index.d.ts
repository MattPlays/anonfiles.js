type SuccessfulResponse = {
    status: number,
    data: {
        file: {
            url: {
                full: string,
                short: string
            },
            metadata: {
                id: string,
                name: string,
                size: {
                    bytes: number,
                    readable: string
                }
            }
        }
    }
};
type ErrorResponse = {
    status: number,
    error: {
        message: string,
        type: string,
        code: number,
    }
};
export class AnonFiles {
    constructor(apiKey?: string);
    async Upload(filePath: string): Promise<SuccessfulResponse | ErrorResponse>;
    async GetFile(fileId: string): Promise<SuccessfulResponse | ErrorResponse>;
}