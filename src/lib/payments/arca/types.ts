export interface ArcaRegisterResponse {
  orderId?: string;
  formUrl?: string;
  errorCode?: string | number;
  errorMessage?: string;
}

export interface ArcaOrderStatusAmountInfo {
  paymentState?: string;
  approvedAmount?: number;
  depositedAmount?: number;
}

export interface ArcaOrderStatusResponse {
  errorCode?: string | number;
  errorMessage?: string;
  orderNumber?: string;
  orderStatus?: number | string;
  actionCode?: number | string;
  paymentAmountInfo?: ArcaOrderStatusAmountInfo;
}

export interface ArcaRegisterOrderResult {
  orderId: string;
  formUrl: string;
  rawResponse: ArcaRegisterResponse;
}
