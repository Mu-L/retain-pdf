// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import { API_PREFIX } from "../../../js/config/api-constants.js";
import { fetchDocumentByJobId } from "../../../js/api/documents.js";
import { createFavorite, deleteFavorite, fetchFavorites } from "../../../js/api/favorites.js";
import * as shared from "../../../../../../packages/reader/src/shared/state/server-favorites-port.js";

export const normalizeServerFavorite = shared.normalizeServerFavorite;
export const dedupeServerFavorites = shared.dedupeServerFavorites;
export const createReaderServerFavoritesPort = (opts: any = {}) =>
  shared.createReaderServerFavoritesPort({
    apiPrefix: API_PREFIX,
    documentByJobId: fetchDocumentByJobId,
    submitFavorite: createFavorite,
    loadFavorites: fetchFavorites,
    removeFavorite: deleteFavorite,
    ...opts,
  });
