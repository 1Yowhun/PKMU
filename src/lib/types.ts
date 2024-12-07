export interface Allocation {
  id?: number;
  giDate: Date | null;
  bpeNumber?: string | null;
  deliveryNumber: string;
  agentId?: string | null;
  shipTo: string;
  materialName: string;
  agentName: string;
  plannedGiDate: Date;
  period?: string | null;
  allocatedQty: number;
  status?: "Pending" | "Approved";
  createdBy: string;
  updatedBy: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface MonthlyAllocation {
  date: Date;
  totalElpiji: number;
  volume: number;
  createdBy: string;
  updatedBy: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface Agents {
  id: number;
  companyId?: number;
  companyName: string;
  agentId?: string | null;
  agentName: string;
  address: string;
  city: string;
  phone: string;
  fax?: string | null;
  createdBy: String;
  updatedBy: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface LpgDistributions {
  id: number;
  allocationId: number;
  deliveryNumber: string;
  bpeNumber: string;
  giDate: Date;
  shipTo: string;
  agentName: string;
  licensePlate: string;
  allocatedQty: number;
  driverName: string;
  distributionQty: number;
  volume: number;
  bocor?: number | null;
  isiKurang?: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface LpgDistributionSearch {
  id: number;
  deliveryNumber: string;
  agentName: string;
  allocatedQty: number;
  shipTo: string;
}

export interface Companies {
  id: number;
  companyName: string;
  address: string;
  telephone: string;
  createdBy: string;
  updatedBy: string;
  updatedAt: Date;
  createdAt: Date;
}

export type SignInValues = {
  username: string;
  password: string;
  role: string;
  company: any;
};

export interface RawDataMap {
  agentId?: string | null;
  SHIP_TO: string;
  SHIP_TO_NAME: string;
  DO_NUMBER: string;
  QUANTITY: number;
  MATERIAL_NAME: string;
  PLANNED_GI_DATE: string;
  giDate?: Date | null;
  bpe?: string | null;
  createdBy: string;
  updatedBy: string;
}

export interface RawDataMapMonthly {
  Tanggal: Date;
  Total_Elpiji: number;
  Volume_Total_Elpiji: number;
  createdBy: string;
  updatedBy: string;
  updatedAt?: Date;
  createdAt?: Date;
}
