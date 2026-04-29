export class DecimalTransformer {
  to(data: number | null | undefined): number | null | undefined {
    return data;
  }

  from(data: string | null | undefined): number | null {
    return data === null || data === undefined ? null : Number(data);
  }
}
