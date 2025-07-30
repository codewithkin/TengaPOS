declare module "paynow" {
    type InitResponse = {
        status: string,
        success: boolean,
        hasRedirect: boolean,
        isInnbucks: boolean,
        pollUrl: string,
        redirectUrl: string
    }

    class Paynow {
        resultUrl: string
        returnUrl: string

        createPayment: (param: string) => {
            add: (item: string, price: number) => void;
        };

        send: (payment: {
            add: (item: string, price: number) => void;
        }) => Promise<InitResponse>;

        constructor(integrationID?: string, integrationKey?: string);
    }

}