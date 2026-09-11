import * as MockProviders from "../mocks/providers.js";
import {
  validateDeepSeekToken as _canonValidateDeepSeekToken,
  queryDeepSeekBalance as _canonQueryDeepSeekBalance,
  validatePaddleToken as _canonValidatePaddleToken,
} from "@retainpdf/api/providers";
import { mockable } from "./_mockable.js";

export const validateDeepSeekToken = mockable(_canonValidateDeepSeekToken, MockProviders.validateDeepSeekToken);
export const queryDeepSeekBalance = mockable(_canonQueryDeepSeekBalance, MockProviders.queryDeepSeekBalance);
export const validatePaddleToken = mockable(_canonValidatePaddleToken, MockProviders.validatePaddleToken);
