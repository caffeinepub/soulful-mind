import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    status: BookingStatus;
    serviceType: string;
    owner: Principal;
    date: string;
    name: string;
    createdAt: bigint;
    time: string;
    email: string;
    message: string;
}
export interface BookingInput {
    serviceType: string;
    date: string;
    name: string;
    time: string;
    email: string;
    message: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Course {
    id: bigint;
    title: string;
    duration: string;
    description: string;
    category: string;
    price: string;
    modules: Array<string>;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    rejected = "rejected",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCourses(): Promise<Array<Course>>;
    getMyBookings(): Promise<Array<Booking>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBooking(input: BookingInput): Promise<bigint>;
    updateBookingStatus(bookingId: bigint, status: BookingStatus): Promise<void>;
}
