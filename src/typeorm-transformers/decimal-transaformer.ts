export class DecimalTransformer {
  to(data: number | null | undefined): number | null | undefined {
    return data === null || data === undefined ? null : data;
  }

  from(data: string | null | undefined): number | null | undefined {
    return data === null || data === undefined ? null : parseFloat(data);
  }
}
