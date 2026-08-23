export type Service = {
  id: number;
  name: string;
  duration: number;
};

export type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceId: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  service: Service;
};