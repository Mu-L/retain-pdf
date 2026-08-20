import { buildApiHeaders } from "../../../js/config/runtime.js";
import * as shared from "../../../../../../packages/reader/src/shared/config/pdf-document-config.js";
export const createReaderPdfDocumentConfigPort = (opts: any = {}) => shared.createReaderPdfDocumentConfigPort({ buildHeaders: buildApiHeaders, ...opts });
export const defaultReaderPdfDocumentConfigPort = shared.defaultReaderPdfDocumentConfigPort;
