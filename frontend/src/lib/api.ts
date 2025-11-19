import { API_BASE, STATIC_API_TOKEN } from './config';

export type Customer = {
  id: number;
  name: string;
  email: string;
  taxId: string;
  phone?: string | null;
  address?: string;
  createdAt?: string;
};

export type Invoice = {
  id: number;
  customerId: number;
  customerName?: string;
  description: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  total: number;
  createdAt?: string;
};

export type DashboardData = {
  invoices: Invoice[];
  customers: Customer[];
  totalRevenue: number;
  outstanding: number;
};

async function request<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (STATIC_API_TOKEN) {
    headers.Authorization = `Bearer ${STATIC_API_TOKEN}`;
  }
  const response = await fetch(`${API_BASE}${path}`, { headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || response.statusText);
  }
  return response.json() as Promise<T>;
}

const fallbackCustomers: Customer[] = [
  {
    id: 1,
    name: 'Cliente Demo',
    email: 'demo@example.com',
    taxId: 'RFC123',
    address: 'CDMX'
  }
];

const fallbackInvoices: Invoice[] = [
  {
    id: 1,
    customerId: 1,
    customerName: 'Cliente Demo',
    description: 'Servicios de consultoria',
    status: 'sent',
    issueDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    total: 1500
  }
];

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [customersResponse, invoicesResponse] = await Promise.all([
      request<{ data: Customer[] }>('/clientes'),
      request<{ data: Invoice[] }>('/facturas')
    ]);
    const invoices = invoicesResponse.data;
    const customers = customersResponse.data;
    const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
    const outstanding = invoices.filter((invoice) => invoice.status !== 'paid').length;
    return { invoices, customers, totalRevenue, outstanding };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[dashboard] No se pudo consultar la API, usando datos de ejemplo.', message);
    const totalRevenue = fallbackInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const outstanding = fallbackInvoices.filter((invoice) => invoice.status !== 'paid').length;
    return {
      invoices: fallbackInvoices,
      customers: fallbackCustomers,
      totalRevenue,
      outstanding
    };
  }
}
