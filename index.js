const axios = require("axios").default;
const FormData = require("form-data");
const fs = require("fs");
class SuccessfulResponse {
    /**
     * 
     * @param {boolean} status 
     * @param {{file: {url: {full: string, short: string}, metadata: {id: string, name: string, size: {bytes: number, readable: string}}}}} data 
     */
    constructor(status, data) {
        this.status = status;
        this.data = data;
    }
}
class ErrorResponse {
    /**
     * 
     * @param {boolean} status 
     * @param {{message: string, type: string, code: number}} error 
     */
    constructor(status, error) {
        this.status = status;
        this.error = error;
    }
}
class AnonFiles {
    /**
     * 
     * @param {string} [apiKey] 
     */
    constructor(apiKey) {
        this.instance = (apiKey) ? axios.create({baseURL: "https://api.anonfiles.com", params: {
            "token": apiKey,
        }}) : axios.create({baseURL: "https://api.anonfiles.com"});
    }
     /**
     * 
     * @param {string} filePath 
     * @returns {Promise<SuccessfulResponse | ErrorResponse>}
     * @example
     * const AnonFiles = require("anonfiles.js");
     * const API = new AnonFiles(); // Provide an APIKEY to upload straight to your account.
     * API.Upload("/Path/To/File").then(console.log);
     */
      async Upload(filePath) {
        let buffer = fs.createReadStream(filePath);
        const form = new FormData();
        form.append("file", buffer);
        return this.instance.post("/upload", form, {
            headers: {
                ...form.getHeaders(),
            }
        }).then(({data}) => {
            return (data.status) ? new SuccessfulResponse(data.status, data.data) : new ErrorResponse(data.status, data.error);
        }).catch((err) => {throw new Error(err)});
    }
    /**
     * 
     * @param {string} fileId 
     * @returns {Promise<SuccessfulResponse | ErrorResponse>}
     * @example
     * const AnonFiles = require("anonfiles.js");
     * const API = new AnonFiles();
     * API.GetFile("u1C0ebc4b0").then(console.log);
     */
    async GetFile(fileId) {
        return this.instance.get(`https://api.anonfiles.com/v2/file/${fileId}/info`, {
            headers: {
                "Accept": "application/json"
            }
        }).then(({data}) => {
            return (data.status) ? new SuccessfulResponse(data.status, data.data) : new ErrorResponse(data.status, data.error);
        }).catch((err) => {throw new Error(err)});
    }
}
module.exports = AnonFiles;