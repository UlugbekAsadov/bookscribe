import { EBookStatus } from "../enum/book-status.enum";

export const bookStatuses: Record<number, EBookStatus> = {
  0: EBookStatus.Active,
  1: EBookStatus.Inactive,
};
