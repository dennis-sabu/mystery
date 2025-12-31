
import LZString from "lz-string";

export const encodeData = (data: any): string => {
    const json = JSON.stringify(data);
    return LZString.compressToEncodedURIComponent(json);
};

export const decodeData = (encodedData: string): any => {
    try {
        const json = LZString.decompressFromEncodedURIComponent(encodedData);
        if (!json) return null;
        return JSON.parse(json);
    } catch (error) {
        console.error("Failed to decode data:", error);
        return null;
    }
};
