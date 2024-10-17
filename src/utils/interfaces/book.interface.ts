export interface IBook {
  book: {
    id: number;
    isbn: string;
    title: string;
    cover: string;
    author: string;
    published: number;
    pages: number;
  };
  status: number;
}

export interface ICreateBookForm {
  isbn: string;
}
