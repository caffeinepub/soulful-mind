import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
    #rejected;
  };

  module BookingStatus {
    public func toText(status : BookingStatus) : Text {
      switch (status) {
        case (#pending) { "pending" };
        case (#confirmed) { "confirmed" };
        case (#completed) { "completed" };
        case (#cancelled) { "cancelled" };
        case (#rejected) { "rejected" };
      };
    };
  };

  type Booking = {
    id : Nat;
    name : Text;
    email : Text;
    serviceType : Text;
    date : Text;
    time : Text;
    message : Text;
    createdAt : Int;
    status : BookingStatus;
    owner : Principal;
  };

  module Booking {
    public func compare(a : Booking, b : Booking) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type Course = {
    id : Nat;
    title : Text;
    description : Text;
    price : Text;
    duration : Text;
    modules : [Text];
    category : Text;
  };

  type BookingInput = {
    name : Text;
    email : Text;
    serviceType : Text;
    date : Text;
    time : Text;
    message : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  var nextBookingId = 1;

  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let courses = List.fromArray<Course>([
    {
      id = 1;
      title = "Basic Digital Marketing Course";
      description = "Master SEO, social media strategy, content creation, and paid advertising to grow your brand online.";
      price = "₹15,000";
      duration = "8 weeks";
      modules = ["Brand Identity & Strategy", "SEO & Content", "Social Media", "Paid Advertising", "Email Marketing", "Analytics"];
      category = "Marketing";
    },
    {
      id = 2;
      title = "Tarot & Intuitive Arts";
      description = "Understand basics of tarot reading.";
      price = "₹12,000";
      duration = "6 weeks";
      modules = ["Introduction to tarot", "Card meanings", "Tarot spreads"];
      category = "spiritual growth";
    },
  ]);

  // Helper functions
  func getBookingInternal(id : Nat) : Booking {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  // User Profile Management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Bookings

  public shared ({ caller }) func submitBooking(input : BookingInput) : async Nat {
    let id = nextBookingId;
    nextBookingId += 1;

    let booking : Booking = {
      id;
      name = input.name;
      email = input.email;
      serviceType = input.serviceType;
      date = input.date;
      time = input.time;
      message = input.message;
      createdAt = Time.now();
      status = #pending;
      owner = caller;
    };

    bookings.add(id, booking);
    id;
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    bookings.values().toArray().filter(func(b) { b.owner == caller }).sort();
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all bookings");
    };
    bookings.values().toArray().sort();
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, status : BookingStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update booking status");
    };
    let booking = getBookingInternal(bookingId);
    let updatedBooking = { booking with status };
    bookings.add(booking.id, updatedBooking);
  };

  // Courses (pre-seeded)
  public query ({ caller }) func getCourses() : async [Course] {
    courses.toArray();
  };
};
