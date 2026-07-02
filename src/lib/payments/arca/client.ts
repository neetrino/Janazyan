import { getArcaConfig } from "./config";
import type {
  ArcaOrderStatusResponse,
  ArcaRegisterOrderResult,
  ArcaRegisterResponse,
} from "./types";

const AMD_CURRENCY_NUMERIC = "051";
const AMD_MINOR_MULTIPLIER = 100;

function toErrorCode(errorCode: string | number | undefined): string {
  return String(errorCode ?? "");
}

function toOrderStatus(orderStatus: number | string | undefined): number | null {
  if (typeof orderStatus === "number" && Number.isFinite(orderStatus)) {
    return orderStatus;
  }

  if (typeof orderStatus === "string" && orderStatus.trim()) {
    const parsed = Number.parseInt(orderStatus, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toActionCode(actionCode: number | string | undefined): number | null {
  if (typeof actionCode === "number" && Number.isFinite(actionCode)) {
    return actionCode;
  }

  if (typeof actionCode === "string" && actionCode.trim()) {
    const parsed = Number.parseInt(actionCode, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

async function postArcaForm<TResponse>(
  endpointPath: string,
  payload: Record<string, string>,
): Promise<TResponse> {
  const config = getArcaConfig();
  const requestPayload = new URLSearchParams({
    userName: config.username,
    password: config.password,
    ...payload,
  });

  const response = await fetch(`${config.baseUrl}/${endpointPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestPayload.toString(),
    cache: "no-store",
  });

  const rawBody = await response.text();
  let parsedBody: unknown;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    throw {
      status: 502,
      type: "https://api.shop.am/problems/payment-provider-error",
      title: "ArCa communication error",
      detail: "ArCa returned a non-JSON response",
    };
  }

  if (!parsedBody || typeof parsedBody !== "object") {
    throw {
      status: 502,
      type: "https://api.shop.am/problems/payment-provider-error",
      title: "ArCa communication error",
      detail: "ArCa returned an unexpected response",
    };
  }

  return parsedBody as TResponse;
}

export function toArcaAmountMinorUnits(amount: number, currencyNumeric: string): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Validation Error",
      detail: "Payment amount must be a positive number",
    };
  }

  if (currencyNumeric === AMD_CURRENCY_NUMERIC) {
    return Math.round(amount * AMD_MINOR_MULTIPLIER);
  }

  return Math.round(amount * 100);
}

export const arcaClient = {
  async registerOrder(params: {
    orderNumber: string;
    amountMinorUnits: number;
    returnUrl: string;
    description?: string;
    language?: string;
  }): Promise<ArcaRegisterOrderResult> {
    const config = getArcaConfig();
    const registerResponse = await postArcaForm<ArcaRegisterResponse>("register.do", {
      orderNumber: params.orderNumber,
      amount: String(params.amountMinorUnits),
      currency: config.currency,
      returnUrl: params.returnUrl,
      description: params.description ?? `Order ${params.orderNumber}`,
      language: params.language ?? config.language,
      ...(config.force3ds2 ? { jsonParams: JSON.stringify({ FORCE_3DS2: "true" }) } : {}),
    });

    const errorCode = toErrorCode(registerResponse.errorCode);
    if (errorCode && errorCode !== "0") {
      throw {
        status: 502,
        type: "https://api.shop.am/problems/payment-provider-error",
        title: "ArCa register error",
        detail: registerResponse.errorMessage || "ArCa returned an error while registering payment",
      };
    }

    if (!registerResponse.orderId || !registerResponse.formUrl) {
      throw {
        status: 502,
        type: "https://api.shop.am/problems/payment-provider-error",
        title: "ArCa register error",
        detail: "ArCa response did not include orderId/formUrl",
      };
    }

    return {
      orderId: registerResponse.orderId,
      formUrl: registerResponse.formUrl,
      rawResponse: registerResponse,
    };
  },

  async getOrderStatus(arcaOrderId: string): Promise<ArcaOrderStatusResponse> {
    if (!arcaOrderId.trim()) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/validation-error",
        title: "Validation Error",
        detail: "ArCa order ID is required",
      };
    }

    return postArcaForm<ArcaOrderStatusResponse>("getOrderStatusExtended.do", {
      orderId: arcaOrderId,
    });
  },

  isPaymentSuccessful(status: ArcaOrderStatusResponse): boolean {
    const errorCode = toErrorCode(status.errorCode);
    if (errorCode && errorCode !== "0") {
      return false;
    }

    const paymentState = status.paymentAmountInfo?.paymentState?.toUpperCase();
    const orderStatus = toOrderStatus(status.orderStatus);
    const actionCode = toActionCode(status.actionCode);
    const actionIsSuccessful = actionCode === null || actionCode === 0;

    return actionIsSuccessful && (paymentState === "DEPOSITED" || orderStatus === 2);
  },
};
