import { Document, Types } from 'mongoose';

export type EventVisibility = 'public' | 'private';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  coverImage: string;
  visibility: EventVisibility;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  coverImage: string;
  visibility?: EventVisibility;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  category?: string;
  coverImage?: string;
  visibility?: EventVisibility;
}

export interface EventQueryFilters {
  category?: string;
  search?: string;
  visibility?: { $in: EventVisibility[] };
  $or?: Array<Record<string, any>>;
}
