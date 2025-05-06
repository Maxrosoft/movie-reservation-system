export default interface SuccessMessageI {
    type: "success";
    message: string;
    data?: object;
    code: number;
}
