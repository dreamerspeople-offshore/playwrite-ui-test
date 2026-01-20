export function normalize(data: any[]) {
  return data.map((item) => ({
    name: item.name?.toLowerCase(),
    email: item.email?.toLowerCase(),
    role: item.role?.toLowerCase(),
  }));
}
