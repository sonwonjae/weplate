interface Array<T> {
  shuffle(): T[];
  draw(): T extends { score: number } ? T : never;
}
