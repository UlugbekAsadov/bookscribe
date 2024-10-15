export interface IRequest {
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
  successMessage: string;
  isFetching: boolean;
}
