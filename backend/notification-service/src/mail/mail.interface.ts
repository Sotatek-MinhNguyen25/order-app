
export interface IMailService {
  sendOrderStatusMail(
    to: string,
    order: {
      id: string;
      productName: string;
      amount: number;
      status: string;
    },
  ): Promise<void>;
}
