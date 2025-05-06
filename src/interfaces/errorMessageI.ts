export default interface ErrorMessageI {
    type: "error";
    message: string;
    data?: any;
    code: number;
}
