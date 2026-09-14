// providers — pure
import { buildApiEndpoint, submitJson } from "./http.js";
export async function validateMineruToken(apiPrefix, payload) {
    return submitJson(buildApiEndpoint(apiPrefix, "providers/mineru/validate-token"), payload);
}
export async function validatePaddleToken(apiPrefix, payload) {
    return submitJson(buildApiEndpoint(apiPrefix, "providers/paddle/validate-token"), payload);
}
export async function validateDeepSeekToken(apiPrefix, payload) {
    return submitJson(buildApiEndpoint(apiPrefix, "providers/deepseek/validate-token"), payload);
}
export async function queryDeepSeekBalance(apiPrefix, payload) {
    return submitJson(buildApiEndpoint(apiPrefix, "providers/deepseek/balance"), payload);
}
