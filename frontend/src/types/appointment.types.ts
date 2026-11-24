export type AppointmentId = string;

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | (string & {});

export interface Appointment {
  id: AppointmentId;
  patientId: string;
  doctorId: string;
  organisationId?: string;
  appointmentDate: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  organisationId?: string;
  appointmentDate: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
}
